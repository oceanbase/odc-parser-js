import { IFromTable, ILocation, IOrderBy, ISelectColumn, IWithTable } from "..";
import { Query } from "../query";
import { findUnionRight, getChildByType, ITree, loopTree } from "./helper"


function resolve_select_no_parens(node: ITree): Query {
    const select_clause = getChildByType(node.children, 'select_clause');
    const select_clause_set = getChildByType(node.children, 'select_clause_set');
    const select_clause_set_with_order_and_limit = getChildByType(node.children, 'select_clause_set_with_order_and_limit');
    if (select_clause) {
        return resolve_select_clause(select_clause);
    } else if (select_clause_set) {
        return resolve_select_clause_set(select_clause_set);
    } else {
        return resolve_select_clause_set_with_order_and_limit(select_clause_set_with_order_and_limit!);
    }
}
function resolve_select_stmt(node: ITree): Query {
    return _resolveQueryNodeType(node.children[0] as ITree & { type: 'select_no_parens' | 'select_with_parens' | 'select_into' | 'with_select'})!
}


function resolve_select_into(node: ITree): Query {
    return resolve_select_no_parens(node.children[0]);
}
function _resolveQueryNodeType(node: ITree & { 
    type: 'select_with_parens' | 'select_into' | 'select_no_parens' | 'with_select' | 'no_table_select' | 'no_table_select_with_order_and_limit'
    | 'simple_select' | 'simple_select_with_order_and_limit' | 'select_with_parens_with_order_and_limit' | 'select_clause_set_right'
 }): Query | null {
    switch(node.type) {
        case 'select_no_parens': {
            return resolve_select_no_parens(node)
        }
        case 'select_with_parens': {
            return resolve_select_with_parens(node)
        }
        case 'with_select': {
            return resolve_with_select(node)
        }
        case 'select_into': {
            return resolve_select_into(node);
        }
        case 'no_table_select': {
            return resolve_no_table_select(node);
        }
        case 'no_table_select_with_order_and_limit': {
            return resolve_no_table_select_with_order_and_limit(node)
        }
        case 'simple_select': {
            return resolve_simple_select(node)
        }
        case 'simple_select_with_order_and_limit': {
            return resolve_simple_select_with_order_and_limit(node)
        }
        case 'select_with_parens_with_order_and_limit': {
            return resolve_select_with_parens_with_order_and_limit(node)
        }
        case 'select_clause_set_right': {
            return resolve_select_clause_set_right(node)
        }
        default: {
            return null;
        }
    }
}

function resolve_with_select(node: ITree): Query {
    const with_clause = getChildByType(node.children, 'with_clause');
    const select_no_parens = getChildByType(node.children, 'select_no_parens');
    const select_with_parens = getChildByType(node.children, 'select_with_parens');
    const query = select_no_parens ? resolve_select_no_parens(select_no_parens) : resolve_select_with_parens(select_with_parens!);
    query.withTables = resolve_with_clause(with_clause!);
    return query;
}

function resolve_with_clause(node: ITree): IWithTable[] {
    return resolve_with_list(
        getChildByType(node.children, 'with_list')!
    )
}

function resolve_with_list(node: ITree): IWithTable[] {
    const with_list = getChildByType(node.children, 'with_list');
    const common_table_expr = getChildByType(node.children, 'common_table_expr')!;
    if (with_list) {
        return resolve_with_list(with_list).concat(
            resolve_common_table_expr(common_table_expr)
        )
    } else {
        return [resolve_common_table_expr(common_table_expr)]
    }
}

function resolve_common_table_expr(node: ITree): IWithTable {
    const relation_name = getChildByType(node.children, 'relation_name');
    const opt_column_alias_name_list = getChildByType(node.children, 'opt_column_alias_name_list');
    const queryNode = node.children[4];

    const tableName = relation_name!.getText();
    let columnNames: string[] | undefined = undefined;
    if (opt_column_alias_name_list?.children?.length) {
        columnNames = resolve_alias_name_list(opt_column_alias_name_list.children[1]);
    }
    let query: Query = _resolveQueryNodeType(queryNode as ITree & { type: 'select_no_parens' | 'with_select' | 'select_with_parens'})!;
    return {
        columnAlias: columnNames,
        tableName,
        location: node.location,
        query: query
    }
}

function resolve_alias_name_list(node: ITree): string[] {
    const column_alias_name = getChildByType(node.children, 'column_alias_name');
    const alias_name_list = getChildByType(node.children, 'alias_name_list');
    if (alias_name_list) {
        return resolve_alias_name_list(alias_name_list).concat(column_alias_name!.getText())
    } else {
        return [column_alias_name!.getText()]
    }
}

