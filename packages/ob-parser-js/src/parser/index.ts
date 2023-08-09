import Antlr4CommonParser from './antlr4CommonParser';
import { PLLexer as MySQLPLLexer } from './mysql/PLLexer';
import { PlSqlLexer as OraclePLLexer } from './oracle/PlSqlLexer';
import simpleFormatter from './format/simpleFormatter';

//@ts-ignore
import parser from './oracle/oracleSQL_ori';
import { initParser } from './oracle/support';
import plParser from './oracle/oraclePL';
import { Visitor } from './oracle/visitor';

//@ts-ignore
import mysqlParser from './mysql/obmysql';

initParser(parser.Parser.prototype, new Set([1844, 1843]))
initParser(plParser.Parser.prototype, new Set([557,556]))
initParser(mysqlParser.Parser.prototype, new Set([1892,1890, 1891]))

//@ts-ignore
MySQLPLLexer.WS = MySQLPLLexer.Blank;
//@ts-ignore
OraclePLLexer.WS = OraclePLLexer.Blank;

export class MySQLParser extends Antlr4CommonParser {
    constructor(input: string, config: {
        delimiter: string;
        isPL?: boolean;
    }) {
        super(input, MySQLPLLexer, null, config);
    }
    /**
     * MySQL parser 支持用PL 来解析 SQL
     */
    autoGetAstTree() {
        throw new Error('This method is not work');
    }
    parse(offset?: number, completionCallback?: (tokens: string[], currentRules: string[], followRules: string[]) => void) {
        return mysqlParser.parse(this.input, offset, completionCallback);
    }
    getFormatText() {
        return simpleFormatter(this.input, true);
        // if (this.input && this.input.length > 2000) {
        //     /**
        //      * 大于 2000 的语句直接降级
        //      */
        //     return simpleFormatter(this.input);
        // }
        // const sqlTree = this.autoGetAstTree();
        // if (sqlTree) {
        //     const builderClass = getSqlFormatterTreeBuilder(this.isPL ? MySQLPLParserVisitor : MySQLOBParserVisitor);
        //     const formmter = new CommonFormatter(this.isPL ? MySQLPLFormatConfig : MySQLFormatConfig, builderClass, {
        //         tree: sqlTree,
        //         tokens: this.tokens,
        //         lexerClazz: this.CustomLexer,
        //         parser: this.parser,
        //         isKeywordNode: this.isPL ? MySQLPLIsKeywordNode : MySQLIsKeywordNode
        //     });
        //     return formmter.getFormatText();
        // } else {
        //     /**
        //      * 格式化失败了，用基于词法的格式化
        //      */
        //     return simpleFormatter(this.input);
        // }
    }
    prepareParser() {
        if (this.isPL) {
            this.changeParser(MySQLPLLexer, null);
        } else {
            this.changeParser(MySQLPLLexer, null);
        }
    }
}

export class OracleParser extends Antlr4CommonParser {
    constructor(input: string, config: {
        delimiter: string;
        isPL?: boolean;
    }) {
        super(input, OraclePLLexer, null, config);
    }
    /**
     * 自动区分 PL SQL
     */
    autoGetAstTree() {
        throw new Error('This method is not work');
    }
    parse(offset?: number, completionCallback?: (tokens: string[], currentRules: string[], followRules: string[]) => void) {
        if (this.isPL) {
            return plParser.parse(this.input, offset, completionCallback);
        }
        return parser.parse(this.input, offset, completionCallback);
    }
    getFormatText() {
        return simpleFormatter(this.input);
    }
    getAllFromTable() {
        if (this.isPL) {
            return this.getAllFromTableForPL()
        } else {
            return this.getAllFromTableForSQL();
        }
    }
    getAllFromTableForPL() {
        let tables = [];
        let tableVariables = [];
        function loopNodes(nodes) {
            for (let node of nodes) {
                if (node.isSQLStmt) {
                    const tree = parser.parse(node.getText());
                    // console.log(node.getText());

                    const visitor = new SQLVisitor();
                    visitor.visit(tree);
                    tables = tables.concat(visitor.tables);
                    tableVariables = tableVariables.concat(visitor.tableVariables);
                    // console.log(tableTree);
                    // console.log(`[${node.location.range[0]},${node.location.range[1]}]`,node.getText());
                }
                if (node.children) {
                    loopNodes(node.children)
                }
            }
        }
        try {
            const result = plParser.parse(this.input);
            loopNodes([result]);
            return { tables, tableVariables };
        } catch (e) {
            console.log('parser fail', e);
            return { tables: [], tableVariables: [] };
        }
    }
    getAllFromTableForSQL() {
        try {
            const result = parser.parse(this.input);
            const visitor = new SQLVisitor();
            visitor.visit(result);
            return { tables: visitor.tables, tableVariables: visitor.tableVariables };
        } catch (e) {
            console.log('parser fail', e);
            return { tableVariables: [], tables: [] };
        }
    }
    prepareParser() {
        if (this.isPL) {
            this.changeParser(OraclePLLexer, null);
        } else {
            this.changeParser(OraclePLLexer, null);
        }
    }
}

