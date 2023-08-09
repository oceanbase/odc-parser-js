import { Recognizer, Token } from "antlr4";
import { ErrorListener } from "antlr4/error/ErrorListener";

export default class TmpErrorListener extends ErrorListener {
    public haveError = false;
    syntaxError(recognizer: Recognizer, offendingSymbol: Token, line: number, column: number, msg: string, e: any) {
        this.haveError = true;
    }
}