function resolve_select_with_parens(node: ITree): Query {
    const child = node.children?.[1];
    return _resolveQueryNodeType(child as (ITree & { type: 'select_no_parens' | 'select_with_parens' | 'with_select' }))!
}

function resolve_select_clause_set_with_order_and_limit(node: ITree): Query {
    const select_clause_set = getChildByType(node.children, 'select_clause_set');
    const order_by = getChildByType(node.children, 'order_by');
    const opt_order_by = getChildByType(node.children, 'opt_order_by');
    let orderBy: IOrderBy | null = null;
    if (order_by) {
        orderBy = resolve_order_by(order_by);
    } else if (opt_order_by?.children?.[0]) {
        orderBy = resolve_order_by(opt_order_by?.children?.[0]);
    }
    const query: Query = resolve_select_clause_set(select_clause_set!);
    if (orderBy) {
        query.mergeOrderBy(orderBy)
    }
    return query;
}

function resolve_select_clause_set(node: ITree): Query {
    const select_clause_set = getChildByType(node.children, 'select_clause_set');
    const select_clause_set_right = getChildByType(node.children, 'select_clause_set_right');
    const select_clause_set_left = getChildByType(node.children, 'select_clause_set_left');
    const select_clause_set_with_order_and_limit = getChildByType(node.children, 'select_clause_set_with_order_and_limit');
    const set_type = getChildByType(node.children, 'set_type')!;
    const setType = resolve_set_type(set_type);
    const rightQuery: Query = resolve_select_clause_set_right(select_clause_set_right!);
    let leftQuery: Query;
    if (select_clause_set) {
        leftQuery = resolve_select_clause_set(select_clause_set);
    } else if (select_clause_set_left) {
        leftQuery = resolve_select_clause_set_left(select_clause_set_left)
    } else {
        leftQuery = resolve_select_clause_set_with_order_and_limit(select_clause_set_with_order_and_limit!);
    }
    leftQuery.unionType = setType;
    leftQuery.union = rightQuery;
    leftQuery.location = node.location;
    return leftQuery;
}

function resolve_select_clause_set_right(node: ITree): Query {
    return _resolveQueryNodeType(node.children[0] as ITree & { type: 'no_table_select' | 'simple_select' | 'select_with_parens' })!;
}

function resolve_select_clause_set_left(node: ITree): Query {
    return _resolveQueryNodeType(node.children[0] as ITree & { type: 'no_table_select_with_order_and_limit' | 'simple_select_with_order_and_limit' | 'select_clause_set_right'})!;
}

function resolve_select_clause(node: ITree): Query {
    return _resolveQueryNodeType(node.children[0] as ITree & { type: 'no_table_select' | 'no_table_select_with_order_and_limit' | 'simple_select' | 'simple_select_with_order_and_limit' | 'select_with_parens_with_order_and_limit' })!
}

function resolve_set_type(node: ITree): string {
    return node.getText();
}

function resolve_no_table_select_with_order_and_limit(node: ITree): Query {
    const no_table_select = getChildByType(node.children, 'no_table_select');
    const order_by = getChildByType(node.children, 'order_by');
    const opt_order_by = getChildByType(node.children, 'opt_order_by');
    let orderBy: IOrderBy | null = null;
    if (order_by) {
        orderBy = resolve_order_by(order_by);
    } else if (opt_order_by?.children?.[0]) {
        orderBy = resolve_order_by(opt_order_by?.children?.[0]);
    }
    const query: Query = resolve_no_table_select(no_table_select!);
    if (orderBy) {
        query.mergeOrderBy(orderBy)
    }
    return query;
}

function resolve_simple_select(node: ITree): Query {
    const expr = resolve_select_expr_list(getChildByType(node.children, 'select_expr_list'));
    const from: IFromTable[] = resolve_from_list(getChildByType(node.children, 'from_list'));
    return new Query(
        node.location,
        expr,
        from
    )
}

function resolve_simple_select_with_order_and_limit(node: ITree): Query {
    const simple_select = getChildByType(node.children, 'simple_select');
    const order_by = getChildByType(node.children, 'order_by');
    const opt_order_by = getChildByType(node.children, 'opt_order_by');
    let orderBy: IOrderBy | null = null;
    if (order_by) {
        orderBy = resolve_order_by(order_by);
    } else if (opt_order_by?.children?.[0]) {
        orderBy = resolve_order_by(opt_order_by?.children?.[0]);
    }
    const query: Query = resolve_simple_select(simple_select!);
    if (orderBy) {
        query.mergeOrderBy(orderBy)
    }
    return query;
}

