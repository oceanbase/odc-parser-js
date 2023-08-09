import * as monaco from 'monaco-editor';
import { functionItem, keywordItem, schemaItem, tableColumnItem, tableItem } from '../../autoComplete/completionItem';
import { PLugin } from '../../Plugin';
import { AutoCompletionItems } from '../../types/autoCompletion';
import functions from '../functions';
import _package from '../package';

import worker from '../worker/workerInstance';

const plsqlDataTypes = [
    'PLS_INTEGER', 'BINARY_INTEGER', 'BINARY_FLOAT', 'BINARY_DOUBLE', 'NUMBER', 'DEC', 'DECIMAL', 'NUMERIC', 'DOUBLE PRECISION', 'FLOAT', 'INT', 'INTEGER', 'SMALLINT', 'REAL',
    'CHAR', 'VARCHAR2', 'RAW', 'NCHAR', 'NVARCHAR2', 'LONG', 'LONG RAW', 'ROWID', 'UROWID',
    'YEAR', 'MONTH', 'DAY', 'HOUR', 'MINUTE', 'SECOND', 'TIMEZONE_HOUR', 'TIMEZONE_MINUTE', 'TIMEZONE_REGION', 'TIMEZONE_ABBR',
    'BFILE', 'BLOB', 'CLOB', 'NCLOB'
]

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
                    const columns = await modelOptions?.getTableColumns?.(tableName, schemaName);
                    if (columns?.length) {
                        suggestions = suggestions.concat(await this.getColumnList(model, item, range));
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
        // console.time('getToken')
        // const tokens = await parser.getOffsetLeftTokens(input, delimiter, offset);
        // console.timeEnd('getToken')
        // const autoComplte = new AutoComplete(getContext(), input, offset, tokens)
        // const matchContext = autoComplte.match();
        // if (!matchContext) {
        //     return {
        //         suggestions: [],
        //         incomplete: false
        //     }
        // }
        // let suggestions: monaco.languages.CompletionItem[] = [];
        // let modelOptions = this.getModelOptions(model.id);
        // for (let word of matchContext.completeWords) {
        //     switch (word) {
        //         case completeToken.COMPLETE_TOKEN_TABLES: {
        //             let tables = await modelOptions?.getTableList?.();
        //             if (tables) {
        //                 suggestions = suggestions.concat(
        //                     tables.map(table => ({
        //                         label: table,
        //                         kind: monaco.languages.CompletionItemKind.Struct,
        //                         detail: 'TABLE',
        //                         insertText: table,
        //                         range
        //                     }))
        //                 )
        //             }
        //             break;
        //         }
        //         case completeToken.COMPLETE_TOKEN_VIEWS: {
        //             let views = await modelOptions?.getViewList?.();
        //             if (views) {
        //                 suggestions = suggestions.concat(
        //                     views.map(view => ({
        //                         label: view,
        //                         kind: monaco.languages.CompletionItemKind.Variable,
        //                         detail: 'VIEW',
        //                         insertText: view,
        //                         range
        //                     }))
        //                 )
        //             }
        //             break;
        //         }
        //         case completeToken.COMPLETE_TOKEN_FUNCTIONS: {
        //             if (functions) {
        //                 suggestions = suggestions.concat(
        //                     functions.map(func => {
        //                         const params = func.params?.map((param, index) => `${'$'}{${index + 1}:${typeof param === 'string' ? param : param.name}}`).join(', ') || ''
        //                         const paramsDocument = func.params?.map((param, index) => `${typeof param === 'string' ? param : param.name}`).join(', ') || ''
        //                         return {
        //                             label: func.name,
        //                             kind: monaco.languages.CompletionItemKind.Function,
        //                             detail: func.desc,
        //                             documentation: `${func.name}(${paramsDocument})`,
        //                             insertText: `${func.name}(${params})`,
        //                             insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        //                             range
        //                         }
        //                     })
        //                 )
        //             }
        //             break;
        //         }
        //         case completeToken.COMPLETE_TOKEN_PROCEDURES: {
        //             let procedures = await modelOptions?.getProcedure?.();
        //             if (procedures) {
        //                 suggestions = suggestions.concat(
        //                     procedures.map(pro => ({
        //                         label: pro,
        //                         kind: monaco.languages.CompletionItemKind.Variable,
        //                         detail: 'PROCEDURE',
        //                         insertText: pro,
        //                         range
        //                     }))
        //                 )
        //             }
        //             break;
        //         }
        //         case completeToken.COMPLETE_TOKEN_PKG: {
        //             let userPkgs = await modelOptions?.getPkgs?.() || [];
        //             const systemPkgs = _package;
        //             let pkgs = systemPkgs.concat(userPkgs);
        //             if (pkgs) {
        //                 suggestions = suggestions.concat(
        //                     pkgs.map(pkg => ({
        //                         label: pkg,
        //                         kind: monaco.languages.CompletionItemKind.Variable,
        //                         detail: 'PACKAGE',
        //                         insertText: pkg,
        //                         range
        //                     }))
        //                 )
        //             }
        //             break;
        //         }
        //         case completeToken.COMPLETE_TOKEN_DATATYPES: {
        //             let types = await modelOptions?.getDataTypes?.();
        //             if (types) {
        //                 suggestions = suggestions.concat(
        //                     types.map(type => ({
        //                         label: type,
        //                         kind: monaco.languages.CompletionItemKind.Enum,
        //                         insertText: type,
        //                         range
        //                     }))
        //                 )  
        //             }
        //             break;                    
        //         }
        //         case completeToken.COMPLETE_TOKEN_FROM_TABLES: {
        //             /**
        //              * 需要依靠解析
        //              */
        //             const parser = worker.parser;
        //             const { tables } = await parser.getAllFromTable(input, delimiter, offset);
        //             const names = new Set<string>(tables?.map(t => {
        //                 if (t.alias) {
        //                     return t.alias;
        //                 }
        //                 return [t.schema, t.name].filter(Boolean).join('.')
        //             }));
        //             if (names?.size) {
        //                 suggestions = suggestions.concat(
        //                     Array.from(names).map(name => ({
        //                         label: name,
        //                         kind: monaco.languages.CompletionItemKind.Field,
        //                         insertText: name,
        //                         range
        //                     }))
        //                 )  
        //             }
        //             break;
        //         }
        //         case completeToken.COMPLETE_TOKEN_PLDATATYPES: {
        //             suggestions = suggestions.concat(
        //                 plsqlDataTypes.map(type => ({
        //                     label: type,
        //                     kind: monaco.languages.CompletionItemKind.Enum,
        //                     insertText: type,
        //                     range
        //                 }))
        //             )  
        //             break;                    
        //         }
        //         case completeToken.COMPLETE_TOKEN_TABLE_COLUMNS: {
        //             const columns = await modelOptions?.getTableColumns?.('table1');
        //             if (columns) {
        //                 suggestions = suggestions.concat(
        //                     columns.map(column => ({
        //                         label: column.columnName,
        //                         kind: monaco.languages.CompletionItemKind.Field,
        //                         detail: column.columnType,
        //                         insertText: column.columnName,
        //                         range
        //                     }))
        //                 )
        //             }
        //             break;
        //         }
        //         default: {
        //             suggestions.push({
        //                 label: word,
        //                 kind: monaco.languages.CompletionItemKind.Keyword,
        //                 insertText: word + ' ',
        //                 range
        //             })
        //         }
        //     }
        // }
        // return {
        //     suggestions,
        //     incomplete: true
        // }
    }
}

export default MonacoAutoComplete;
