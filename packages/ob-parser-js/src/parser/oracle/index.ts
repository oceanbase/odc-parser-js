import simpleFormatter from '../format/simpleFormatter';


import parser from 'assets/oracleSQL_ori';
import { initParser } from '../oracle/support';
import plParser from 'assets/oraclePL';


initParser(parser.Parser.prototype, new Set([1844, 1843]))
initParser(plParser.Parser.prototype, new Set([557,556]))

import { IStatement, OBParser } from '../type';
import SQLSplit from '../split';



export default class OracleParser implements OBParser {
    private isPL: boolean = false;
    constructor(isPL: boolean) {
        this.isPL = isPL;
    }
    split(input: string, delimiter: string): IStatement[] {
        const spliter = new SQLSplit(input, delimiter)
        return spliter.split();
    }
    parse(input: string, offset?: number, completionCallback?: (tokens: string[], currentRules: string[], followRules: string[]) => void) {
        if (this.isPL) {
            return plParser.parse(input, offset, completionCallback);
        }
        return parser.parse(input, offset, completionCallback);
    }
    getFormatText(input: string) {
        return simpleFormatter(input, false);
    }
}

