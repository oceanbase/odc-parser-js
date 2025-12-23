import * as monaco from 'monaco-editor';
import { functionItem, keywordItem, schemaItem, snippetItem, tableColumnItem, tableItem } from '../../autoComplete/completionItem';
import { PLugin } from '../../Plugin';
import { AutoCompletionItems } from '../../types/autoCompletion';
import functions from '../functions';
import _package from '../package';

import worker from '../worker/workerInstance';
import { getCompletionArgs } from '../../autoComplete';


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
        const { offset, value, delimiter, range, triggerCharacter } = getCompletionArgs(model, position, context, this.plugin)

        return this.getCompleteWordFromOffset(offset, value, delimiter, range, model, triggerCharacter)
    }

    async getColumnList(model, item, range, autoNext: boolean = true) {
        let modelOptions = this.getModelOptions(model.id);
        const suggestions: monaco.languages.CompletionItem[] = [];
        let columns = await modelOptions?.getTableColumns?.(item.tableName, item.schemaName);
        if (!columns?.length && !item.schemaName) {
            columns = await modelOptions?.getTableColumns?.(item.tableName, 'sys');
        }
        if (columns) {
            columns.forEach(column => {
                suggestions.push(tableColumnItem(column.columnName, item.tableName, item.schemaName, range, autoNext))
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

    async getSnippets(model, range) {
        let modelOptions = this.getModelOptions(model.id);
        const snippets  = await modelOptions?.getSnippets?.();
        return (snippets || []).map(s => {
            return snippetItem(s, range)
        })
    }

    async getCompleteWordFromOffset(offset: number, input: string, delimiter: string, range: monaco.IRange, model: monaco.editor.ITextModel, triggerCharacter?: string): Promise<monaco.languages.CompletionList> {
        const parser = worker.parser;
        const result: AutoCompletionItems = await parser.getAutoCompletion(input, delimiter, offset)
        if (result) {
            let modelOptions = this.getModelOptions(model.id);
            let suggestions: monaco.languages.CompletionItem[] = [];
            let onlyKeywords = true;
            for (let item of result) {
                if (typeof item !== 'string') {
                    onlyKeywords = false;
                }
                if (typeof item === 'string') {
                    suggestions.push(keywordItem(item, range, this.getModelOptions(model.id)?.autoNext ?? true))
                } else if (item.type === 'allTables') {
                    suggestions = suggestions.concat(await this.getTableList(model, item.schema, range));
                    if (!item.schema && !item.disableSys) {
                        /**
                         * add oracle sys public views
                         */
                        suggestions = suggestions.concat(await this.getTableList(model, 'sys', range));
                    }
                } else if (item.type === 'tableColumns') {
                    suggestions = suggestions.concat(await this.getColumnList(model, item, range, item.autoNext !== false));
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
            if (onlyKeywords) {
                suggestions = suggestions.concat(
                    await this.getSnippets(model, range)
                )
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
