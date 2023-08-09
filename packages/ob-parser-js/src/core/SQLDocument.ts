import { MySQLParser, OracleParser } from '../parser';
import { OBParser, SQLType } from '../parser/type';
import SQLStatement from './SQLStatement';

const defaultOptions = {
    type: SQLType.Oracle,
    delimiter: ';'
}

class SQLDocument {
    private text: string;
    public statements: SQLStatement[];
    private type: SQLType = SQLType.Oracle;
    private delimiter: string = ';';
    private parser: OBParser;

    constructor(options: {
        text: string;
        type: SQLType;
        delimiter: string;
    }) {
        options = Object.assign({}, defaultOptions, options);
        this.text = options.text || '';
        this.type = options.type;
        this.delimiter = options.delimiter || ';';
        const ParserClass = this.getParserClass();
        this.parser = new ParserClass(this.text, { delimiter: this.delimiter });
        this.split();
    }
    private split() {
        const sqls = this.parser.split();
        this.statements = sqls?.map((sqlObj) => {
            const Parser = this.getParserClass();
            return new SQLStatement({
                text: sqlObj.text,
                start: sqlObj.range.begin,
                stop: sqlObj.range.end,
                startLineNumber: sqlObj.startLineNumber,
                startColumn: sqlObj.startColumn,
                endLineNumber: sqlObj.endLineNumber,
                endColumn: sqlObj.endColumn,
                parser: new Parser(sqlObj.text, { delimiter: sqlObj.delimiter, isPL: sqlObj.isPL }),
                isPL: sqlObj.isPL,
                isDelimiterStmt: sqlObj.isDelimiter,
                delimiter: sqlObj.delimiter,
                tokens: sqlObj.tokens
            })
        });
    }
    private getParserClass() {
        if (this.type == SQLType.MySQL) {
            return MySQLParser;
        } else {
            return OracleParser
        }
    }
    public getFormatText() {
        const delimiter = this.delimiter;
        return this.statements.map((stmt) => {
            return stmt.getFormatText() + (stmt.isDelimiter ? '' : stmt.delimiter)
        }).join('\n')
    }
}
export default SQLDocument;
