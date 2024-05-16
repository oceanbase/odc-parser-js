import * as monaco from 'monaco-editor'
import { PLugin } from '../Plugin'
import { LanguageType } from '../type'
import MonacoAutoComplete from './autoComplete';
// import MonacoDefinition from './definition';
// import MonacoHover from './hover';
import { conf, language } from './monarch/oboracle';
import { DocumentFormattingEditProvider, DocumentRangeFormattingEditProvider } from '../format';
import MonacoInlineComplete from '../inlineCompletion';

export function setup (plugin: PLugin) {
    monaco.languages.register({
        id: LanguageType.OB_Oracle
    });
    monaco.languages.setMonarchTokensProvider(LanguageType.OB_Oracle, language);
    monaco.languages.setLanguageConfiguration(LanguageType.OB_Oracle, conf);
    monaco.languages.registerCompletionItemProvider(LanguageType.OB_Oracle, new MonacoAutoComplete(plugin))
    // monaco.languages.registerHoverProvider(LanguageType.OB_Oracle, new MonacoHover(plugin));
    // monaco.languages.registerDefinitionProvider(LanguageType.OB_Oracle, new MonacoDefinition(plugin))
    monaco.languages.registerDocumentFormattingEditProvider(LanguageType.OB_Oracle, new DocumentFormattingEditProvider(plugin, LanguageType.OB_Oracle))
    monaco.languages.registerDocumentRangeFormattingEditProvider(LanguageType.OB_Oracle, new DocumentRangeFormattingEditProvider(plugin, LanguageType.OB_Oracle))
    monaco.languages.registerInlineCompletionsProvider(LanguageType.OB_Oracle, new MonacoInlineComplete(plugin))
}