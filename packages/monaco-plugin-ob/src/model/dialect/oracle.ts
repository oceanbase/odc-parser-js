import { IFromTable, ILocation, IOrderBy, ISelectColumn, IWithTable } from "..";
import { Query } from "../query";
import { findUnionRight, getChildByType, ITree, loopTree } from "./helper"


function resolveWithSelect(node: ITree): Query | null {
    const withClause = getChildByType(node.children, 'with_clause');
    const selectNoParens = getChildByType(node.children, 'select_no_parens');
    const selectWithParens = getChildByType(node.children, 'select_with_parens');
    let query: Query | null = selectNoParens ? resolveSelectNoParens(selectNoParens) : resolveSelectWithParens(selectWithParens!);
    if (!query) {
        return null
    }
    const withTables: IWithTable[] = resolveWithClause(withClause!);
    query.withTables = withTables;
    return query
}

function resolveWithClause(node: ITree): IWithTable[] {
    const common_table_expr = getChildByType(node.children, 'common_table_expr');
    const with_list = getChildByType(node.children, 'with_list');
    if (common_table_expr) {
        return [resolveCommonTableExpr(common_table_expr)];
    } else {
        return resolveWithList(with_list!);
    }
}

function resolveWithList(node: ITree): IWithTable[] {
    const with_list = getChildByType(node.children, 'with_list');
    const common_table_expr = getChildByType(node.children, 'common_table_expr')!;
    if (with_list) {
        return resolveWithList(with_list).concat(
            resolveCommonTableExpr(common_table_expr)
        )
    } else {
        return [resolveCommonTableExpr(common_table_expr)]
    }
}

function resolveCommonTableExpr(node: ITree): IWithTable {
    const relation_name = getChildByType(node.children, 'relation_name');
    const opt_column_alias_name_list = getChildByType(node.children, 'opt_column_alias_name_list');
    const queryNode = node.children[4];

    const tableName = relation_name!.getText();
    let columnNames: string[] | undefined = undefined;
    if (opt_column_alias_name_list?.children?.length) {
        columnNames = resolveAliasNameList(opt_column_alias_name_list.children[1]);
    }
    let query: Query | undefined = undefined;
    switch (queryNode.type) {
        case 'select_no_parens': {
            query = resolveSelectNoParens(queryNode)!;
            break;
        }
        case 'with_select': {
            query = resolveWithSelect(queryNode)!;
            break;
        }
        case 'select_with_parens': {
            query = resolveSelectWithParens(queryNode)!;
            break;
        }
        case 'subquery': {
            query = resolveSubquery(queryNode)!;
            const order_by = getChildByType(node.children, 'order_by')
            const opt_fetch_next = getChildByType(node.children, 'opt_fetch_next')
            if (order_by) {
                query.mergeOrderBy(resolveOrderBy(order_by))
            }
            if (opt_fetch_next?.children?.[0]) {
                query.addLocation(
                    opt_fetch_next?.children?.[0].location
                )
            }
            break;
        }
    }
    return {
        columnAlias: columnNames,
        tableName,
        location: node.location,
        query: query!
    }
}

function resolveAliasNameList(node: ITree): string[] {
    const column_alias_name = getChildByType(node.children, 'column_alias_name');
    const alias_name_list = getChildByType(node.children, 'alias_name_list');
    if (alias_name_list) {
        return resolveAliasNameList(alias_name_list).concat(column_alias_name!.getText())
    } else {
        return [column_alias_name!.getText()]
    }
}


function resolveSubquery(node: ITree): Query | null {
    const subNode = node.children[0];
    switch (subNode.type) {
        case 'select_no_parens': {
            return resolveSelectNoParens(subNode);
        }
        case 'select_with_parens': {
            return resolveSelectWithParens(subNode);
        }
        case 'with_select': {
            return resolveWithSelect(subNode);
        }
        default: {
            return null;
        }
    }
}


function resolveSelectWithParens(node: ITree): Query | null {
    const subNode = node.children[1];
    const order_by = getChildByType(node.children, 'order_by');
    const fetch_next_clause = getChildByType(node.children, 'fetch_next_clause');
    let query: Query | null;
    switch (subNode.type) {
        case 'select_no_parens': {
            query = resolveSelectNoParens(subNode);
            break;
        }
        case 'select_with_parens': {
            query = resolveSelectWithParens(subNode);
            break;
        }
        case 'with_select': {
            query = resolveWithSelect(subNode);
            break;
        }
        default: {
            query = null;
            break;
        }
    }
    if (!query) {
        return null;
    }
    if (order_by) {
        query.mergeOrderBy(resolveOrderBy(order_by));
    }
    if (fetch_next_clause) {
        query.addLocation(fetch_next_clause.location);
    }
    return query;
}

