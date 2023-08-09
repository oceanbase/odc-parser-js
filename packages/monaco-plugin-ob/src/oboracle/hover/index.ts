import * as monaco from 'monaco-editor';
import { PLugin } from '../../Plugin';
import { IFromTable, ITableVariable } from '../worker/type';
import wrapWorker from '../worker/workerInstance';
import { findTargetTable, findTargetVariable } from './helper';

class MonacoHover implements monaco.languages.HoverProvider {
    plugin: PLugin | null = null;
    constructor(plugin) {
        this.plugin = plugin;
    }
    private isInRange(range: [number, number], offset) {
        return offset <= range[1] && offset >= range[0]
    }
    provideHover(model: monaco.editor.ITextModel, position: monaco.Position, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.Hover> {
        return Promise.resolve().then(async () => {
            const parser = wrapWorker.parser;
            const input = model.getValue();
            const delimiter = this.plugin?.modelOptionsMap.get(model.id)?.delimiter || ';';
            const offset = model.getOffsetAt(position);
            const { tables, tableVariables }: { tables: IFromTable[], tableVariables: ITableVariable[] } = await parser.getAllFromTable(input, delimiter, offset);
            const tableVariableObj = await findTargetVariable(tableVariables, tables, offset);
            if (tableVariableObj) {
                const fromTable = tableVariableObj.table;
                const { name, schema, nameLocation, schemaLocation, column, columnLocation, location } = tableVariableObj.tableVariable;
                const fullName = [schema, name, column].filter(Boolean).join('.')
                switch(tableVariableObj.type) {
                    case 'column': {
                        return {
                            range: {
                                startLineNumber: columnLocation.first_line,
                                startColumn: columnLocation.first_column + 1,
                                endLineNumber: columnLocation.last_line,
                                endColumn: columnLocation.last_column + 1
                            },
                            contents: [
                                { value: `**Column: ${fullName}**` },
                                !!fromTable && {
                                    value: (await this.plugin?.modelOptionsMap.get(model.id)?.getTableDDL?.(name, schema)) || '', 
                                }
                            ].filter(Boolean)
                        }
                    }
                    case 'table': {
                        if (fromTable)  {
                            const fullDBName = [fromTable.schema, fromTable.name].filter(Boolean).join('.');
                            return {
                                range: {
                                    startLineNumber: nameLocation.first_line,
                                    startColumn: nameLocation.first_column + 1,
                                    endLineNumber: nameLocation.last_line,
                                    endColumn: nameLocation.last_column + 1
                                },
                                contents: [
                                    {
                                        value: `**${fullDBName}${fromTable.alias ? `(${fromTable.alias})` : ''}**`
                                    },
                                    {
                                        value: [
                                            '```sql',
                                            (await this.plugin?.modelOptionsMap.get(model.id)?.getTableDDL?.(fromTable.name, fromTable.schema)) || '',
                                            '```'
                                        ].join('\n')
                                    }
                                ]
                            }
                        }
                        break;
                    }
                    case 'schema': {
                        return {
                            range: {
                                startLineNumber: schemaLocation.first_line,
                                startColumn: schemaLocation.first_column + 1,
                                endLineNumber: schemaLocation.last_line,
                                endColumn: schemaLocation.last_column + 1
                            },
                            contents: [
                                {
                                    value: `**${schema}**`
                                },
                                {
                                    value: `Schema Info`
                                }
                            ]
                        }
                    }
                    case 'all': {
                        return {
                            range: {
                                startLineNumber: location.first_line,
                                startColumn: location.first_column + 1,
                                endLineNumber: location.last_line,
                                endColumn: location.last_column + 1
                            },
                            contents: [
                                { value: `**Column: ${fullName}**` },
                                !!fromTable && {
                                    value: (await this.plugin?.modelOptionsMap.get(model.id)?.getTableDDL?.(name, schema)) || '', 
                                }
                            ].filter(Boolean)
                        }
                    }
                }
            } else {
                const table = await findTargetTable(tables, offset);
                if (table) {
                    const { name, schema, nameLocation, schemaLocation, location, alias } = table.table;
                    const fullName = [schema, name].filter(Boolean).join('.')
                    switch(table.type) {
                        case 'table': {
                            return {
                                range: {
                                    startLineNumber: nameLocation.first_line,
                                    startColumn: nameLocation.first_column + 1,
                                    endLineNumber: nameLocation.last_line,
                                    endColumn: nameLocation.last_column + 1
                                },
                                contents: [
                                    {
                                        value: `**${fullName}${alias ? `(${alias})` : ''}**`
                                    },
                                    {
                                        value: [
                                            '```sql',
                                            (await this.plugin?.modelOptionsMap.get(model.id)?.getTableDDL?.(name, schema)) || '',
                                            '```'
                                        ].join('\n')
                                    }
                                ]
                            }
                        }
                        case 'schema': {
                            return {
                                range: {
                                    startLineNumber: schemaLocation.first_line,
                                    startColumn: schemaLocation.first_column + 1,
                                    endLineNumber: schemaLocation.last_line,
                                    endColumn: schemaLocation.last_column + 1
                                },
                                contents: [
                                    {
                                        value: `**${schema}**`
                                    },
                                    {
                                        value: (await this.plugin?.modelOptionsMap.get(model.id)?.getSchemaInfo?.()) || 'Not Found Schema Info'
                                    }
                                ]
                            }
                        }
                        case 'all': {
                            return {
                                range: {
                                    startLineNumber: location.first_line,
                                    startColumn: location.first_column + 1,
                                    endLineNumber: location.last_line,
                                    endColumn: location.last_column + 1
                                },
                                contents: [
                                    {
                                        value: `**${fullName}${alias ? `(${alias})` : ''}**`
                                    },
                                    {
                                        value: [
                                            '```sql',
                                            (await this.plugin?.modelOptionsMap.get(model.id)?.getTableDDL?.(name, schema)) || '',
                                            '```'
                                        ].join('\n')
                                    }
                                ]
                            }
                        }
                    }
                }
            }
            return {
                contents: []
            }
        })
    }
}



export default MonacoHover;