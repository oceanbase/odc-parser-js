import { IStatement, IToken } from '../type';
import { Token, CommonTokenStream } from 'antlr4';
import TmpErrorListener from './errorListener';
import CaseInsensitiveStream from './caseInsensitiveStream';
import DelimiterContext from './delimiter';
import TokenSequence from './TokenSequence';
import PLGuess from './PLGuess';
import { BlockContext } from './PLBlock';
import { PlSqlLexer as OraclePLLexer } from '../oracle/PlSqlLexer';


class SQLSplit {
    private CustomLexer = OraclePLLexer;
    public isPL: boolean = false;
    public tokens: CommonTokenStream;
    public input: string;
    private delimiter: string = ';';

    constructor(input: string, delimiter: string) {
        this.input = input;
        this.delimiter = delimiter || this.delimiter;
        this.getTokens();
    }
    private isMatchDelimiter(tokens: Token[], delimiter: string) {
        const lastIdx = tokens.length - 1;
        let txt = '';
        for (let i = lastIdx; i > 0; i--) {
            const token = tokens[i];
            if (token.channel === 0) {
                txt = token.text + txt;
                if (txt.length >= delimiter.length) {
                    return txt.endsWith(delimiter)
                }
            }
        }
        return false;
    }
    private convertTokens(stackTokens?: Token[]): IToken[] {
        return stackTokens?.map(token => {
            return {
                text: token.text,
                type: token.type,
                start: token.start,
                stop: token.stop,
                channel: token.channel
            }
        }) || []
    }
    public split() {
        let statements: IStatement[] = [];
        this.getTokens();
        this.tokens.fill();
        const tokens = this.tokens.tokens;
        const delimiterContext = new DelimiterContext(tokens, this.delimiter);
        const tokenSequence = new TokenSequence(delimiterContext.filterTokens);
        const plGuessIns = new PLGuess();
        const plBlockIns = new BlockContext();
        let stackTokens: Token[] = [];
        let isPL = false;
        let delimiter = this.delimiter;
        while (!tokenSequence.isEnd()) {
            const token = tokenSequence.nextToken();
            stackTokens.push(token);
            delimiter = delimiterContext.getContextDelimiter(token);
            plBlockIns.push(token.text);
            if (!isPL) {
                isPL = plGuessIns.pushAndGuess(token);
            }
            if (isPL) {
                if (delimiter === ';') {
                    /**
                     * 假如pl还在block中，就不能用‘/’来截断，因为‘/’可能出现在正常的语句中。
                     */
                    delimiter = plBlockIns.isEmpty() ? '/' : 'NOT_MATCH_ALL_DELIMITER'
                }
            }
            if (this.isMatchDelimiter(stackTokens, delimiter)) {
                const end = stackTokens[stackTokens.length - 1].stop - delimiter.length;
                const text = this.tokensToString(stackTokens);
                statements.push({
                    text: text.substring(0, text.length - delimiter.length),
                    range: {
                        begin: stackTokens[0].start,
                        end
                    },
                    startLineNumber: stackTokens[0].line,
                    startColumn: stackTokens[0].column,
                    endLineNumber: stackTokens[stackTokens.length - 1].line,
                    endColumn: stackTokens[stackTokens.length - 1].column - delimiter.length,
                    delimiter,
                    tokens: this.convertTokens(stackTokens),
                    isPL
                });
                plGuessIns.reset();
                plBlockIns.reset();
                stackTokens = [];
                isPL = false;
            } else if (delimiterContext.isDelimiterToken(tokens[token.tokenIndex + 1])) {
                /**
                 * 下一个 token 处在 delimiter 里面，直接截断
                 */
                const end = stackTokens[stackTokens.length - 1].stop;
                const text = this.tokensToString(stackTokens);
                statements.push({
                    text,
                    range: {
                        begin: stackTokens[0].start,
                        end
                    },
                    startLineNumber: stackTokens[0].line,
                    startColumn: stackTokens[0].column,
                    endLineNumber: stackTokens[stackTokens.length - 1].line,
                    endColumn: stackTokens[stackTokens.length - 1].column,
                    delimiter: "",
                    tokens: this.convertTokens(stackTokens),
                    isPL
                });
                plGuessIns.reset();
                plBlockIns.reset();
                stackTokens = [];
                isPL = false;
            }
        }
        if (stackTokens.length) {
            const end = stackTokens[stackTokens.length - 1].stop;
            const text = this.tokensToString(stackTokens);
            if (text.replace(/\s/g, '')) {
                statements.push({
                    text,
                    range: {
                        begin: stackTokens[0].start,
                        end
                    },
                    startLineNumber: stackTokens[0].line,
                    startColumn: stackTokens[0].column,
                    endLineNumber: stackTokens[stackTokens.length - 1].line,
                    endColumn: stackTokens[stackTokens.length - 1].column,
                    delimiter: "",
                    tokens: this.convertTokens(stackTokens),
                    isPL
                });
            }
        }
        const delimiterStatement = delimiterContext.getDelimiterStatements();
        return statements.concat(delimiterStatement).filter(Boolean).sort((stmt1, stmt2) => stmt1.range.begin - stmt2.range.begin);
    }
    private tokensToString(tokens: Token[]) {
        return tokens.map(token => token.type === Token.EOF ? '' : token.text).join("");
    }
    private getTokens() {
        const text = this.input;
        if (this.tokens) {
            return;
        }
        const input = new CaseInsensitiveStream(text);
        const lexer: any = new this.CustomLexer(input);
        let errorListener = new TmpErrorListener();
        lexer.addErrorListener(errorListener);
        const tokens = new CommonTokenStream(lexer);
        this.tokens = tokens;
        //@ts-ignore
        this.tokens.errorListener = errorListener;
    }
}
export default SQLSplit;