function resolve_select_with_parens_with_order_and_limit(node: ITree): Query {
    const select_with_parens = getChildByType(node.children, 'select_with_parens');
    const order_by = getChildByType(node.children, 'order_by');
    const opt_order_by = getChildByType(node.children, 'opt_order_by');
    let orderBy: IOrderBy | null = null;
    if (order_by) {
        orderBy = resolve_order_by(order_by);
    } else if (opt_order_by?.children?.[0]) {
        orderBy = resolve_order_by(opt_order_by?.children?.[0]);
    }
    const query: Query = resolve_select_with_parens(select_with_parens!);
    if (orderBy) {
        query.mergeOrderBy(orderBy)
    }
    return query;
}

function resolve_order_by(node: ITree): IOrderBy {
    return {
        location: node.location,
        sortExprs: resolve_sort_list(getChildByType(node.children, 'sort_list')!)
    }
}

function resolve_sort_list(node: ITree): IOrderBy['sortExprs'] {
    const sort_list = getChildByType(node.children, 'sort_list')
    const sort_key = getChildByType(node.children, 'sort_key')!;
    if (sort_list) {
        return resolve_sort_list(sort_list).concat(resolve_sort_key(sort_key))
    }
    return [resolve_sort_key(sort_key)]
}

function resolve_sort_key(node: ITree): ILocation {
    return node.location
}

function resolve_from_list(node): IFromTable[] {
    const tableReferences: ITree = node.children[0];
    return resolve_table_references(tableReferences);
}

function resolve_table_references(node: ITree): IFromTable[] {
    const tableReference = getChildByType(node.children, 'table_reference');
    const subTableReferences = getChildByType(node.children, 'table_references');
    let table: IFromTable = resolve_table_reference(tableReference!);
    if (subTableReferences) {
        return resolve_table_references(subTableReferences).concat(table)
    }
    return [table];
}

function resolve_table_reference(node: ITree): IFromTable {
    const child = node.children[0];
    if (child.type === 'table_factor') {
        return resolve_table_factor(child);
    } else if (child.type === 'joined_table') {
        /**
         * join */
        return resolve_joined_table(child);
    } else {
        return {
            location: node.location
        }
    }
}

function resolve_joined_table(node: ITree): IFromTable {
    const table_reference = getChildByType(node.children, 'table_reference');
    const opt_full_table_factor = getChildByType(node.children, 'opt_full_table_factor');

    const left: IFromTable = resolve_table_reference(table_reference!);
    left.location = node.location;
    const right = opt_full_table_factor ? resolve_table_factor(opt_full_table_factor.children[0]) : null;
    if (right) {
        left.join = right
    }
    return left;
}

function resolve_table_factor(node: ITree): IFromTable {
    const tableName = getChildByType(node.children, 'tbl_name');
    const subquery = getChildByType(node.children, 'table_subquery');
    const tableReference = getChildByType(node.children, 'table_reference');
    const select_with_parens = getChildByType(node.children, 'select_with_parens');
    if (tableReference) {
        return {
            ...resolve_table_reference(tableReference),
            location: node.location
        }
    } else if (tableName) {
        const relationFactor = getChildByType(tableName.children, 'relation_factor');
        const relationName = getChildByType(tableName.children, 'relation_name');
        const tableNames = resolve_relation_factor(relationFactor!);
        let _tableName, _schemaName;
        if (tableNames.length > 1) {
            _tableName = tableNames[1];
            _schemaName = tableNames[0];
        } else {
            _tableName = tableNames[0];
        }
        return {
            schemaName: _schemaName,
            tableName: _tableName,
            location: node.location,
            alias: relationName?.getText()
        }
    } else if (subquery) {
        return {
            ...resolve_table_subquery(subquery),
            location: node.location
        }
    } else if (select_with_parens) {
        return {
            query: resolve_select_with_parens(select_with_parens),
            location: select_with_parens.location
        }
    } else {
        return {
            location: node.location
        }
    }
}

function resolve_table_subquery(node: ITree): IFromTable {
    const select_with_parens = getChildByType(node.children, 'select_with_parens');
    const relation_name = getChildByType(node.children, 'relation_name');
    return {
        query: resolve_select_with_parens(select_with_parens!),
        location: node.location,
        alias: relation_name ? relation_name.getText() : undefined
    }
}

function resolve_relation_factor(node: ITree): string[] {
    const child = node.children[0];
    if (child.type === 'dot_relation_factor') {
        return [child.children[1].getText()]
    } else {
        return child.children.filter(subChild => subChild.type !== '.').map(c => c.getText())
    }
}

