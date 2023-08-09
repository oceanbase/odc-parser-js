import * as monaco from 'monaco-editor';
import { PLugin } from '../../Plugin';
import { findTargetVariable } from '../hover/helper';
import { IFromTable, ITableVariable } from '../worker/type';
import wrapWorker from '../worker/workerInstance';

class MonacoDefinition implements monaco.languages.DefinitionProvider {
    plugin: PLugin | null = null;
    constructor(plugin) {
        this.plugin = plugin;
    }
    private isInRange(range: [number, number], offset) {
        return offset <= range[1] && offset >= range[0]
    }
    provideDefinition(
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        token: monaco.CancellationToken
    ): monaco.languages.ProviderResult<monaco.languages.Definition> {
        return Promise.resolve().then(async () => {
            const parser = wrapWorker.parser;
            const input = model.getValue();
            const delimiter = this.plugin?.modelOptionsMap.get(model.id)?.delimiter || ';';
            const offset = model.getOffsetAt(position);
            const { tables, tableVariables }: { tables: IFromTable[], tableVariables: ITableVariable[] } = await parser.getAllFromTable(input, delimiter, offset);
            const tablesMap: Record<string, IFromTable> = {};
            const tablesAliasMap: Record<string, IFromTable> = {}
            tables.forEach(table => {
                const { alias, schema, name, schemaLocation, nameLocation } = table;
                const fullName = [schema,name].filter(Boolean).join('.');
                if (alias) {
                    tablesAliasMap[alias] = table;
                }
                tablesMap[fullName] = table;
            })
            const defines: monaco.languages.Definition = [];
            tableVariables.forEach(tv => {
                const { schema, name, column, schemaLocation, nameLocation, columnLocation } = tv;
                
                if (schemaLocation && this.isInRange(schemaLocation.range, offset)) {
                    defines.push({
                        uri: model.uri,
                        range: new monaco.Range(schemaLocation.first_line, schemaLocation.first_column + 1, schemaLocation.last_line, schemaLocation.last_column + 1),
                        originSelectionRange: new monaco.Range(schemaLocation.first_line, schemaLocation.first_column + 1, schemaLocation.last_line, schemaLocation.last_column + 1)
                    })
                }
                if (nameLocation && this.isInRange(nameLocation.range, offset)) {
                    const fullName = [schema, name].filter(Boolean).join('.');
                    if (schemaLocation) {
                        const table = tablesMap[fullName];
                        if (table) {
                            const target = table.location;
                            defines.push({
                                uri: model.uri,
                                range: new monaco.Range(target.first_line, target.first_column + 1, target.last_line, target.last_column + 1),
                                originSelectionRange: new monaco.Range(nameLocation.first_line, nameLocation.first_column + 1, nameLocation.last_line, nameLocation.last_column + 1),
                                targetSelectionRange: new monaco.Range(target.first_line, target.first_column + 1, target.last_line, target.last_column + 1),
                            })
                        }
                    } else {
                        const table = tablesAliasMap[fullName] || tablesMap[fullName];
                        if (table) {
                            const target = table.location;
                            defines.push({
                                uri: model.uri,
                                range: new monaco.Range(target.first_line, target.first_column + 1, target.last_line, target.last_column + 1),
                                originSelectionRange: new monaco.Range(nameLocation.first_line, nameLocation.first_column + 1, nameLocation.last_line, nameLocation.last_column + 1),
                                targetSelectionRange: new monaco.Range(target.first_line, target.first_column + 1, target.last_line, target.last_column + 1),
                            }) 
                        }
                    }
                    
                }
                if (columnLocation && this.isInRange(columnLocation.range, offset)) {
                    defines.push({
                        uri: model.uri,
                        range: new monaco.Range(columnLocation.first_line, columnLocation.first_column + 1, columnLocation.last_line, columnLocation.last_column + 1),
                        originSelectionRange: new monaco.Range(columnLocation.first_line, columnLocation.first_column + 1, columnLocation.last_line, columnLocation.last_column + 1)
                    })
                }
            })
            return defines;
        })
    }
}

export default MonacoDefinition;