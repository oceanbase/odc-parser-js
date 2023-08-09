export interface OBParser {
    split(): IStatement[];
    getFormatText?(): string | null;
    getAllFromTable?(): {
        tables: {
            alias: string;
            schema: string;
            schemaLocation: INodeLocation;
            name: string;
            nameLocation: INodeLocation;
            location: INodeLocation;
        }[];
        tableVariables: {
            schema: string;
            schemaLocation: INodeLocation;
            name: string;
            nameLocation: INodeLocation;
            location: INodeLocation;
            column: string;
            columnLocation: INodeLocation;
        }[]
    }
}

export interface INodeLocation {
    first_line: number;
    last_line: number;
    first_column: number;
    last_column: number;
    range: [number, number]
}
export enum SQLType {
    MySQL,
    Oracle
}

export interface IStatement {
    text: string;
    range: {
        begin: number,
        end: number
    };
    startLineNumber: number;
    endLineNumber: number;
    startColumn: number;
    endColumn: number;
    delimiter: string;
    isPL?: boolean;
    isDelimiter?: boolean;
    tokens: IToken[]
}

export interface IToken {
    text: string;
    type: any;
    channel: any;
    start: number;
    stop: number;
}