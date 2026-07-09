import * as monaco from 'monaco-editor';
import { CompletionObjectKind, functionItem, keywordItem, objectItem, routineItem, schemaItem, snippetItem, tableColumnItem, tableItem } from '../../autoComplete/completionItem';
import { PLugin } from '../../Plugin';
import { AutoCompletionItems } from '../../types/autoCompletion';
import functions from '../functions';
import { keywords } from '../keywords';

import worker from '../worker/workerInstance';
import { getCompletionArgs } from '../../autoComplete';
import { IObjectCompletion } from '../../type';
import { getContextualSuggestions } from '../../autoComplete/contextual';
import { getKeywordFallbackCompletions, withParserCompletionTimeout } from '../../autoComplete/parserFallback';

class MonacoAutoComplete implements monaco.languages.CompletionItemProvider {
    triggerCharacters?: string[] | undefined = ['.'];
    plugin: PLugin | null = null;
    constructor(plugin: PLugin) {
        this.plugin = plugin;
    }
    public getModelOptions(modelId: string) {
        return this.plugin?.modelOptionsMap.get(modelId);
    }
    public uniqSuggestions(suggestions: monaco.languages.CompletionItem[]) {
        const map = new Map<string, monaco.languages.CompletionItem>();
        suggestions.forEach(suggestion => {
            const label = typeof suggestion.label === 'string' ? suggestion.label : suggestion.label.label;
            map.set(label, suggestion);
        })
        return Array.from(map.values());
    }
    public async safeRun<T>(getter: (() => Promise<T> | T | undefined) | undefined, fallback: T): Promise<T> {
        if (!getter) {
            return fallback;
        }
        try {
            const result = await getter();
            return result === undefined ? fallback : result;
        } catch (e) {
            return fallback;
        }
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
        const columns = await this.safeRun(() => modelOptions?.getTableColumns?.(item.tableName, item.schemaName), []);
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
        const schemaList = await this.safeRun(() => modelOptions?.getSchemaList?.(), []);
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
        const tables = await this.safeRun(() => modelOptions?.getTableList?.(schema), []);
        if (tables) {
            tables.forEach(table => {
                suggestions.push(tableItem(table, schema, false, range))
            })
        }
        return suggestions;
    }

    async getObjectList(model, schema, range, kind: CompletionObjectKind, getter?: (schema?: string) => Promise<IObjectCompletion[]>) {
        const suggestions: monaco.languages.CompletionItem[] = [];
        const objects = await this.safeRun(() => getter?.(schema), []);
        if (objects) {
            objects.forEach(object => {
                suggestions.push(objectItem(object, kind, range))
            })
        }
        return suggestions;
    }

    async getTableLikeObjects(model, schema, range) {
        let modelOptions = this.getModelOptions(model.id);
        return ([] as monaco.languages.CompletionItem[])
            .concat(await this.getTableList(model, schema, range))
            .concat(await this.getObjectList(model, schema, range, 'View', modelOptions?.getViewList))
            .concat(await this.getObjectList(model, schema, range, 'External Table', modelOptions?.getExternalTableList))
            .concat(await this.getObjectList(model, schema, range, 'Materialized View', modelOptions?.getMaterializedViewList))
            .concat(await this.getObjectList(model, schema, range, 'Synonym', modelOptions?.getSynonymList));
    }

    async getSnippets(model, range) {
        let modelOptions = this.getModelOptions(model.id);
        const snippets  = await this.safeRun(() => modelOptions?.getSnippets?.(), []);
        return (snippets || []).map(s => {
            return snippetItem(s, range)
        })
    }

    async getFunctions(model, range) {
        return (await this.getUserFunctions(model, range)).concat(functions.map(func => {
            return functionItem(func, range)
        }))
    }

    async getUserFunctions(model, range) {
        let modelOptions = this.getModelOptions(model.id);
        const udf  = await this.safeRun(() => modelOptions?.getFunctions?.(), []);
        return (udf || []).map(func => {
            return functionItem(func, range, true)
        })
    }

    async getRoutines(model, range) {
        return (await this.getUserRoutines(model, range)).concat(functions.map(func => {
            return functionItem(func, range)
        }))
    }

    async getUserRoutines(model, range) {
        let modelOptions = this.getModelOptions(model.id);
        const procedures = await this.safeRun(() => modelOptions?.getProcedure?.(), []);
        return (await this.getUserFunctions(model, range)).concat((procedures || []).map(procedure => {
            return routineItem(procedure, range, 'Procedure', true)
        }))
    }

    async getPackages(model, range) {
        let modelOptions = this.getModelOptions(model.id);
        const packages = await this.safeRun(() => modelOptions?.getPkgs?.(), []);
        return (packages || []).map(pkg => {
            return objectItem(pkg, 'Package', range)
        })
    }

    async getPackageSubprograms(model, item, range) {
        let modelOptions = this.getModelOptions(model.id);
        const subprograms = await this.safeRun(() => modelOptions?.getPackageSubprograms?.(item.packageName, item.schemaName), []);
        return (subprograms || []).map(subprogram => {
            return routineItem(subprogram, range, 'Subprogram')
        })
    }

