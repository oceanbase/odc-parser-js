import { Token } from 'antlr4';

class TokenSequence {
    private tokens: Token[];
    private offset: number = -1;

    constructor(tokens: Token[]) {
        this.tokens = tokens
    }

    public getTokenIdx () {
        return this.offset;
    }

    public nextToken (): Token {
        if (this.isEnd()) {
            return this.getToken();
        }
        this.offset++;
        return this.getToken();
    }
    public nextNoEmptyToken(stopTokens?: string[]): Token[] {
        let start = null;
        while (!this.isEnd()) {
            const token = this.nextToken();
            if (token.text) {
                if (start === null) {
                    start = this.offset;
                }
                if (stopTokens) {
                    const nextToken = this.lookAhead();
                    /**
                     * 需要处理一下 token 为多个换行符的情况
                     */
                    let isMatch = false;
                    const isRelineToken = !nextToken.text?.trim() && nextToken.text.includes('\n');
                    if (isRelineToken) {
                        isMatch = stopTokens.includes('\n');
                    } else {
                        isMatch = stopTokens.includes(nextToken.text);
                    }
                    if (isMatch || !nextToken || nextToken?.type === Token.EOF) {
                        /**
                         * 匹配到stop token。或者没有更多token了，则截断
                         */
                        return this.tokens.slice(start, this.offset + 1);
                    }
                } else {
                    return [token];
                }
            }
        }
    }
    public lookAhead(offset: number = 1) {
        return this.tokens[this.offset + offset];
    }

    public getToken() {
        return this.tokens[this.offset];
    }
    public isEnd() {
        return (this.tokens.length - 1) <= this.offset;
    }
}

export default TokenSequence;