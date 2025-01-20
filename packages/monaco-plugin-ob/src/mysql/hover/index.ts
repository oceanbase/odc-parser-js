import * as monaco from 'monaco-editor';
import { PLugin } from '../../Plugin';
import parser from '../worker/parser';

class MonacoHover implements monaco.languages.HoverProvider {
    plugin: PLugin | null = null;
    constructor(plugin) {
        this.plugin = plugin;
    }
    provideHover(model: monaco.editor.ITextModel, position: monaco.Position, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.Hover> {
        if (!this.plugin?.modelOptionsMap.get(model.id)?.getTableDDL) {
            return;
        }
        return new Promise(async (resolve, reject) => {
            const word = model.getWordAtPosition(position)
            if (!word) {
                return resolve(null)
            }
            const delimiter = this.plugin?.modelOptionsMap.get(model.id)?.delimiter || ';';
            const offset = model.getOffsetAt(position);
            const result = await parser.getOffsetType(model.getValue(), delimiter, offset)
            if (!result) {
                resolve(null);
                return;
            }
            const { type, name, schema } = result;
            if (!name) {
                resolve(null);
                return;
            }
            const ddl = await this.plugin?.modelOptionsMap.get(model.id)?.getTableDDL?.(name, schema);
            if (!ddl) {
                resolve(null);
                return;
            }
            resolve({
                contents: [
                    {
                        value: '```sql\n '+ddl+' \n```'
                    }
                ]
            });
        })
    }
}



export default MonacoHover;