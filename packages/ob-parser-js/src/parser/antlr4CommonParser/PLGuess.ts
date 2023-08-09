import { Token } from 'antlr4';
import { isArray, isBoolean } from 'lodash';
/**
 * 链式结构，context.next -> context
 */
export class Context {
    current: string | string[] | Context;
    next: Context[] | null;
    constructor(current: string | string[] | Context) {
        this.current = current;
    }
    /**
     * 这里表示当前的context未完全匹配
     * 当current为context，并且context还有next的时候，说明context未完全匹配到
     */
    public isPreMatch() {
        return (this.current instanceof Context) && this.current.next;
    }
    /**
     * 连接下一个状态
     */
    public link(next: string | Context | Context[]) {
        if (isArray(next)) {
            this.next = next;
        } else if (typeof next === 'string') {
            this.next = [new Context(next)];
        } else {
            this.next = [next];
        }
        return this;
    }
    /**
     * 尝试进入下一个状态，失败的话还是返回自身，成功返回下一个状态
     */
    public tryNext(text: string) {
        if (this.isPreMatch() && this.current instanceof Context) {
            const currentNext = this.current.tryNext(text);
            if (currentNext !== this.current) {
                const newContext = cloneContext(this);
                newContext.current = currentNext;
                return newContext;
            }
            return this;
        }
        const nextContext = this.next?.find((context) => {
            return context.match(text)
        });
        return nextContext ? nextContext : this;
    }

    /**
     * 匹配
     */
    public match(text: string) {
        if (this.current instanceof Context) {
            return this.current.match(text)
        }
        else if (typeof this.current === 'string') {
            return this.current.toLowerCase() === text.toLowerCase();
        } else {
            return !!this.current.find(item => item.toLowerCase() === text.toLowerCase())
        }
    }
}

export function context(current: string | string[] | Context) {
    return new Context(current);
}
export function cloneContext(context: Context) {
    let current = context.current;
    let next = context.next;
    if (context.current instanceof Context) {
        current = cloneContext(context.current);
    }
    if (context.next) {
        next = context.next.map(item => cloneContext(item))
    }
    //@ts-ignore
    const newContext = new context.constructor(current);
    if (next) {
        newContext.link(next);
    }
    return newContext
}

const anonymousStmt = context("begin");
const anonymousWithDeclareStmt = context("declare");

const plsqlProcedureSourceStmt = context("procedure").link(
    [
        context("as"),
        context("is")
    ]
)

const plsqlFunctionSourceStmt = context("function").link(
    [
        context("as"),
        context("is")
    ]
)

const plsqlTriggerSourceStmt = context("trigger").link(
    [
        context("before").link("on"),
        context("for").link("on")
    ]
)


const package_block = context("package").link(
    [
        context("is"),
        context("as")
    ]
)

const createStmt = context("create").link(
    [
        package_block,
        context("procedure"),
        context("function"),
        plsqlTriggerSourceStmt,
        context("type")
    ]
)



class PLGuess {
    private context: Context = null;
    private result: boolean = null;
    public reset() {
        this.context = null;
        this.result = null;
    }
    public pushAndGuess(token: Token): boolean {
        if (isBoolean(this.result)) {
            return this.result;
        }
        const text = token.text;
        if (!this.context) {
            const isComplete = this.initContext(text);
            if (isComplete) {
                this.result = true;
                return true;
            }
        } else {
            const nextContext = this.context.tryNext(text);
            if (!nextContext?.next) {
                this.result = true;
                return true;
            } else {
                this.context = nextContext;
            }
        }
        return false;
    }

    private initContext(text: string): boolean {
        const firstContext = [
            anonymousStmt,
            anonymousWithDeclareStmt,
            plsqlProcedureSourceStmt,
            plsqlFunctionSourceStmt,
            plsqlTriggerSourceStmt,
            package_block,
            createStmt
        ].find((context) => {
            return context.match(text);
        });
        this.context = firstContext;
        /**
         * 有可能第一次就匹配成功了
         */
        return !!firstContext && !firstContext?.next;
    }
}


export default PLGuess;
