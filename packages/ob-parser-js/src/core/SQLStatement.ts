import { INodeLocation, IToken, OBParser } from "../parser/type";

class SQLStatement {
    public text: string;
    private parser: OBParser;
    public start: number;
    public stop: number;
    public startLineNumber: number;
    public endLineNumber: number;
    public startColumn: number;
    public endColumn: number;
    public delimiter: string;
    private isDelimiterStmt: boolean = false;
    public isPL: boolean = false;
    public isDelimiter: boolean;
    public tokens: IToken[] = [];

    constructor(config: {
        text: string;
        start: number;
        stop: number;
        startLineNumber: number;
        endLineNumber: number;
        startColumn: number;
        endColumn: number;
        parser: OBParser;
        delimiter: string;
        isDelimiterStmt: boolean;
        isPL: boolean;
        tokens: IToken[]
    }) {
        this.text = config.text;
        this.start = config.start;
        this.stop = config.stop;
        this.startLineNumber = config.startLineNumber;
        this.endLineNumber = config.endLineNumber;
        this.startColumn = config.startColumn;
        this.endColumn = config.endColumn;
        this.parser = config.parser;
        this.delimiter = config.delimiter;
        this.isDelimiterStmt = config.isDelimiterStmt;
        this.isPL = config.isPL;
        this.tokens = config.tokens;
        if (this.text.indexOf('delimiter') === 0) {
            this.isDelimiter = true;
        }
    }
    parse(...args) {
        return this.parser.parse(this.text, ...args);
    }
    getFormatText() {
        if (this.isDelimiterStmt) {
            return this.text;
        } else if (!this.text.trim()) {
            /**
             * 空串直接输出
             */
            return this.text;
        }
        return this.parser.getFormatText(this.text) || this.text;
    }
    getAllFromTable() {
        return [];
    }
    private convertLocation (location: INodeLocation): INodeLocation {
        if (!location) {
            return location;
        }
        const { first_line, first_column, last_column, last_line, range } = location;
        const isFirstLine = first_line === 1;
        return {
            first_line: first_line + this.startLineNumber - 1,
            first_column: first_line === 1 ? first_column + this.startColumn : first_column,
            last_column: last_line === 1 ? last_column + this.startColumn : last_column,
            last_line: last_line + this.startLineNumber - 1,
            range: [range[0] + this.start, range[1] + this.start]
        }
    }
}

export default SQLStatement;
