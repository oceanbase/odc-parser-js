
import * as monaco from 'monaco-editor';
import { IFunction } from '../type';

export function keywordItem(keyword: string, range: monaco.languages.CompletionItemRanges | monaco.IRange): monaco.languages.CompletionItem {
    return {
        label: keyword,
        range,
        insertText: keyword,
        kind: monaco.languages.CompletionItemKind.Keyword
    }
}

export function tableItem(tableName: string, schemaName: string = '', insertSchema: boolean = false, range: monaco.languages.CompletionItemRanges | monaco.IRange): monaco.languages.CompletionItem {
    const name = !insertSchema ? tableName : [schemaName, tableName].filter(Boolean).join('.');
    return {
        label: { label: name, description: 'Table', detail: ' ' + schemaName },
        range,
        insertText: name,
        kind: monaco.languages.CompletionItemKind.Class
    }
}

export function tableColumnItem(columnName: string, tableName: string, schemaName: string = '', range: monaco.languages.CompletionItemRanges | monaco.IRange): monaco.languages.CompletionItem {
    const tableFullName = [schemaName, tableName].filter(Boolean).join('.');
    return {
        label: { label: columnName, description: 'Column', detail: ' ' + tableFullName },
        range,
        insertText: columnName,
        kind: monaco.languages.CompletionItemKind.Field
    }
}
export function functionItem(func: IFunction, range: monaco.languages.CompletionItemRanges | monaco.IRange): monaco.languages.CompletionItem {
    const params = func.params?.map((param, index) => `${'$'}{${index + 1}:${typeof param === 'string' ? param : param.name}}`).join(', ') || ''
    const paramsDocument = func.params?.map((param, index) => `${typeof param === 'string' ? param : param.name}`).join(', ') || ''

    return {
        label: { label: func.name, description: 'Function', detail: ' ' + func.desc },
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: `${func.name}(${paramsDocument})`,
        insertText: `${func.name}(${params})`,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range
    }
}

export function schemaItem(schemaName: string, range: monaco.languages.CompletionItemRanges | monaco.IRange): monaco.languages.CompletionItem {

    return {
        label: schemaName,
        kind: monaco.languages.CompletionItemKind.Module,
        detail: 'Schema',
        insertText: schemaName,
        range
    }
}