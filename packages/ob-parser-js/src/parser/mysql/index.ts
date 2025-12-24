import simpleFormatter from '../format/simpleFormatter';
//@ts-ignore
import { initParser } from './support';

import mysqlParser from 'assets/mysql';
import { IStatement, OBParser } from '../type';
import SQLSplit from '../split';

initParser(mysqlParser.Parser.prototype, new Set([]))


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