/**
 * 后序遍历
 */
function getNodeTypeList(tree, type) {
    let result = [];
    function loop(node) {
        if (node.type === type) {
            result.push(node);
        } else if (node.children) {
            node.children.forEach(c => loop(c));
        }
    }
    loop(tree);
    return result;
}

class SQLVisitor extends Visitor {
    tables = [];
    tableVariables = [];
    visit_simple_expr(node) {
        const firstChild = node.children?.[0];
        if (firstChild?.type === 'obj_access_ref' && node.children?.length === 1) {
            /**
             * simple_expr: obj_access_ref;
             */
            const objAccessRefChildren = firstChild.children;
            const objAccessRefChildrenLeft = objAccessRefChildren?.[0];
            const objAccessRefChildrenRight = objAccessRefChildren?.[1];
            if (objAccessRefChildrenLeft?.type === 'column_ref' && objAccessRefChildrenRight?.type === 'opt_obj_access_ref') {
                /**
                 * obj_access_ref: column_ref opt_obj_access_ref;
                 */
                const name = getNodeTypeList(firstChild, 'column_ref')
                let schema;
                let tableName;
                let column;
                if (name.length == 3) {
                    schema = name[0];
                    tableName = name[1]
                    column = name[2];
                } else if (name.length === 2) {
                    tableName = name[0];
                    column = name[1];
                } else {
                    column = name[0];
                }
                this.tableVariables.push({
                    name: tableName?.getText(),
                    nameLocation: tableName?.location,
                    schema: schema?.getText(),
                    schemaLocation: schema?.location,
                    column: column?.getText(),
                    columnLocation: column?.location,
                    location: firstChild.location
                })
                return;
            }
        }
        this.visitChildren(node);
    }
    visit_table_references(node) {
        // console.log('visitor table_references', node)
        this.visitChildren(node)
    }
    visit_table_reference(node) {
        if (node.children?.[0]?.type === 'table_factor') {
            this.visitChildren(node)
        }
    }
    visit_table_factor(node) {
        const firstChild = node.children?.[0];
        switch (firstChild?.type) {
            case 'tbl_name': {
                const alias = firstChild.children.find(node => node.type === 'relation_name')?.getText();
                const name = getNodeTypeList(firstChild.children?.find(c => c.type === 'relation_factor'), 'relation_name')
                let schema;
                let tableName;
                if (name.length > 1) {
                    schema = name[0];
                    tableName = name[1]
                } else {
                    tableName = name[0];
                }
                this.tables.push({
                    alias,
                    name: tableName?.getText(),
                    nameLocation: tableName?.location,
                    schema: schema?.getText(),
                    schemaLocation: schema?.location,
                    location: firstChild.location
                });
                return;
            }
            case 'table_subquery': {
                this.visitChildren(node);
                break;
            }
            default: {
                this.visitChildren(node);
                break;
            }
        }
    }
}