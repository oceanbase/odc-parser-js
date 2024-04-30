import { Token as Antlr4Token, InputStream, CommonTokenStream,  } from 'antlr4';
// @ts-ignore
import { SQLType, SQLDocument } from '@oceanbase-odc/ob-parser-js';
import { PLLexer as MySQLLexer } from "@oceanbase-odc/ob-parser-js/esm/parser/obmysql/PLLexer"
import { Token } from '../../types';
import { AutoCompletionItems } from '../../types/autoCompletion';
import { getTableContextFromMap } from '../../model/helper';
import { Query, QueryCursorContext } from '../../model/query';
import { createFromASTTree } from '../../model/dialect/obmysql';
import { keywords } from '../keywords';

const keywordsSet = new Set(keywords)

const ANTLRInputStream = InputStream;

const cache = new Map<string, { data: SQLDocument; size: number; }>();
let keys: string[] = [];
const MaxSize = 200;
const size = 100;
let currentTokenSize = 0;
const maxTokenSize = 500000;

function getSQLDocument(sql: string, delimiter: string) {
  console.log(
    `MaxSize:${MaxSize}`,
    `currentTokenSize: ${currentTokenSize}`,
    `keys: ${keys.length}`
  )
  const key = `${sql}$$@@##${delimiter}`
  const value = cache.get(key);
  if (value) {
    return value?.data;
  }
  const sqlDocument = new SQLDocument({
    text: sql,
    type: SQLType.OBMySQL,
    delimiter
  })
  const tokenSize = sqlDocument?.statements?.reduce((acc, cur) => (cur?.tokens?.length || 0) + acc, 0) || 0;
  cache.set(key, { data: sqlDocument, size: tokenSize });
  currentTokenSize += tokenSize;
  keys.push(key);
  if (keys.length > MaxSize) {
    /**
     * 超出size，触发回收，达到maxSize触发，回收到 size 的大小。
     */
    const keyLength = keys.length;
    keys = keys.slice(keyLength - size, keyLength);
    const dropKeys = keys.slice(0, keyLength - size);
    dropKeys.forEach(key => {
      currentTokenSize = currentTokenSize - (cache.get(key)?.size || 0);
      cache.delete(key);
    })
  } else if (currentTokenSize > maxTokenSize) {
    /**
     * 超出内存限制
     * 
     */
    let i = 0;
    for (; i < keys.length - 1; i++) {
      if (currentTokenSize < maxTokenSize) {
        break;
      }
      const key = keys[i];
      /**
       * 这里要注意，最少保留一位，所以只会取到倒数第二个。
       */
      const size = (cache.get(key)?.size || 0);
      currentTokenSize = currentTokenSize - size;
      cache.delete(key);
    }
    keys = keys.slice(i);
  }
  return sqlDocument;
}

const convertMap = {
  BEGI: "BEGIN",
  ENGINE_: 'ENGINE',
  ERROR_P: 'ERROR',
  FILEX: 'FILE',
  NULLX: 'NULL'
}

class CaseInsensitiveStream extends ANTLRInputStream {
  LA(offset: number) {
    const result = super.LA(offset);

    switch (result) {
      case 0:
      case Antlr4Token.EOF:
        return result;
      default:
        return String.fromCharCode(result).toUpperCase().charCodeAt(0);
    }
  }
}


