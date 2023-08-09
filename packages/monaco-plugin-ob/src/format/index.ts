import * as monaco from 'monaco-editor';

import { plugins, SQLType } from '@oceanbase-odc/ob-parser-js';
import { LanguageType } from '../type';
import { PLugin } from '../Plugin';


function format(text: string, type: LanguageType, delimiter: string) {
  const formatted: string = plugins.format({
    sql: text,
    type: type === LanguageType.OB_MySQL ? SQLType.MySQL : SQLType.Oracle,
    delimiter
  });

  return formatted;
}

export class DocumentFormattingEditProvider implements monaco.languages.DocumentFormattingEditProvider {
  plugin: PLugin | null = null;
  type: LanguageType = LanguageType.OB_MySQL;
  constructor(plugin: PLugin, type: LanguageType) {
    this.plugin = plugin;
    this.type = type;
  }
  provideDocumentFormattingEdits(model: monaco.editor.ITextModel, options: monaco.languages.FormattingOptions, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.TextEdit[]> {
    const text: string = model.getValue();
    const range: monaco.Range = model.getFullModelRange();

    return [
      {
        range,
        text: format(text, this.type, this.plugin?.modelOptionsMap.get(model.id)?.delimiter || ';')
      }
    ]
  }
}

export class DocumentRangeFormattingEditProvider implements monaco.languages.DocumentRangeFormattingEditProvider {
  plugin: PLugin | null = null;
  type: LanguageType = LanguageType.OB_MySQL;
  constructor(plugin: PLugin, type: LanguageType) {
    this.plugin = plugin;
    this.type = type;
  }
  provideDocumentRangeFormattingEdits(model: monaco.editor.ITextModel, range: monaco.Range, options: monaco.languages.FormattingOptions, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.TextEdit[]> {
    const text: string = model.getValueInRange(range);

    return [
      {
        range,
        text: format(text, this.type, this.plugin?.modelOptionsMap.get(model.id)?.delimiter || ';')
      }
    ]
  }
}
