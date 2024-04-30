
import * as monaco from 'monaco-editor';
import { IFunction, ISnippet } from '../type';

export enum CompletionItemSort{
    Star = "37",
    Keyword = '50',
    Table = '39',
    Column = '38',
    Function = '51',
    Schema = '40',
    Snippet = '52'
}

export function keywordItem(keyword: string, range: monaco.languages.CompletionItemRanges | monaco.IRange): monaco.languages.CompletionItem {
    return {
        label: keyword,
        range,
        insertText: keyword + ' ',
        kind: monaco.languages.CompletionItemKind.Keyword,
        command: {id: 'editor.action.triggerSuggest', title: "" },
        sortText: keyword === "*" ? CompletionItemSort.Star :  CompletionItemSort.Keyword
    }
}

export function tableItem(tableName: string, schemaName: string = '', insertSchema: boolean = false, range: monaco.languages.CompletionItemRanges | monaco.IRange): monaco.languages.CompletionItem {
    const name = !insertSchema ? tableName : [schemaName, tableName].filter(Boolean).join('.');
    return {
        label: { label: name, description: 'Table', detail: ' ' + schemaName },
        range,
        insertText: name,
        kind: monaco.languages.CompletionItemKind.Class,
        sortText: CompletionItemSort.Table
    }
}

export function tableColumnItem(columnName: string, tableName: string, schemaName: string = '', range: monaco.languages.CompletionItemRanges | monaco.IRange): monaco.languages.CompletionItem {
    const tableFullName = [schemaName, tableName].filter(Boolean).join('.');
    return {
        label: { label: columnName, description: 'Column', detail: ' ' + tableFullName },
        range,
        insertText: columnName + ' ',
        kind: monaco.languages.CompletionItemKind.Field,
        command: {id: 'editor.action.triggerSuggest', title: "" },
        sortText: CompletionItemSort.Column
    }
}
export function functionItem(func: IFunction, range: monaco.languages.CompletionItemRanges | monaco.IRange): monaco.languages.CompletionItem {
    const params = func.params?.map((param, index) => `${'$'}{${index + 1}:${typeof param === 'string' ? param : param.name}}`).join(', ') || ''
    const paramsDocument = func.params?.map((param, index) => `${typeof param === 'string' ? param : param.name}`).join(', ') || ''

    return {
        label: { label: func.name, description: 'Function', detail: ' ' + func.desc },
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: `${func.name}(${paramsDocument})`,
        insertText: `${func.name}(${params}) `,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
        sortText: CompletionItemSort.Function
    }
}

export function snippetItem(s: ISnippet, range: monaco.languages.CompletionItemRanges | monaco.IRange) {
    return {
        label: s.label,
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: s.documentation,
        insertText: s.insertText,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
        sortText: CompletionItemSort.Snippet
    }
}

export function schemaItem(schemaName: string, range: monaco.languages.CompletionItemRanges | monaco.IRange): monaco.languages.CompletionItem {

    return {
        label: schemaName,
        kind: monaco.languages.CompletionItemKind.Module,
        detail: 'Schema',
        insertText: schemaName,
        range,
        sortText: CompletionItemSort.Schema
    }
}