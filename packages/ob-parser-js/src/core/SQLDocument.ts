import { OBParser, SQLType } from '../parser/type';
import SQLStatement from './SQLStatement';

import MySQLParser from '../parser/mysql';
import OracleParser from '../parser/oracle';
import OBMySQLParser from '../parser/obmysql';

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
        this.parser = new ParserClass(false);
        this.split();
    }
    private split() {
        const sqls = this.parser.split(this.text, this.delimiter);
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
                parser: new Parser(!!sqlObj.isPL),
                isPL: !!sqlObj.isPL,
                isDelimiterStmt: !!sqlObj.isDelimiter,
                delimiter: sqlObj.delimiter,
                tokens: sqlObj.tokens
            })
        });
    }
    private getParserClass() {
        switch(this.type) {
            case SQLType.MySQL: {
                return MySQLParser
            }
            case SQLType.Oracle: {
                return OracleParser;
            }
            case SQLType.OBMySQL: {
                return OBMySQLParser
            }
        }
    }
    public getFormatText() {
        return this.statements.map((stmt) => {
            return stmt.getFormatText() + (stmt.isDelimiter ? '' : stmt.delimiter)
        }).join('\n')
    }
}
export default SQLDocument;
