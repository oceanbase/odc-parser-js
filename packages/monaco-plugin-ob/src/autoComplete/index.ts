import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import type { PLugin } from '../Plugin';

export function getCompletionArgs( 
    model: monaco.editor.ITextModel, 
    position: monaco.Position,
    context: monaco.languages.CompletionContext,
    plugin: PLugin | null
) {
    const triggerCharacter = context.triggerCharacter;
    const delimiter = plugin?.modelOptionsMap.get(model.id)?.delimiter || ';';
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
    let value = model.getValue();
    const offset = model.getOffsetAt(position);
    if (word?.word?.trim() === '' && !triggerCharacter) {
        /**
         * 自动触发补全，需要补一个字符来让解析顺利
         * 增加一个字符并不会对补全造成正确性的问题
         * 关键字补全：会自动去除当前的token
         * 表名补全：不会访问当前的token
         */
        value = value.substring(0, offset) + 's' + value.substring(offset)
    }
    return {
        offset, value, delimiter, range, triggerCharacter
    }
}