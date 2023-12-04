function Node(type, isTerminal, text, location, children, yy, isSQLStmt) {
    this.type = type;
    this.isTerminal = isTerminal;
    this.text = text;
    this.location = location;
    this.children = children;
    this.yy = yy;
    this.isSQLStmt = isSQLStmt;
}
Node.prototype.getText = function () {
    return this.yy.input.substring(location.range[0], location.range[1])
}

function createNode(type, isTerminal, text, location, children, yy, isSQLStmt) {
    return {
        terminal: isTerminal,
        type,
        location: location,
        text,
        isSQLStmt,
        children,
        getText() {
            return yy.input.substring(location.range[0], location.range[1])
        },
    }
}


module.exports = {
    initParser(parser, unreservedRules) {
        const originParse = parser.parse;
        unreservedRules = unreservedRules || new Set();

        parser.parse = function (input, cursorOffset, completionCallback) {
            const isOffsetValid = typeof cursorOffset === 'number';
            const self = this;
            // this.yy.input = input;
            // self.yy.input = input;
            let isCompletionCalled = false;
            let currentyy;
            this.pre_parse = function (yy) {
                yy.input = input
                currentyy = yy;
            }
            this.post_parse = function (yy) {
                currentyy = yy;
            }
            if (isOffsetValid) {
                let tokenStack = [];
                self.onNextSymbol = function (lexer, stack, sstack, sp, symbol) {
                    if (!isCompletionCalled) {
                        tokenStack.push(lexer.match);
                    }
                    if (isCompletionCalled || (lexer.offset < cursorOffset && !lexer.done)) {
                        return;
                    }
                    isCompletionCalled = true;
                    console.time('completion')
                    completion(stack, sstack, sp, (...args) => {
                        completionCallback(...args, tokenStack)
                    });
                    console.timeEnd('completion')
                    // console.log('current offset', symbol, lexer.offset, currentyy.input.slice(0, lexer.offset) + '|' + currentyy.input.slice(lexer.offset))
                }
            }
            let result;
            try {
                result = originParse.call(self, input);
            } catch (e) {
                // console.log('parse fail:', e);
                return { yy: currentyy, error: e }
            }
            if (result) {
                return Object.assign({ yy: currentyy }, { result })
            }
        }
        function completion(stack, sstack, sp, completionCallback) {
            
            /**
             * 为什么要这样处理？
             * 生成lalr分析表的时候，会在没有r-r冲突的时候会合并同类项，这就会导致解析虽然没事情，但是无法根据分析表准确的获取当前项集的follow集
             * 所以我们需要不断的reduce来推演，从而判断哪些token是可以被shift的，从而来获取更加准确的follow集。
             */
            console.log('test collect')
            const table = parser.table;
            const productions = parser.productions_;
            let tokens = new Set();
            let followRule = new Set();
            let currentRule = new Set();
            function collectShiftToken(stack, sstack, sp, acceptTokens) {
                const currentState = sstack[sp - 1];
                const currentTableState = table[currentState];
                if (parser.defaultActions[currentState]) {
                    /**
                     * 直接进行reduce操作
                     */
                    const newState = parser.defaultActions[currentState];
                    const newStack = [...stack];
                    const newSstack = [...sstack];
                    let newSp = sp;
                    const production = productions[newState - 1];
                    const [symbol, ruleLength] = production;
                    newSp = newSp - ruleLength;
                    const nextState = table[newSstack[newSp - 1]][symbol];
                    newSstack[newSp] = nextState;
                    newStack[newSp] = 'oceanbase111';
                    collectShiftToken(newStack, newSstack, newSp + 1, acceptTokens)
                    return;
                }
                const reduce = {};
                for (let p in currentTableState) {
                    /**
                     * reduce = [action, productionIdx]
                     * shift = [action, nextState]
                     * goto  = number
                     */
                    const next = currentTableState[p];
                    if (!next) {
                        /**
                         * number  = goto
                         */
                        continue;
                    } else if (typeof next === 'number') {
                        followRule.add(parseInt(p))
                        continue;
                    }
                    if (acceptTokens && !acceptTokens.has(p)) {
                        /**
                         * 不在上一个状态的token集的话，则说明不是候选字符
                         */
                        continue;
                    }
                    const [action, newState] = next;
                    if (action === 1) {
                        let nextState = table[newState];
                        if (parser.defaultActions[newState]) {
                            /**
                             * 先进行shift，再不断reduce直到defaultAction不再存在state
                             */
                            const jumpState = parser.defaultActions[newState]
                            const sstack2 = [...sstack];
                            sstack2[sp] = newState;
                            let newSp = sp + 1;
                            /**
                             * reduce and check
                             */
                            function getNextState(newState, sstack, sp) {
                                const sstack2 = [...sstack]; 
                                const production = productions[newState - 1];
                                const [symbol, ruleLength] = production;
                                if (unreservedRules.has(symbol)) {
                                    /**
                                     * 假如reduce的时候发现symbol，需要直接退出，因为最后返回给外层的时候，外层是感知不到中间发生了哪些规约的
                                     */
                                    return {};
                                }
                                sp = sp - ruleLength;
                                const newState2 = table[sstack2[sp - 1]]?.[symbol];
                                if (parser.defaultActions[newState2]) {
                                    sstack2[sp] = newState2;
                                    sp = sp + 1;
                                    return getNextState(parser.defaultActions[newState2], sstack2, sp)
                                } else {
                                    return table[newState2] || {};
                                }
                            }
                            /**
                             * 这里有可能是一个空值，空值的情况下我们直接丢弃值
                             */
                            nextState = getNextState(jumpState, sstack2, newSp)
                        }
                        let isValid = true;
                        if (Object.keys(nextState).length === 0) {
                            isValid = false;
                        }
                        for (let p in nextState) {
                            const next = nextState[p];
                            if (next?.[0] === 2) {
                                const ruleId = productions[next[1] - 1]?.[0];
                                if (unreservedRules.has(ruleId)) {
                                    isValid = false;
                                } else {
                                    isValid = true;
                                    break;
                                }
                            } else {
                                isValid = true;
                                break;
                            }
                        }
                        isValid && tokens.add(p);
                    } else if (action === 2) {
                        currentRule.add(
                            productions[newState - 1][0]
                        );
                        if (!reduce[newState]) {
                            reduce[newState] = new Set();
                        }
                        reduce[newState].add(p);
                    }
                }
                for (let newState in reduce) {
                    const acceptTokens = reduce[newState];
                    if (!acceptTokens?.size) {
                        continue;
                    }
                    const newStack = [...stack];
                    const newSstack = [...sstack];
                    let newSp = sp;
                    const production = productions[newState - 1];
                    const [symbol, ruleLength] = production;
                    newSp = newSp - ruleLength;
                    const nextState = table[newSstack[newSp - 1]][symbol];
                    newSstack[newSp] = nextState;
                    newStack[newSp] = 'oceanbase111';
                    collectShiftToken(newStack, newSstack, newSp + 1, acceptTokens)
                }
            }
            collectShiftToken(stack, sstack, sp, null);
            if (typeof completionCallback === 'function') {
                completionCallback(
                    Array.from(tokens).map(token => parser.getSymbolName(token)),
                    Array.from(currentRule).map(item => parser.getSymbolName(item)),
                    Array.from(followRule).map(item => parser.getSymbolName(item))
                )
            }
            return tokens;

        }

        const symbolsMap = {};
        for (let name in parser.symbols_) {
            symbolsMap[parser.symbols_[name]] = name;
        }
        const originPerformAction = parser.performAction;
        parser.performAction = function (yyloc, yystate /* action[1] */, yysp, yyrulelength, yyvstack, yylstack, yystack) {
            const self = this;
            originPerformAction.call(self, yyloc, yystate /* action[1] */, yysp, yyrulelength, yyvstack, yylstack, yystack);
            let result = [];
            const productionId = parser.productions_[yystate - 1][0];
            const productionName = symbolsMap[productionId];
            if (self.$) {
                self.$ = createNode(
                    productionName,
                    true,
                    self.$,
                    self._$,
                    null,
                    self.yy,
                    true
                );
                return;
            }
            if (yystate === 0) {
                self.$ = yyvstack[yysp - 1];
                return;
            }
            for (let i = yyrulelength - 1; i >= 0; i--) {
                const location = yylstack[yysp - i];
                const id = yystack[yysp - i];
                const symbolName = symbolsMap[id]

                if (parser.terminals_[id]) {
                    result.push(createNode(symbolName, true, self.yy.input.substring(...yylstack[yysp - i].range), location, null, self.yy))
                    continue;
                }
                const value = yyvstack[yysp - i];
                if (!value) {
                    continue;
                }
                result.push(value)
            }
            if (yyrulelength === 0 || result?.length == 0) {
                /**
                 * yyrulelength = 0说明匹配到了一个可选节点，并且子项无内容
                 * result则代表有子项，但是子项都是空的
                 */
                self.$ = null;
                return;
            }
            const stack = yylstack.slice(yysp - yyrulelength + 1, yysp + 1).filter(Boolean);
            const firstLocation = stack[0];
            if (!firstLocation) {
                console.log(productionName, yyrulelength);
                // console.log(stack)
            }
            const lastLocation = stack[stack.length - 1]
            const location = {
                first_line: firstLocation.first_line,
                last_line: lastLocation.last_line,
                first_column: firstLocation.first_column,
                last_column: lastLocation.last_column,
                range: [firstLocation.range[0], lastLocation.range[1]]
            };
            self.$ = createNode(
                productionName,
                false,
                null,
                location,
                result,
                self.yy
            );
            self._$ = location;
            return;
        }
    }
}