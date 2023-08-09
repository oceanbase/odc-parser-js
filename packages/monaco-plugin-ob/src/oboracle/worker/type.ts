import parser from "./parser";

export interface IWorker {
    parser: typeof parser
}

export interface INodeLocation {
    first_line: number;
    last_line: number;
    first_column: number;
    last_column: number;
    range: [number, number];
}

export interface IFromTable {
    alias: string;
    schema: string;
    schemaLocation: INodeLocation;
    name: string;
    nameLocation: INodeLocation;
    location: INodeLocation;
}
export interface ITableVariable {
    schema: string;
    schemaLocation: INodeLocation;
    name: string;
    nameLocation: INodeLocation;
    column: string;
    columnLocation: INodeLocation;
    location: INodeLocation;
}