function resolve_no_table_select(node: ITree): Query {
    const select_expr_list = getChildByType(node.children, 'select_expr_list');
    const DUAL = getChildByType(node.children, 'DUAL');
    const query = new Query(
        node.location,
        resolve_select_expr_list(select_expr_list!),
        DUAL ? [{
            tableName: DUAL.getText(),
            location: DUAL.location
        }] : []
    )
    return query;
}
function resolve_select_expr_list(node): ISelectColumn[] {
    const selectExprList = getChildByType(node.children, 'select_expr_list');
    const projection = getChildByType(node.children, 'projection');
    if (!projection) {
        return [];
    }
    let result: ISelectColumn;
    const { children } = projection;
    const column_label = getChildByType(children, 'column_label')
    const STRING_VALUE = getChildByType(children, 'STRING_VALUE')
    const starNode = getChildByType(children, '*')
    const expr = getChildByType(children, 'expr')
    let aliasNode = column_label || STRING_VALUE
    if (!expr) {
        result = {
            expr: starNode!.getText(),
            location: projection.location
        }
    } else {
        result = {
            alias: aliasNode?.getText(),
            expr: expr.getText(),
            location: expr?.location,
            columnName: getColumnNameByExpr(expr)
        }
    }
    if (selectExprList) {
        return resolve_select_expr_list(selectExprList).concat(result)
    }
    return [result];
}

function getColumnNameByExpr(node: ITree): string[] | undefined {
    const bool_pri = getChildByType(node.children, 'bool_pri');
    if (!bool_pri || bool_pri.children?.length > 1) {
        return;
    }
    const predicate = bool_pri.children?.[0];
    if (!predicate || predicate.children?.length > 1 || predicate.children?.[0].type !== 'bit_expr') {
        return;
    }
    const bit_expr = predicate?.children[0];
    if (!bit_expr) {
        return;
    }
    const simple_expr = getChildByType(bit_expr.children, 'simple_expr');
    if (!simple_expr) {
        return;
    }
    const column_ref = getChildByType(simple_expr.children, 'column_ref');
    if (!column_ref) {
        return;
    }
    const columnName = getColumnNameByColumnRef(column_ref);
    if (!columnName) {
        return;
    }
    return columnName;

}

function getColumnNameByColumnRef(node: ITree): string[] | null {
    const node1 = node.children[0];
    const node2 = node.children[1];
    const node3 = node.children[2];
    const node4 = node.children[3];
    const node5 = node.children[3];
    if(node1.type === 'column_name' && node.children.length === 1) {
        return [node1.getText()]
    } else if (node.children.length === 3 && node1.type === 'relation_name' && node2.type === '.' && node3.type === 'column_name') {
        return [node1.getText(), node3.getText()]
    } else if (node.children.length === 3 && node1.type === 'relation_name' && node2.type === '.' && node3.type === 'mysql_reserved_keyword') {
        return [node1.getText(), node3.getText()]
    } else if (node.children.length === 3 && node1.type === 'mysql_reserved_keyword' && node2.type === '.' && node3.type === 'mysql_reserved_keyword') {
        return [node1.getText(), node3.getText()]
    } else if (node.children.length === 3 && node1.type === 'relation_name' && node2.type === '.' && node3.type === '*') {
        return [node1.getText(), node3.getText()]
    } else if (node.children.length === 5) {
        return [node1.getText(), node3.getText(), node5.getText()]
    } else if (node.children.length === 4) {
        return [node2.getText(), node4.getText()]
    } else {
        return null;
    }
}

function addQuery(queryMap: Map<number, Query>, query: Query | null) {
    if (!query) {
        return;
    }
    const [start, stop] = query.location!.range!;
    const existQuery = queryMap.get(start);
    if (!existQuery) {
        queryMap.set(start, query);
        return;
    } else {
        const existLength = existQuery.location!.range[1] - existQuery.location!.range[0];
        if (stop - start > existLength) {
            queryMap.set(start, query);
        }
    }
}

function createFromASTTree(tree) {
    const queryMap = new Map<number, Query>();
    function resolveNode(node: ITree) {
        const { type } = node;
        switch (type) {
            case 'select_no_parens': {
                const query = resolve_select_no_parens(node);
                addQuery(queryMap, query)
                return;
            }
            case 'select_stmt': {
                const query = resolve_select_stmt(node);
                addQuery(queryMap, query)
                return;
            }
            case 'with_select': {
                const query = resolve_with_select(node);
                addQuery(queryMap, query)
                return;
            }
        }
    }
    loopTree(tree, resolveNode);
    return queryMap;
}



export {
    createFromASTTree
}