function resolveSelectNoParens(node: ITree): Query | null {
    const child = node.children[0];
    if (child.type === 'select_clause') {
        return resolveSelectClause(child)
    } else {
        return resolveSelectClauseSet(child);
    }
}

function resolveSelectClause(node): Query | null {
    const child = node.children?.[0];
    switch (child.type) {
        case 'no_table_select':
        case 'no_table_select_with_hierarchical_query': {
            return resolveNoTableSelect(child);
        }
        case 'simple_select': {
            return resolveSimpleSelect(child);
        }
        case 'select_with_hierarchical_query': {
            return new Query(null, [], [], [])
        }
        default: {
            return null;
        }
    }
}

function resolveSelectClauseSet(node: ITree): Query {
    const select_clause_set_left = getChildByType(node.children, 'select_clause_set_left');
    const select_clause_set_right = getChildByType(node.children, 'select_clause_set_right');
    const set_type = getChildByType(node.children, 'set_type');
    const select_clause_set = getChildByType(node.children, 'select_clause_set');
    let leftQuery, rightQuery;
    if (select_clause_set) {
        leftQuery = resolveSelectClauseSet(select_clause_set);
    } else {
        leftQuery = resolveSelectClauseSetRight(select_clause_set_left!.children[0])
    }
    rightQuery = resolveSelectClauseSetRight(select_clause_set_right!);
    const setType: string = set_type!.children.map(child => child.getText()).join(' ');
    const leftRight: Query = findUnionRight(leftQuery);
    leftRight.unionType = setType;
    leftRight.union = rightQuery;
    leftQuery.location = node.location;
    return leftQuery;
}



function resolveNoTableSelect(node: ITree): Query | null {
    const { children } = node;
    const dualNode = getChildByType(children, 'DUAL');
    if (!dualNode) {
        return null;
    }
    return new Query(
        node.location,
        resolveSelectExprList(getChildByType(children, 'select_expr_list')),
        [{
            tableName: dualNode.getText(),
            location: dualNode.location
        }],
        []
    )
}

function resolveSimpleSelect(node: ITree): Query | null {
    const { children } = node;
    return new Query(
        node.location,
        resolveSelectExprList(getChildByType(children, 'select_expr_list')),
        resolveFromList(getChildByType(children, 'from_list')),
        []
    )
}

function resolveSelectClauseSetRight(node: ITree): Query | null {
    const child = node.children?.[0];
    switch (child.type) {
        case 'no_table_select': {
            return resolveNoTableSelect(child);
        }
        case 'simple_select': {
            return resolveSimpleSelect(child);
        }
        case 'select_with_parens': {
            return resolveSelectWithParens(child);
        }
        default: {
            return null;
        }
    }
}

function resolveSelectExprList(node): ISelectColumn[] {
    const selectExprList = getChildByType(node.children, 'select_expr_list');
    const projection = getChildByType(node.children, 'projection');
    if (!projection) {
        return [];
    }
    let result: ISelectColumn;
    const { children } = projection;
    const aliasNode = getChildByType(children, 'relation_name')
    const starNode = getChildByType(children, '*')
    const bitExprNode = getChildByType(children, 'bit_expr')
    if (!bitExprNode) {
        result = {
            expr: starNode!.getText(),
            location: projection.location
        }
    } else {
        result = {
            alias: aliasNode?.getText(),
            expr: bitExprNode.getText(),
            location: bitExprNode?.location,
            columnName: getColumnNameByBitExpr(bitExprNode)
        }
    }
    if (selectExprList) {
        return resolveSelectExprList(selectExprList).concat(result)
    }
    return [result];
}

function getColumnNameByBitExpr(node: ITree): string[] | undefined {
    const unaryExprNode = getChildByType(node.children, 'unary_expr');
    if (!unaryExprNode || unaryExprNode.children?.length > 1) {
        return;
    }
    const simpleExprNode = unaryExprNode.children?.[0];
    if (!simpleExprNode || simpleExprNode.children?.length > 1 || simpleExprNode.children?.[0].type !== 'obj_access_ref') {
        return;
    }
    const objAccessRef = simpleExprNode.children?.[0];
    const columnName = getColumnNameByObjAccessRef(objAccessRef);
    if (!columnName) {
        return;
    }
    return columnName;

}

