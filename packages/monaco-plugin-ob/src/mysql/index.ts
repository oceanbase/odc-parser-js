import * as monaco from 'monaco-editor'
import { PLugin } from '../Plugin'
import { LanguageType } from '../type'
import MonacoAutoComplete from './autoComplete';
import { conf, language } from './monarch/mysql';
import { DocumentFormattingEditProvider, DocumentRangeFormattingEditProvider } from '../format';
import MonacoInlineComplete from '../inlineCompletion';

export function setup(plugin: PLugin) {
    monaco.languages.register({
        id: LanguageType.MySQL
    });
    monaco.languages.setMonarchTokensProvider(LanguageType.MySQL, language)
    monaco.languages.setLanguageConfiguration(LanguageType.MySQL, conf);
    monaco.languages.registerCompletionItemProvider(LanguageType.MySQL, new MonacoAutoComplete(plugin))
    monaco.languages.registerDocumentFormattingEditProvider(LanguageType.MySQL, new DocumentFormattingEditProvider(plugin, LanguageType.MySQL))
    monaco.languages.registerDocumentRangeFormattingEditProvider(LanguageType.MySQL, new DocumentRangeFormattingEditProvider(plugin, LanguageType.MySQL))
    monaco.languages.registerInlineCompletionsProvider(LanguageType.MySQL, new MonacoInlineComplete(plugin))

}