export interface OBParser {
    split(input: string, delimiter: string): IStatement[];
    getFormatText(input: string): string | null;
    parse(input: string, offset?: number, completionCallback?: (tokens: string[], currentRules: string[], followRules: string[]) => void): any;
    
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
    Oracle,
    OBMySQL
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