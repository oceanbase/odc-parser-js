import * as monaco from 'monaco-editor';
import { keywordItem } from './completionItem';

const DROP_TARGET_KEYWORDS = [
    'TABLE',
    'VIEW',
    'FUNCTION',
    'PROCEDURE',
    'PACKAGE',
    'SEQUENCE',
    'TRIGGER',
    'TYPE',
    'SYNONYM'
];

const ALTER_TARGET_KEYWORDS = [
    'TABLE',
    'VIEW',
    'INDEX',
    'SEQUENCE',
    'SESSION',
    'SYSTEM',
    'USER'
];

const TOP_LEVEL_KEYWORDS = [
    'INSERT',
    'CALL'
];

export interface ContextualCompletionOptions {
    input: string;
    offset: number;
    range: monaco.IRange;
    autoNext: boolean;
    keywords: string[];
    getTableList: (range: monaco.IRange) => Promise<monaco.languages.CompletionItem[]>;
    getTableLikeObjects: (range: monaco.IRange) => Promise<monaco.languages.CompletionItem[]>;
    getUserFunctions?: (range: monaco.IRange) => Promise<monaco.languages.CompletionItem[]>;
    getUserRoutines?: (range: monaco.IRange) => Promise<monaco.languages.CompletionItem[]>;
    getPackages?: (range: monaco.IRange) => Promise<monaco.languages.CompletionItem[]>;
    getPackageSubprograms?: (item: { packageName: string; schemaName?: string }, range: monaco.IRange) => Promise<monaco.languages.CompletionItem[]>;
}

function getCursorRange(range: monaco.IRange): monaco.IRange {
    return {
        startLineNumber: range.endLineNumber,
        endLineNumber: range.endLineNumber,
        startColumn: range.endColumn,
        endColumn: range.endColumn
    }
}

function getKeywordSuggestions(words: string[], keywords: Set<string>, range: monaco.IRange, autoNext: boolean, prefix: string = '') {
    const normalizedPrefix = prefix.toUpperCase();
    return words
        .filter(word => keywords.has(word))
        .filter(word => !normalizedPrefix || word.startsWith(normalizedPrefix))
        .map(word => keywordItem(word, range, autoNext));
}

function getPackageAccess(leftText: string) {
    const matched = leftText.match(/([A-Za-z_][A-Za-z0-9_$#]*(?:\.[A-Za-z_][A-Za-z0-9_$#]*)?)\.\s*$/);
    if (!matched) {
        return null;
    }
    const parts = matched[1].split('.');
    return {
        packageName: parts.length > 1 ? parts[1] : parts[0],
        schemaName: parts.length > 1 ? parts[0] : undefined
    };
}

export async function getContextualSuggestions(options: ContextualCompletionOptions): Promise<monaco.languages.CompletionItem[] | null> {
    const {
        input,
        offset,
        range,
        autoNext,
        keywords,
        getTableList,
        getTableLikeObjects,
        getUserFunctions,
        getUserRoutines,
        getPackages,
        getPackageSubprograms
    } = options;
    const leftText = input.substring(0, offset);
    const cursorRange = getCursorRange(range);
    const keywordsSet = new Set(keywords);
    const topLevelKeywordPrefix = leftText.match(/^\s*([A-Za-z_][A-Za-z0-9_$#]*)$/)?.[1];
    const packageAccess = getPackageAccess(leftText);

    if (packageAccess && getPackageSubprograms) {
        const subprograms = await getPackageSubprograms(packageAccess, cursorRange);
        return subprograms.length ? subprograms : null;
    }
    if (topLevelKeywordPrefix) {
        const suggestions = getKeywordSuggestions(TOP_LEVEL_KEYWORDS, keywordsSet, range, autoNext, topLevelKeywordPrefix);
        if (suggestions.length) {
            return suggestions;
        }
    }
    if (/^\s*SELECT\s+(?:DISTINCT\s+)?\*\s*$/i.test(leftText)) {
        return getKeywordSuggestions(['FROM'], keywordsSet, cursorRange, autoNext);
    }
    if (/^\s*DELETE\s*$/i.test(leftText)) {
        return getKeywordSuggestions(['FROM'], keywordsSet, cursorRange, autoNext);
    }
    if (/^\s*INSERT\s+$/i.test(leftText)) {
        return getKeywordSuggestions(['INTO'], keywordsSet, cursorRange, autoNext);
    }
    if (/^\s*INSERT\s+INTO\s*$/i.test(leftText) || /^\s*UPDATE\s*$/i.test(leftText)) {
        return getTableList(cursorRange);
    }
    if (/^\s*DELETE\s+FROM\s*$/i.test(leftText)) {
        return getTableLikeObjects(cursorRange);
    }
    if (/^\s*DROP\s+TABLE\s*$/i.test(leftText) || /^\s*ALTER\s+TABLE\s*$/i.test(leftText)) {
        return getTableList(cursorRange);
    }
    if (/^\s*DROP\s+FUNCTION\s*$/i.test(leftText) && getUserFunctions) {
        return getUserFunctions(cursorRange);
    }
    if (/^\s*CALL\s+$/i.test(leftText)) {
        return ([] as monaco.languages.CompletionItem[])
            .concat(getUserRoutines ? await getUserRoutines(cursorRange) : [])
            .concat(getPackages ? await getPackages(cursorRange) : []);
    }
    if (/\b(?:FROM|JOIN)\s*$/i.test(leftText)) {
        return getTableLikeObjects(cursorRange);
    }
    if (/^\s*DROP\s*$/i.test(leftText)) {
        return getKeywordSuggestions(DROP_TARGET_KEYWORDS, keywordsSet, cursorRange, autoNext);
    }
    if (/^\s*ALTER\s*$/i.test(leftText)) {
        return getKeywordSuggestions(ALTER_TARGET_KEYWORDS, keywordsSet, cursorRange, autoNext);
    }
    return null;
}
