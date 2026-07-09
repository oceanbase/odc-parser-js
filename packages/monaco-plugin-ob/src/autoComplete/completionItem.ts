
import * as monaco from 'monaco-editor';
import { IFunction, IObjectCompletion, IRoutineCompletion, ISnippet } from '../type';

export enum CompletionItemSort{
    Star = "20",
    UserFunction = '30',
    UserRoutine = '31',
    Package = '32',
    Column = '38',
    Table = '39',
    Schema = '40',
    Object = '41',
    Routine = '42',
    Function = '51',
    Keyword = '80',
    Snippet = '90'
}

export type CompletionObjectKind =
    'Table' |
    'View' |
    'External Table' |
    'Materialized View' |
    'Procedure' |
    'Package' |
    'Trigger' |
    'Type' |
    'Sequence' |
    'Synonym';

function getObjectName(object: IObjectCompletion): string {
    return typeof object === 'string' ? object : object.name;
}

function getObjectDesc(object: IObjectCompletion): string {
    return typeof object === 'string' ? '' : object.desc || object.schema || '';
}

function getObjectKind(kind: CompletionObjectKind): monaco.languages.CompletionItemKind {
    switch (kind) {
        case 'Procedure':
            return monaco.languages.CompletionItemKind.Method;
        case 'Package':
            return monaco.languages.CompletionItemKind.Module;
        case 'Trigger':
            return monaco.languages.CompletionItemKind.Event;
        case 'Type':
            return monaco.languages.CompletionItemKind.Struct;
        case 'Sequence':
            return monaco.languages.CompletionItemKind.Value;
        case 'Synonym':
            return monaco.languages.CompletionItemKind.Reference;
        default:
            return monaco.languages.CompletionItemKind.Class;
    }
}

function getObjectSort(kind: CompletionObjectKind): CompletionItemSort {
    switch (kind) {
        case 'Procedure':
            return CompletionItemSort.Routine;
        case 'Package':
            return CompletionItemSort.Package;
        default:
            return CompletionItemSort.Object;
    }
}

export function keywordItem(keyword: string, range: monaco.languages.CompletionItemRanges | monaco.IRange, autoNext: boolean): monaco.languages.CompletionItem {
    return {
        label: keyword,
        range,
        insertText: keyword + ' ',
        kind: monaco.languages.CompletionItemKind.Keyword,
        command: autoNext ? {id: 'editor.action.triggerSuggest', title: "" } : undefined,
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

export function objectItem(object: IObjectCompletion, kind: CompletionObjectKind, range: monaco.languages.CompletionItemRanges | monaco.IRange): monaco.languages.CompletionItem {
    const name = getObjectName(object);
    const desc = getObjectDesc(object);
    return {
        label: { label: name, description: kind, detail: desc ? ' ' + desc : '' },
        range,
        insertText: name,
        kind: getObjectKind(kind),
        sortText: getObjectSort(kind)
    }
}

export function tableColumnItem(columnName: string, tableName: string, schemaName: string = '', range: monaco.languages.CompletionItemRanges | monaco.IRange, autoNext: boolean = true): monaco.languages.CompletionItem {
    const tableFullName = [schemaName, tableName].filter(Boolean).join('.');
    return {
        label: { label: columnName, description: 'Column', detail: ' ' + tableFullName },
        range,
        insertText: columnName + ' ',
        kind: monaco.languages.CompletionItemKind.Field,
        command: autoNext ? {id: 'editor.action.triggerSuggest', title: "" } : undefined,
        sortText: CompletionItemSort.Column
    }
}
export function functionItem(func: IFunction, range: monaco.languages.CompletionItemRanges | monaco.IRange, userDefined: boolean = false): monaco.languages.CompletionItem {
    return routineItem(func, range, 'Function', userDefined);
}

export function routineItem(routine: IRoutineCompletion, range: monaco.languages.CompletionItemRanges | monaco.IRange, description: 'Function' | 'Procedure' | 'Subprogram' = 'Function', userDefined: boolean = false): monaco.languages.CompletionItem {
    const func = typeof routine === 'string' ? { name: routine, desc: '' } : routine;
    const params = func.params?.map((param, index) => `${'$'}{${index + 1}:${typeof param === 'string' ? param : param.name}}`).join(', ') || ''
    const paramsDocument = func.params?.map((param, index) => `${typeof param === 'string' ? param : param.name}`).join(', ') || ''

    return {
        label: { label: func.name, description, detail: func.desc ? ' ' + func.desc : '' },
        kind: description === 'Function' ? monaco.languages.CompletionItemKind.Function : monaco.languages.CompletionItemKind.Method,
        documentation: `${func.name}(${paramsDocument})`,
        insertText: `${func.name}(${params}) `,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
        sortText: userDefined
            ? (description === 'Function' ? CompletionItemSort.UserFunction : CompletionItemSort.UserRoutine)
            : (description === 'Function' ? CompletionItemSort.Function : CompletionItemSort.Routine)
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