function getColumnNameByObjAccessRef(node: ITree): string[] | null {
    const { children } = node;
    if (children.length === 5) {
        /**
         * c.first()
         */
        return null;
    }
    const columnRefNode = getChildByType(children, 'column_ref');
    if (columnRefNode?.type !== 'column_ref') {
        /**
         * access function
         */
        return null;
    }
    const optObjAccessRef = getChildByType(children, 'opt_obj_access_ref');
    if (!optObjAccessRef) {
        return [columnRefNode.getText()]
    }
    const rightNode = optObjAccessRef.children?.[1];
    if (rightNode.type === '*') {
        return [columnRefNode.getText(), '*'];
    }
    const rightColumnName = getColumnNameByObjAccessRef(rightNode);
    if (!rightColumnName) {
        return null;
    }
    return [columnRefNode.getText()].concat(rightColumnName);
}

function resolveFromList(node): IFromTable[] {
    const tableReferences: ITree = node.children[0];
    return resolveTableReferences(tableReferences);
}

function resolveTableReferences(node: ITree): IFromTable[] {
    const tableReference = getChildByType(node.children, 'table_reference');
    const subTableReferences = getChildByType(node.children, 'table_references');
    let table: IFromTable = resolveTableReference(tableReference!);
    if (subTableReferences) {
        return resolveTableReferences(subTableReferences).concat(table)
    }
    return [table];
}

function resolveTableReference(node: ITree): IFromTable {
    const child = node.children[0];
    if (child.type === 'table_factor') {
        return resolveTableFactor(child);
    } else {
        /**
         * join */
        return resolveJoinedTable(child);
    }
}

function resolveJoinedTable(node: ITree): IFromTable {
    const table_reference = getChildByType(node.children, 'table_reference');
    const table_factor = getChildByType(node.children, 'table_factor');

    const left: IFromTable = resolveTableReference(table_reference!);
    left.location = node.location;
    const right = resolveTableFactor(table_factor!);
    left.join = right;
    return left;
}

function resolveTableFactor(node: ITree): IFromTable {
    const tableName = getChildByType(node.children, 'tbl_name');
    const subquery = getChildByType(node.children, 'table_subquery');
    const tableReference = getChildByType(node.children, 'table_reference');
    if (tableReference) {
        return {
            ...resolveTableReference(tableReference),
            location: node.location
        }
    } else if (tableName) {
        const relationFactor = getChildByType(tableName.children, 'relation_factor');
        const relationName = getChildByType(tableName.children, 'relation_name');
        const tableNames = resolveRelationFactor(relationFactor!);
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
            ...resolveTableSubquery(subquery),
            location: node.location
        }
    } else {
        return {
            location: node.location
        }
    }
}

function resolveTableSubquery(node: ITree): IFromTable {
    const select_with_parens = getChildByType(node.children, 'select_with_parens');
    const subquery = getChildByType(node.children, 'subquery');
    const relation_name = getChildByType(node.children, 'relation_name');
    const order_by = getChildByType(node.children, 'order_by');
    const fetch_next_clause = getChildByType(node.children, 'fetch_next_clause');
    let query = subquery ? resolveSubquery(subquery)! : resolveSelectWithParens(select_with_parens!)!;
    if (order_by) {
        query.mergeOrderBy(resolveOrderBy(order_by))
    }
    if (fetch_next_clause) {
        query.addLocation(fetch_next_clause.location);
    }
    return {
        alias: relation_name?.getText(),
        location: node.location,
        query
    }
}

function resolveRelationFactor(node: ITree): string[] {
    const child = node.children[0];
    if (child.type === 'dot_relation_factor') {
        return [child.children[1].getText()]
    } else {
        return child.children.filter(subChild => subChild.type === 'relation_name').map(c => c.getText())
    }
}

function resolveCreateTableStmt(node: ITree): Query | null {
    const subquery = getChildByType(node.children, 'subquery');
    const opt_order_by = getChildByType(node.children, 'opt_order_by');
    const opt_fetch_next = getChildByType(node.children, 'opt_fetch_next');
    if (!subquery) {
        return null;
    }
    const query = resolveSubquery(subquery);
    if (!query) {
        return null;
    }
    const order_by = opt_order_by?.children[0];
    const fetch_next_clause = opt_fetch_next?.children[0];
    if (order_by) {
        query.mergeOrderBy(resolveOrderBy(order_by))
    }
    if (fetch_next_clause) {
        query.addLocation(fetch_next_clause.location)
    }
    return query;
}

function resolveViewSubquery(node: ITree): Query | null {
    const subquery = getChildByType(node.children, 'subquery');
    const order_by = getChildByType(node.children, 'order_by');
    const fetch_next_clause = getChildByType(node.children, 'fetch_next_clause');
    if (!subquery) {
        return null;
    }
    const query = resolveSubquery(subquery);
    if (!query) {
        return null;
    }
    if (order_by) {
        query.mergeOrderBy(resolveOrderBy(order_by))
    }
    if (fetch_next_clause) {
        query.addLocation(fetch_next_clause.location)
    }
    return query;
}