    async getAllObjects(model, range) {
        let modelOptions = this.getModelOptions(model.id);
        return ([] as monaco.languages.CompletionItem[])
            .concat(await this.getTableLikeObjects(model, undefined, range))
            .concat(await this.getRoutines(model, range))
            .concat(await this.getPackages(model, range))
            .concat(await this.getObjectList(model, undefined, range, 'Trigger', modelOptions?.getTriggerList))
            .concat(await this.getObjectList(model, undefined, range, 'Type', modelOptions?.getDataTypes))
            .concat(await this.getObjectList(model, undefined, range, 'Sequence', modelOptions?.getSequenceList));
    }

    async getCompleteWordFromOffset(offset: number, input: string, delimiter: string, range: monaco.IRange, model: monaco.editor.ITextModel, triggerCharacter?: string): Promise<monaco.languages.CompletionList> {
        const contextualSuggestions = await getContextualSuggestions({
            input,
            offset,
            range,
            autoNext: this.getModelOptions(model.id)?.autoNext ?? true,
            keywords,
            getTableList: completionRange => this.getTableList(model, undefined, completionRange),
            getTableLikeObjects: completionRange => this.getTableLikeObjects(model, undefined, completionRange),
            getUserFunctions: completionRange => this.getUserFunctions(model, completionRange),
            getUserRoutines: completionRange => this.getUserRoutines(model, completionRange),
            getPackages: completionRange => this.getPackages(model, completionRange),
            getPackageSubprograms: (item, completionRange) => this.getPackageSubprograms(model, item, completionRange)
        });
        if (contextualSuggestions) {
            return {
                suggestions: this.uniqSuggestions(contextualSuggestions),
                incomplete: false
            }
        }
        const parser = worker.parser;
        const result: AutoCompletionItems = await withParserCompletionTimeout(
            parser.getAutoCompletion(input, delimiter, offset),
            () => getKeywordFallbackCompletions(input, offset, keywords),
        )
        if (result) {
            let modelOptions = this.getModelOptions(model.id);
            let suggestions: monaco.languages.CompletionItem[] = [];
            let onlyKeywords = true;
            const hasAllTableLikeObjects = result.some(item => typeof item !== 'string' && item.type === 'allTableLikeObjects');
            for (let item of result) {
                if (typeof item !== 'string') {
                    onlyKeywords = false;
                }
                if (typeof item === 'string') {
                    suggestions.push(keywordItem(item, range, this.getModelOptions(model.id)?.autoNext ?? true))
                } else if (item.type === 'allTables') {
                    if (hasAllTableLikeObjects) {
                        continue;
                    }
                    suggestions = suggestions.concat(await this.getTableList(model, item.schema, range))
                } else if (item.type === 'allTableLikeObjects') {
                    suggestions = suggestions.concat(await this.getTableLikeObjects(model, item.schema, range))
                } else if (item.type === 'tableColumns') {
                    suggestions = suggestions.concat(await this.getColumnList(model, item, range, item.autoNext !== false));
                } else if (item.type === 'withTable') {
                    suggestions.push(tableItem(item.tableName, 'CTE', false, range))
                } else if (item.type === 'allSchemas') {
                    suggestions = suggestions.concat(await this.getSchemaList(model, range));
                } else if (item.type === 'objectAccess') {
                    const objectName = item.objectName;
                    const schemaList = await this.safeRun(() => modelOptions?.getSchemaList?.(), []);
                    const schema = schemaList?.find(s => s === objectName);
                    if (schema) {
                        suggestions = suggestions.concat(await this.getTableLikeObjects(model, item.objectName, range))
                        continue;
                    }
                    const arr = objectName.split('.');
                    const packageSuggestions = await this.getPackageSubprograms(model, { packageName: arr.length > 1 ? arr[1] : arr[0], schemaName: arr.length > 1 ? arr[0] : undefined }, range);
                    if (packageSuggestions?.length) {
                        suggestions = suggestions.concat(packageSuggestions);
                        continue;
                    }
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
                } else if (item.type === 'allRoutines') {
                    suggestions = suggestions.concat(await this.getRoutines(model, range))
                } else if (item.type === 'allPackages') {
                    suggestions = suggestions.concat(await this.getPackages(model, range))
                } else if (item.type === 'allObjects') {
                    suggestions = suggestions.concat(await this.getAllObjects(model, range))
                } else if (item.type === 'packageSubprograms') {
                    suggestions = suggestions.concat(await this.getPackageSubprograms(model, item, range))
                }
            }
            if (onlyKeywords) {
                suggestions.push(keywordItem("RETURN", range, this.getModelOptions(model.id)?.autoNext ?? true));
                suggestions = suggestions.concat(
                    await this.getSnippets(model, range)
                )
            }
            return {
                suggestions: this.uniqSuggestions(suggestions),
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