export default {
  getTokens(sql: string): Token[] {
    const chars = new CaseInsensitiveStream(sql);
    const lexer = new MySQLLexer(chars);
    const tokens = new CommonTokenStream(lexer as any);
    tokens.fill();
    return tokens?.tokens?.map(token => {
      return {
        type: token.type,
        channel: token.channel,
        start: token.start,
        stop: token.stop,
        text: token.text
      }
    })
  },
  /**
   * 获取当前语句offset左边的所有token
   */
  getOffsetLeftTokens(text: string, delimiter: string, offset: number): Token[] {
    const sqlDocuments = new SQLDocument({
      text,
      type: SQLType.OBMySQL,
      delimiter
    });
    let statement = sqlDocuments.statements.find(s => s.start <= offset && s.stop >= offset);
    if (!statement) {
      const statementsCount = sqlDocuments?.statements?.length;
      if (!statementsCount) {
        return []
      }

      statement = sqlDocuments?.statements?.[statementsCount - 1];
      return this.getTokens(statement.text)
    }
    const tokens = statement.tokens?.reverse?.();
    const idx = tokens.findIndex(t => t.stop < offset);
    return tokens.slice(idx, tokens.length).reverse().map(token => {
      return {
        type: token.type,
        channel: token.channel,
        start: token.start,
        stop: token.stop,
        text: token.text
      }
    });
  },
  getAutoCompletion(text, delimiter, offset): AutoCompletionItems {
    const convertMap = {
      "NULLX": "NULL"
    }
    const sqlDocuments = getSQLDocument(text, delimiter);
    let statement = sqlDocuments.statements.find(s => s.start <= (offset - 1) && s.stop >= (offset - 1));
    if (!statement) {
      return null;
    }
    /**
     * sql 补全
     */
    function sqlCompletion(statement, offset) {
      let completions: AutoCompletionItems = [];
      let tokens, currentRules, followRules, tokenStack: string[] | undefined;
      const isDot = statement.text?.[offset - 1] === '.';
      if (isDot) {
        /**
         * 需要处理掉 dot。保证解析结果能出来
         */
        const newText = statement.text.substring(0, offset - 1) + ' ' + statement.text.substring(offset);
        statement = getSQLDocument(newText, delimiter).statements?.[0];
      }
      const result = statement.parse(offset, function (_tokens, _currentRules, _followRules, _tokenStack) {
        tokens = _tokens;
        currentRules = _currentRules;
        followRules = _followRules;
        tokenStack = _tokenStack;
      });
      console.log(result)
      if (isDot) {
        /**
         * 假如是对象访问符，先确定是否为query里的
         * 然后判断是否为query的fromlist访问
         * 假如都不是的话，则不用提示或者保底当做表名来处理
         */
        let triggerWord = '';
        if (!tokenStack) {
          /**
           * 没有token stack的话，说明补全报错了或者没执行，异常情况默认为空来处理
           */
          completions = [];
          return [];
        }
        let tmpTriggerWords: string[] = [];
        const tokenStackReverse = tokenStack.reverse()
        for (let i = 1; i < tokenStackReverse.length; i = i + 2) {
          tmpTriggerWords.push(tokenStackReverse[i]);
          if (tokenStackReverse[i + 1] == '.') {
            continue;
          }
          triggerWord = tmpTriggerWords.reverse().join('.');
          break;
        }
        if (result.error) {
          /**
           * 出错了，就当做对象访问，交给上层来处理
           */
          completions.push({
            type: 'objectAccess',
            objectName: triggerWord
          });
          return completions;
        }
        const queryMap = createFromASTTree(result.result);
        /**
         * 这里减去1的作用是因为我们去除了点，这会导致光标与最后一个token有空格，使得光标判定的时候不在该语句内
         * 我们通过减1的方式来使得光标吸附在最后一个token上
         */
        let tableContext = getTableContextFromMap(queryMap, offset - 1);
        if (!tableContext) {
          completions = [];
          return completions;
        }

        const queryContext = tableContext?.getContext(offset - 1);
        switch(queryContext) {
          case QueryCursorContext.FromList: {
            completions = [
              {
                type: 'allTables',
                schema: triggerWord
              }
            ]
            return completions;
          }
          default: {
            /**
             * 查找是否为from变量
             */
            let tableName, schemaName, isQuery;
            for (let fromTable of tableContext.fromTables) {
              let name;
              if (fromTable.alias) {
                name = fromTable.alias;
              } else if (fromTable.tableName) {
                name = [fromTable.schemaName, fromTable.tableName].filter(Boolean).join('.')
              }
              if (name === triggerWord) {
                isQuery = !!fromTable.query;
                tableName = fromTable.tableName;
                schemaName = fromTable.schemaName;
                break;
              }
            }
            if (tableName && !isQuery) {
              completions = [
                {
                  type: 'tableColumns',
                  tableName: tableName,
                  schemaName: schemaName
                }
              ]
              return completions;
            }
            completions.push({
              type: 'objectAccess',
              objectName: triggerWord
            });
            return completions;
            
          }
        }
      }
      console.log(tokens);
      tokens = tokens?.filter(token => keywordsSet.has(token));
      if (tokens) {
        completions = tokens.map(token => convertMap[token] || token);
      }
      let tableContext: Query | undefined;
      const queryMap = createFromASTTree(result.result);
      tableContext = getTableContextFromMap(queryMap, offset);
      const queryContext = tableContext?.getContext(offset);
      if (queryContext === QueryCursorContext.SelectList || queryContext === QueryCursorContext.WhereAndGruopBy) {
        /**
                 * 输入列的场景，可以补全from的所有表名以及表名对应的所有列
                 */
        tableContext?.fromTables?.forEach(fromTable => {
          if (fromTable.alias) {
            completions?.push({
              type: 'fromTable',
              tableName: fromTable.alias
            })
            if (!fromTable.query && fromTable.tableName) {
              completions?.push({
                type: 'tableColumns',
                tableName: fromTable.tableName,
                schemaName: fromTable.schemaName
              })
            }
          } else if (fromTable.tableName) {
            completions?.push({
              type: 'fromTable',
              tableName: fromTable.tableName,
              schemaName: fromTable.schemaName
            })
            completions?.push({
              type: 'tableColumns',
              tableName: fromTable.tableName,
              schemaName: fromTable.schemaName
            })
          }
        })
        completions?.push({
          type: 'allFunction'
        })
      } else if (queryContext === QueryCursorContext.FromList) {
        completions!.push({
          type: 'allTables'
        })
        completions!.push({
          type: 'allSchemas'
        })
        tableContext?.withTables?.forEach(withTable => {
          completions!.push({
            type: 'withTable',
            tableName: withTable.tableName
          })
        })
      }
      console.log(currentRules, followRules)
      console.log(result);
      console.log(queryMap);
      return Array.from(new Set(completions));
    }

    return sqlCompletion(statement, offset - statement.start)
   
  }
}