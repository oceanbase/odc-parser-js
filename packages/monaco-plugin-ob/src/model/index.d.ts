import { Query } from "./query";

export interface ILocation {
    first_line: number;
    last_line: number;
    first_column: number;
    last_column: lnumber;
    range: [number, number];
}
export interface ISelectColumn {
    expr: string;
    alias?: string;
    star?: boolean;
    /**
     * 对象访问的属性，只有为单纯的列才有值
     */
    columnName?: string[] | string;
    location: ILocation;
}

export interface IFromTable {
    schemaName?: string;
    tableName?: string;
    alias?: string;
    query?: Query;
    location: ILocation;
    join?: IFromTable;
}

export interface IWithTable {
    tableName: string;
    columnAlias?: string[];
    query: Query;
    location: ILocation;
}

export interface IOrderBy {
    location: ILocation;
    sortExprs: ILocation[];
}

