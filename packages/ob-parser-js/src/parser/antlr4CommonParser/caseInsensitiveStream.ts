import { Token, InputStream } from 'antlr4';

export default class CaseInsensitiveStream extends InputStream {
    constructor (data: string, decodeToUnicodeCodePoints?: boolean) {
        super(data, decodeToUnicodeCodePoints)
    }
    LA(offset) {
        const result = super.LA(offset);

        switch (result) {
            case 0:
            case Token.EOF:
                return result;
            default:
                return String.fromCharCode(result)
                    .toUpperCase()
                    .charCodeAt(0);
        }
    }
}