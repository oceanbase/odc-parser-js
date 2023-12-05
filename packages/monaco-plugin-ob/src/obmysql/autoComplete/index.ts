import * as monaco from 'monaco-editor';
import { functionItem, keywordItem, schemaItem, tableColumnItem, tableItem } from '../../autoComplete/completionItem';
import { PLugin } from '../../Plugin';
import { AutoCompletionItems } from '../../types/autoCompletion';
import functions from '../functions';

import worker from '../worker/workerInstance';

class MonacoAutoComplete implements monaco.languages.CompletionItemProvider {
    triggerCharacters?: string[] | undefined = ['.'];
    plugin: PLugin | null = null;
    constructor(plugin: PLugin) {
        this.plugin = plugin;
    }
    public getModelOptions(modelId: string) {
        return this.plugin?.modelOptionsMap.get(modelId);
    }
    public provideCompletionItems(
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        context: monaco.languages.CompletionContext,
        token: monaco.CancellationToken
    ): monaco.languages.ProviderResult<monaco.languages.CompletionList> {
        const triggerCharacter = context.triggerCharacter;
        const delimiter = this.plugin?.modelOptionsMap.get(model.id)?.delimiter || ';';
        const word = model.getWordUntilPosition(position);
        const range: monaco.IRange = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
        }
        /**
         * select * fro|m
         * =>tokens: select * |
         * replace select * [fro|m]
         */
        const offset = model.getOffsetAt(position);
        return this.getCompleteWordFromOffset(offset, model.getValue(), delimiter, range, model, triggerCharacter)
    }

    async getColumnList(model, item, range) {
        let modelOptions = this.getModelOptions(model.id);
        const suggestions: monaco.languages.CompletionItem[] = [];
        const columns = await modelOptions?.getTableColumns?.(item.tableName, item.schemaName);
        if (columns) {
            columns.forEach(column => {
                suggestions.push(tableColumnItem(column.columnName, item.tableName, item.schemaName, range))
            })
        }
        return suggestions;
    }

    async getSchemaList(model, range) {
        let modelOptions = this.getModelOptions(model.id);
        const suggestions: monaco.languages.CompletionItem[] = [];
        const schemaList = await modelOptions?.getSchemaList?.();
        if (schemaList) {
            schemaList.forEach(schema => {
                suggestions.push(schemaItem(schema, range))
            })
        }
        return suggestions;
    }

    async getTableList(model, schema, range) {
        let modelOptions = this.getModelOptions(model.id);
        const suggestions: monaco.languages.CompletionItem[] = [];
        const tables = await modelOptions?.getTableList?.(schema);
        if (tables) {
            tables.forEach(table => {
                suggestions.push(tableItem(table, schema, false, range))
            })
        }
        return suggestions;
    }

    async getFunctions(model, range) {
        let modelOptions = this.getModelOptions(model.id);
        const udf  = await modelOptions?.getFunctions?.();
        return (udf || []).concat(functions).map(func => {
            return functionItem(func, range)
        })
    }

    async getCompleteWordFromOffset(offset: number, input: string, delimiter: string, range: monaco.IRange, model: monaco.editor.ITextModel, triggerCharacter?: string): Promise<monaco.languages.CompletionList> {
        const parser = worker.parser;
        const result: AutoCompletionItems = await parser.getAutoCompletion(input, delimiter, offset)
        if (result) {
            let modelOptions = this.getModelOptions(model.id);
            let suggestions: monaco.languages.CompletionItem[] = [];
            for (let item of result) {
                if (typeof item === 'string') {
                    suggestions.push(keywordItem(item, range))
                } else if (item.type === 'allTables') {
                    suggestions = suggestions.concat(await this.getTableList(model, item.schema, range))
                } else if (item.type === 'tableColumns') {
                    suggestions = suggestions.concat(await this.getColumnList(model, item, range));
                } else if (item.type === 'withTable') {
                    suggestions.push(tableItem(item.tableName, 'CTE', false, range))
                } else if (item.type === 'allSchemas') {
                    suggestions = suggestions.concat(await this.getSchemaList(model, range));
                } else if (item.type === 'objectAccess') {
                    const objectName = item.objectName;
                    const schemaList = await modelOptions?.getSchemaList?.();
                    const schema = schemaList?.find(s => s === objectName);
                    if (schema) {
                        suggestions = suggestions.concat(await this.getTableList(model, item.objectName, range))
                        continue;
                    }
                    const arr = objectName.split('.');
                    let tableName = arr.length > 1 ? arr[1] : arr[0];
                    let schemaName = arr.length > 1 ? arr[0] : undefined;
                    const columnSuggestions = await this.getColumnList(model, { tableName, schemaName }, range);
                    if (columnSuggestions?.length) {
                        suggestions = suggestions.concat(columnSuggestions);
                    }
                } else if (item.type === 'fromTable') {
                    suggestions.push(tableItem(item.tableName, item.schemaName, true, range))
                } else if (item.type === 'allFunction') {
                    suggestions = suggestions.concat(await this.getFunctions(model, range))
                }
            }
            return {
                suggestions,
                incomplete: false
            }
        }
        return {
            suggestions: [],
            incomplete: false
        }
    }
}

export default MonacoAutoComplete;
