import * as monaco from 'monaco-editor';

import { LanguageType } from '../type';
import { PLugin } from '../Plugin';


async function format(text: string, type: LanguageType, delimiter: string) {
  const { SQLType, plugins } = await import('@oceanbase-odc/ob-parser-js');
  const map = {
    [LanguageType.OB_MySQL]: SQLType.OBMySQL,
    [LanguageType.MySQL]: SQLType.MySQL,
    [LanguageType.OB_Oracle]: SQLType.Oracle
  }
  const formatted: string = plugins.format({
    sql: text,
    type: map[type],
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
    
    return new Promise(async (resolve) => {
      const formatMsg = await format(text, this.type, this.plugin?.modelOptionsMap.get(model.id)?.delimiter || ';')
       resolve([
        {
          range,
          text:formatMsg
        }
      ])
    }) 
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
    return new Promise(async (resolve) => {
      const formatMsg = await format(text, this.type, this.plugin?.modelOptionsMap.get(model.id)?.delimiter || ';')
      return [
        {
          range,
          text: formatMsg
        }
      ]
    })
  }
}
