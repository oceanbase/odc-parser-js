import { IFromTable, ITableVariable } from "../worker/type";

function isInRange(range: [number, number], offset) {
    return offset <= range[1] && offset >= range[0]
}

export async function findTargetVariable(tableVariables: ITableVariable[], tables: IFromTable[], offset: number): Promise<{
    type: 'table' | 'schema' | 'all' | 'column',
    tableVariable: ITableVariable,
    table: IFromTable
} | null> {
    const fromTablesMap = new Map();
    tables.forEach(table => {
        const { name, alias, schema } = table;
        const fullName = [schema, name].filter(Boolean).join('.');
        if (alias) {
            fromTablesMap.set(alias, table);
        } else {
            fromTablesMap.set(fullName, table);
        }
    })
    /**
     * variable 
     */
    for (let tableVariable of tableVariables) {
        const { schema, schemaLocation, name, nameLocation, column, columnLocation, location } = tableVariable;
        const fullName = [schema, name].filter(Boolean).join('.');
        const table = fromTablesMap.get(fullName);

        if (nameLocation && isInRange(nameLocation.range, offset)) {
            return {
                type: 'table',
                tableVariable,
                table
            }
        } else if (schemaLocation && isInRange(schemaLocation.range, offset)) {
            return {
                type: 'schema',
                tableVariable,
                table
            }
        } else if (columnLocation && isInRange(columnLocation.range, offset)) {
            return {
                type: 'column',
                tableVariable,
                table
            }
        } else if (isInRange(location.range, offset)) {
            return {
                type: 'all',
                tableVariable,
                table
            }
        } else {
            continue;
        }
    }
    return null
}

export async function findTargetTable(tables: IFromTable[], offset: number): Promise<{
    type: 'table' | 'schema' | 'all',
    table: IFromTable
} | null> {
    /**
     * variable 
     */
    for (let table of tables) {
        const { schema, schemaLocation, name, nameLocation, alias, location } = table;
        if (nameLocation && isInRange(nameLocation.range, offset)) {
            return {
                type: 'table',
                table
            }
        } else if (schemaLocation && isInRange(schemaLocation.range, offset)) {
            return {
                type: 'schema',
                table
            }
        } else if (isInRange(location.range, offset)) {
            return {
                type: 'all',
                table
            }
        } else {
            continue;
        }
    }
    return null
}