function resolveValuesClause(node: ITree): Query | null {
    const subquery = getChildByType(node.children, 'subquery');
    const opt_order_by = getChildByType(node.children, 'opt_order_by');
    const opt_fetch_next = getChildByType(node.children, 'opt_fetch_next');
    if (!subquery) {
        return null;
    }
    const query = resolveSubquery(subquery);
    if (!query) {
        return null;
    }
    const order_by = opt_order_by?.children[0];
    const fetch_next_clause = opt_fetch_next?.children[0];
    if (order_by) {
        query.mergeOrderBy(resolveOrderBy(order_by))
    }
    if (fetch_next_clause) {
        query.addLocation(fetch_next_clause.location)
    }
    return query;
}

function resolveInsertTableClause(node: ITree): Query | null {
    const subquery = getChildByType(node.children, 'subquery');
    const order_by = getChildByType(node.children, 'order_by');
    const opt_fetch_next = getChildByType(node.children, 'opt_fetch_next');
    let fetch_next_clause = getChildByType(node.children, 'fetch_next_clause');
    if (!subquery) {
        return null;
    }
    const query = resolveSubquery(subquery);
    if (!query) {
        return null;
    }
    fetch_next_clause = fetch_next_clause || opt_fetch_next?.children[0];
    if (order_by) {
        query.mergeOrderBy(resolveOrderBy(order_by))
    }
    if (fetch_next_clause) {
        query.addLocation(fetch_next_clause.location)
    }
    return query;
}

function resolveDmlTableClause(node: ITree): Query | null {
    const subquery = getChildByType(node.children, 'subquery');
    const order_by = getChildByType(node.children, 'order_by');
    const opt_fetch_next = getChildByType(node.children, 'opt_fetch_next');
    let fetch_next_clause = getChildByType(node.children, 'fetch_next_clause');
    if (!subquery) {
        return null;
    }
    const query = resolveSubquery(subquery);
    if (!query) {
        return null;
    }
    fetch_next_clause = fetch_next_clause || opt_fetch_next?.children[0];
    if (order_by) {
        query.mergeOrderBy(resolveOrderBy(order_by))
    }
    if (fetch_next_clause) {
        query.addLocation(fetch_next_clause.location)
    }
    return query;
}

function resolveSelectStmt(node: ITree): Query | null {
    const subquery = getChildByType(node.children, 'subquery');
    const order_by = getChildByType(node.children, 'order_by');
    const lastNode = node.children?.[node.children.length - 1];
    if (!subquery) {
        return null;
    }
    const query = resolveSubquery(subquery);
    if (!query) {
        return null;
    }
    if (order_by) {
        query.mergeOrderBy(resolveOrderBy(order_by))
    }
    if (lastNode) {
        query.addLocation(lastNode.location);
    }
    return query;
}

function resolveOrderBy(node: ITree): IOrderBy {
    return {
        location: node.location,
        sortExprs: resolveSortList(getChildByType(node.children, 'sort_list')!)
    }
}

function resolveSortList(node: ITree): IOrderBy['sortExprs'] {
    const sort_list = getChildByType(node.children, 'sort_list')
    const sort_key = getChildByType(node.children, 'sort_key')!;
    if (sort_list) {
        return resolveSortList(sort_list).concat(resolveSortKey(sort_key))
    }
    return [resolveSortKey(sort_key)]
}

function resolveSortKey(node: ITree): ILocation {
    return node.location
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
                const query = resolveSelectNoParens(node);
                addQuery(queryMap, query)
                return;
            }
            case 'with_select': {
                const query = resolveWithSelect(node);
                addQuery(queryMap, query)
                return;
            }
            case 'create_table_stmt': {
                const query = resolveCreateTableStmt(node);
                addQuery(queryMap, query)
                return;
            }
            case 'view_subquery': {
                const query = resolveViewSubquery(node);
                addQuery(queryMap, query)
                return;
            }
            case 'values_clause': {
                const query = resolveValuesClause(node);
                addQuery(queryMap, query)
                return;
            }
            case 'select_stmt': {
                const query = resolveSelectStmt(node);
                addQuery(queryMap, query)
                return;
            }
            case 'select_with_parens': {
                const query = resolveSelectWithParens(node);
                addQuery(queryMap, query)
                return;
            }
            case 'insert_table_clause': {
                const query = resolveInsertTableClause(node);
                addQuery(queryMap, query)
                return;
            }
            case 'dml_table_clause': {
                const query = resolveDmlTableClause(node);
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