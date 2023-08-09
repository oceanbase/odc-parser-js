import * as monaco from 'monaco-editor'
import { PLugin } from '../Plugin'
import { LanguageType } from '../type'
import MonacoAutoComplete from './autoComplete';
import { conf, language } from './monarch/obmysql';
import { DocumentFormattingEditProvider, DocumentRangeFormattingEditProvider } from '../format';

export function setup(plugin: PLugin) {
    monaco.languages.register({
        id: LanguageType.OB_MySQL
    });
    monaco.languages.setMonarchTokensProvider(LanguageType.OB_MySQL, language)
    monaco.languages.setLanguageConfiguration(LanguageType.OB_MySQL, conf);
    monaco.languages.registerCompletionItemProvider(LanguageType.OB_MySQL, new MonacoAutoComplete(plugin))
    monaco.languages.registerDocumentFormattingEditProvider(LanguageType.OB_MySQL, new DocumentFormattingEditProvider(plugin, LanguageType.OB_MySQL))
    monaco.languages.registerDocumentRangeFormattingEditProvider(LanguageType.OB_MySQL, new DocumentRangeFormattingEditProvider(plugin, LanguageType.OB_MySQL))

}