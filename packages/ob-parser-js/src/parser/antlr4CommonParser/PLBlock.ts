import { cloneContext, Context, context } from "./PLGuess";

const beginContext = context('begin').link('end');

const beginWithDelimiterContext = context('begin').link(
    context('end').link(';')
);

const declareContext = context('declare').link(beginContext);

// const asContext = context('as').link(';');
// const isContext = context('is').link(';');
/**
 * <function ... as/is> ... <;>
 */

 class AsOrIsContext extends Context {
    match(text: string) {
         if (['BEGIN', 'LANGUAGE'].includes(text?.toUpperCase())) {
             switch(text.toUpperCase()) {
                 case 'BEGIN': {
                    this.current = 'BEGIN',
                    this.next = [context('end').link(';')]
                    break;
                 }
                 case 'LANGUAGE': {
                    this.current = 'LANGUAGE',
                    this.next = [context(';')]
                    break;
                 }
                 default: {
                     return false;
                 }
             }
            return true;
         }
         return false;
    }
}

class PkgHeadOrBodyContext extends Context {
    match(text: string) {
         if (['BODY', 'IS', 'AS'].includes(text?.toUpperCase())) {
             switch(text.toUpperCase()) {
                 case 'BODY': {
                    this.current = 'BODY',
                    this.next = [new PkgOptionBegin('PkgOptionBegin')]
                    break;
                 }
                 default: {
                    this.current = text.toUpperCase(),
                    this.next = [context('end').link(';')]
                    break;
                 }
             }
            return true;
         }
         return false;
    }
}
class PkgOptionBegin extends Context {
    match(text: string) {
         if (['BEGIN', 'END'].includes(text?.toUpperCase())) {
             switch(text.toUpperCase()) {
                 case 'BEGIN': {
                    this.current = 'BEGIN',
                    this.next = [context('end').link(';')]
                    break;
                 }
                 default: {
                    this.current = text.toUpperCase(),
                    this.next = [context(';')]
                    break;
                 }
             }
            return true;
         }
         return false;
    }
}

const funcDefContext = context(
    context('function').link(context(['as', 'is']))
).link(new AsOrIsContext('AsOrIsContext'));
const proDefContext = context(
    context('procedure').link(context(['as', 'is']))
).link(new AsOrIsContext('AsOrIsContext'))
// const triggerDefContext = context('trigger').link(';');

const pkgDefContext = context('package').link(
    new PkgHeadOrBodyContext('PkgHeadOrBodyContext')
);
const typeDefContext = context(
    context('type').link('body')
).link(
    context('end').link(';')
);

const loopContext = context('loop').link('end').link('loop');
const ifContext = context('if').link(
    context('end').link('if')
);
const caseContext = context('case').link(
    context('end').link('case')
);



export class BlockContext {
    stack: Context[] = [];
    reset() {
        this.stack = [];
    }
    isEmpty() {
        return !this.stack.length || (this.stack.length === 1 && this.stack[0].isPreMatch());
    }
    getCurrentContext() {
        return this.stack[this.stack.length - 1];
    }
    getPrevContext() {
        return this.stack[this.stack.length - 2];
    }
    setCurrentContext(newContext, replace: boolean) {
        if (replace) {
            this.stack[this.stack.length - 1] = newContext
        } else {
            this.stack.push(newContext);
        }
    }
    push(text: string) {
        const currentContext = this.getCurrentContext();
        const prevContext = this.getPrevContext();
        if (currentContext) {
            const nextContext = currentContext.tryNext(text);
            /**
             * 不一样，说明这边成功匹配到了
             */
            if (nextContext !== currentContext) {
                if (nextContext.next) {
                    /**
                     * 未到达终点
                     */
                    this.setCurrentContext(nextContext, true);
                    return;
                } else {
                    /**
                     * 到达了终点，需要出栈
                     */
                    this.stack.pop();
                }
                return;
            } else if (currentContext.isPreMatch() && prevContext) {
                /**
                 * 当前为prematch节点，需要确定非prematch是否匹配
                 */
                const nextContext = prevContext.tryNext(text);
                if (nextContext !== prevContext) {
                    this.stack.pop();
                    this.setCurrentContext(nextContext, true);
                    return;
                }
            }
        }
        /**
         * 剩下的都是未匹配的情况，需要看下有没有其余的context匹配
         */
        for (let context of [
            beginContext,
            declareContext,
            // asContext,
            // isContext,
            funcDefContext,
            proDefContext,
            // triggerDefContext,
            pkgDefContext,
            typeDefContext,
            loopContext,
            ifContext,
            caseContext
        ]) {
            const isMatch = context.match(text);
            if (isMatch) {
                let isReplace = false;
                if (this.getCurrentContext()?.isPreMatch()) {
                    isReplace = true
                }
                this.setCurrentContext(cloneContext(context), isReplace);
                return;
            }
        }
    }
}