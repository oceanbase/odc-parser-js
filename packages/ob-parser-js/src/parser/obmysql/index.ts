import simpleFormatter from '../format/simpleFormatter';
//@ts-ignore
import { initParser } from './support';
//@ts-ignore
import mysqlParser from './obmysql';
import { IStatement, OBParser } from '../type';
import SQLSplit from '../split';

initParser(mysqlParser.Parser.prototype, new Set([1892,1890, 1891]))


export default class MySQLParser implements OBParser {
    split(input: string, delimiter: string): IStatement[] {
        const spliter = new SQLSplit(input, delimiter)
        return spliter.split();
    }
    parse(input: string, offset?: number, completionCallback?: (tokens: string[], currentRules: string[], followRules: string[]) => void) {
        return mysqlParser.parse(input, offset, completionCallback);
    }
    getFormatText(input: string) {
        return simpleFormatter(input, true);
    }
}

