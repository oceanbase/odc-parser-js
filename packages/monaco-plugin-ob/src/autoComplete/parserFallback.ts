import * as monaco from 'monaco-editor';
import { keywordItem } from './completionItem';

const PARSER_COMPLETION_TIMEOUT = 800;

export async function withParserCompletionTimeout<T>(
    completion: Promise<T>,
    onTimeout: () => T,
    timeout = PARSER_COMPLETION_TIMEOUT,
): Promise<T> {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<T>(resolve => {
        timeoutId = setTimeout(() => resolve(onTimeout()), timeout);
    });
    try {
        return await Promise.race([completion, timeoutPromise]);
    } finally {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    }
}

export function getKeywordFallbackCompletions(
    input: string,
    offset: number,
    keywords: string[],
): string[] {
    const prefix = input.substring(0, offset).match(/[A-Za-z_][A-Za-z0-9_$#]*$/)?.[0]?.toUpperCase();
    if (!prefix) {
        return [];
    }
    return keywords.filter(keyword => keyword.toUpperCase().startsWith(prefix));
}

export function getKeywordFallbackItems(
    input: string,
    offset: number,
    keywords: string[],
    range: monaco.IRange,
    autoNext: boolean,
): monaco.languages.CompletionItem[] {
    return getKeywordFallbackCompletions(input, offset, keywords).map(keyword =>
        keywordItem(keyword, range, autoNext),
    );
}
