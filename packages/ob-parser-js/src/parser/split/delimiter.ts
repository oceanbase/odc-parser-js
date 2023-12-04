
import { Token } from 'antlr4';
import { IStatement } from '../type';
import TokenSequence from './TokenSequence';
interface Delimiter {
    begin: number;
    end: number;
    startLineNumber: number;
    endLineNumber: number;
    startColumn: number;
    endColumn: number;
    delimiter: string;
    text: string;
}

export default class DelimiterContext {
    private delimiter: Delimiter[] = [];
    private cache: {
        [key: number]: string;
    } = {};
    public filterTokens: Token[] = [];
    constructor(tokens: Token[], defaultDelimiter: string = ";") {
        if (defaultDelimiter) {
            /**
             * 初始化的 delimiter
             */
            this.delimiter.push({
                begin: -1,
                end: -1,
                startLineNumber: -1,
                endLineNumber: -1,
                startColumn: -1,
                endColumn: -1,
                text: "delimiter " + defaultDelimiter,
                delimiter: defaultDelimiter
            })
        }
        this.initDelimiterContext(tokens)
    }
    private initDelimiterContext(tokens: Token[]) {
        const tokensCopy = [...tokens];
        const tokenSequence = new TokenSequence(tokens);
        while (!tokenSequence.isEnd()) {
            const token = tokenSequence.nextToken();
            if (token.text.toLowerCase() === 'delimiter') {
                const tokens = tokenSequence.nextNoEmptyToken(["\r\n", "\n"]);
                if (tokens?.length) {
                    const delimiterIdx = tokensCopy.findIndex((_token) => {
                        return _token === token;
                    });
                    const delimiterEndIdx = tokensCopy.findIndex((token) => {
                        return token === tokens[tokens.length - 1]
                    })
                    const textTokens = tokensCopy.splice(delimiterIdx, delimiterEndIdx - delimiterIdx + 1)
                    this.delimiter.push({
                        begin: token.start,
                        end: tokens[tokens.length - 1].stop,
                        startLineNumber: token.line,
                        startColumn: token.column,
                        endLineNumber: tokens[tokens.length - 1].line,
                        endColumn: tokens[tokens.length - 1].column,
                        delimiter: tokens.map(token => token.text.trim()).join(""),
                        text: textTokens.map(token => token.text).join("")
                    })
                }
            }
        }
        this.filterTokens = tokensCopy;
    }
    public getContextDelimiter(token: Token) {
        const tokenStart = token.start;
        if (!this.cache[tokenStart]) {
            const idx = this.delimiter.findIndex(({ begin }, index) => {
                return tokenStart < begin;
            });
            if (idx === -1){
                this.cache[tokenStart] = this.delimiter[this.delimiter.length - 1]?.delimiter;
            } else {
                this.cache[tokenStart] = this.delimiter[idx - 1]?.delimiter;
            }
            
        }
        return this.cache[tokenStart]
    }
    /**
     * 判断token是否在delimiter stmt中
     */
    public isDelimiterToken (token: Token) {
        if (!token) {
            return;
        }
        const tokenStart = token.start;
        return !!this.delimiter.find(({ begin, end }) => {
            return begin <= tokenStart && tokenStart <= end
        });
    }
    public getDelimiterStatements(): IStatement[] {
        return this.delimiter.filter(delimiter => delimiter.end >= 0).map((delimiter) => {
            return {
                text: delimiter.text,
                range: {
                    begin: delimiter.begin,
                    end: delimiter.end
                },
                startLineNumber: delimiter.startLineNumber,
                startColumn: delimiter.startColumn,
                endLineNumber: delimiter.endLineNumber,
                endColumn: delimiter.endColumn,
                tokens: [],
                isDelimiter: true,
                delimiter: ""
            }
        })
    }
}