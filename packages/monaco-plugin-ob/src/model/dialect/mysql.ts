import { IFromTable, ILocation, IOrderBy, ISelectColumn, IWithTable } from "..";
import { Query } from "../query";
import { findUnionRight, getChildByType, ITree, loopTree } from "./helper"


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
            case 'selectStatement': {
                const query = resolve_selectStatement(node);
                addQuery(queryMap, query)
                return;
            }
        }
    }
    loopTree(tree, resolveNode);
    return queryMap;
}

function resolve_joinParts(node: ITree): IFromTable {
    const joinPart = getChildByType(node.children, "joinPart")!;
    const joinParts = getChildByType(node.children, "joinParts");
    const tableSourceItem = getChildByType(joinPart.children, "tableSourceItem")!;
    const from = resolve_tableSourceItem(tableSourceItem);
    if (joinParts) {
        const join = resolve_joinParts(joinParts);
        from.join = join;
    }
    return from;

}

function resolve_tableSourceItem(node: ITree): IFromTable {
    const tableSourceItem = node;
    let leftFrom: IFromTable;
    
    const tableName = getChildByType(tableSourceItem.children, "tableName");
    const opt_asUid = getChildByType(tableSourceItem.children, "opt_asUid");
    const uid = getChildByType(tableSourceItem.children, "uid");
    const selectStatement = getChildByType(tableSourceItem.children, "selectStatement");
    const subTableSources = getChildByType(tableSourceItem.children, "tableSources");
    if (tableName) {
        const fullId = getChildByType(tableName.children, "fullId")!;
        const uid = getChildByType(fullId.children, "uid")!;
        const dottedId = getChildByType(fullId.children, "dottedId");
        const uid2 = dottedId ? dottedId.getText().substring(1) : undefined;
        leftFrom = {
            schemaName: uid2 ? uid.getText() : undefined,
            tableName: uid2 ? uid2 : uid.getText(),
            alias: opt_asUid?.children?.length ? getChildByType(opt_asUid.children, "uid")?.getText() : undefined,
            location: tableSourceItem.location
        }
    } else if (selectStatement) {
        leftFrom = {
            query: resolve_selectStatement(selectStatement)!,
            location: tableSourceItem.location,
            alias: uid!.getText()
        }
    } else {
        const froms = resolve_tableSources(subTableSources!);
        leftFrom = {
            joins: froms,
            location: tableSourceItem.location,
        }
    }
    return leftFrom;
}


function resolve_tableSources(node: ITree): IFromTable[] {
    const tableSource = getChildByType(node.children, "tableSource")!;
    const tableSources = getChildByType(node.children, "tableSources");
    const tableSourceItem = getChildByType(tableSource?.children, "tableSourceItem")!;
    const joinParts = getChildByType(tableSource?.children, "opt_joinParts")?.children?.[0];
    let join: IFromTable | undefined;
    if (joinParts) {
        join = resolve_joinParts(joinParts);
    }
    let leftFrom: IFromTable = resolve_tableSourceItem(tableSourceItem);
    leftFrom.join = join;

    if (tableSources) {
        return [leftFrom].concat(resolve_tableSources(tableSources))
    }
    return [leftFrom];
}

function resolve_fromClause(node: ITree): IFromTable[] {
    const tableSources = getChildByType(node.children, "tableSources");
    return resolve_tableSources(tableSources!);
}

function resolve_fullColumnName(node: ITree): string[] | string {
    const uid = getChildByType(node.children, "uid");
    const fullId = getChildByType(node.children, "fullId");
    if (fullId) {
        const uid = getChildByType(fullId.children, "uid");
        const dottedId = getChildByType(fullId.children, "dottedId");
        if (!dottedId) {
            return uid!.getText();
        }
        return [uid!.getText(), dottedId.getText().substring(1)];
    }
    const dottedId1 = node.children[1]!;
    const dottedId2 = node.children[2]!;
    return [uid!.getText(), dottedId1.getText().substring(1), dottedId2.getText().substring(1)];
}

function resolve_selectElement(node: ITree): ISelectColumn {
    const expression = getChildByType(node.children, "expression");
    const uid = getChildByType(node.children, "uid");
    if (expression) {
        const subExpression = getChildByType(expression.children, "expression");
        const predicate = getChildByType(expression.children, "predicate");
        const IS = getChildByType(expression.children, "IS");
        if (predicate && !IS) {
            const expressionAtom = getChildByType(predicate.children, "expressionAtom");
            if (expressionAtom && predicate.children.length === 1) {
                const fullColumnName = getChildByType(expressionAtom.children, "fullColumnName");
                if (fullColumnName) {
                    return {
                        columnName: resolve_fullColumnName(fullColumnName),
                        expr: node.getText(),
                        location: node.location,
                        alias: uid?.getText()
                    }
                }
            }
        }
        return {
            expr: expression.getText(),
            location: node.location,
            alias: uid?.getText()
        }
    }
    return {
        star: true,
        expr: node.getText(),
        location: node.location
    }
}

function resolve_selectElementPart(node: ITree): Query["selectColumns"] {
    const selectElement = getChildByType(node.children, "selectElement")!;
    const selectElementPart = getChildByType(node.children, "selectElementPart");
    const column = resolve_selectElement(selectElement);
    if (selectElementPart) {
        return [column].concat(resolve_selectElementPart(selectElementPart));
    }
    return [column];
}
function resolve_selectElements(node: ITree): Query["selectColumns"] {
    const selectElement = getChildByType(node.children, "selectElement");
    const STAR = getChildByType(node.children, "STAR");
    const selectElementPart = getChildByType(node.children, "opt_selectElementPart")?.children?.[0];
    let elements: Query["selectColumns"] = [];
    if (selectElement) {
        const column = resolve_selectElement(selectElement);
        elements.push(column);
    } else if (STAR) {
        elements.push({
            expr: STAR?.getText(),
            star: true,
            location: STAR?.location
        });
    }
    if (selectElementPart) {
        const columns = resolve_selectElementPart(selectElementPart);
        elements = elements.concat(columns);
    }
    return elements;
}
function resolve_orderByExprList(node: ITree): ITree[] {
    const orderByExprList = getChildByType(node.children, "orderByExprList");
    const orderByExpression = getChildByType(node.children, "orderByExpression");
    if (orderByExprList) {
        return [orderByExpression!].concat(resolve_orderByExprList(orderByExprList));
    }
    return [orderByExpression!];

}
function resolve_orderByClause(node: ITree): IOrderBy {
    const orderByExprList = getChildByType(node.children, "orderByExprList");
    const nodes = resolve_orderByExprList(orderByExprList!);
    return {
        location: node.location,
        sortExprs: nodes.map(n => n.location)
    }

}
function resolve_querySpecificationNointo(node: ITree): Query {
    const fromClause = getChildByType(node.children, "opt_fromClause")?.children?.[0];
    const orderByClause = getChildByType(node.children, "opt_orderByClause")?.children?.[0];
    let query: Query;
    query = new Query(
        node.location,
        resolve_selectElements(getChildByType(node.children, "selectElements")!),
        fromClause ? resolve_fromClause(fromClause) : [],
        [],
        null,
        undefined,
        orderByClause ? resolve_orderByClause(orderByClause) : null
    )
    return query;
}
function resolve_queryExpression(node: ITree): Query {
    const querySpecification = getChildByType(node.children, "querySpecification");
    const queryExpression = getChildByType(node.children, "queryExpression");
    let query = queryExpression ? resolve_queryExpression(queryExpression) : resolve_querySpecification(querySpecification!);
    query.location = node.location;
    return query;
}

function resolve_queryExpressionNointo(node: ITree): Query {
    const querySpecificationNointo = getChildByType(node.children, "querySpecificationNointo");
    const queryExpressionNointo = getChildByType(node.children, "queryExpressionNointo");
    let query = queryExpressionNointo ? resolve_queryExpressionNointo(queryExpressionNointo) : resolve_querySpecificationNointo(querySpecificationNointo!);
    query.location = node.location;
    return query;

}
function resolve_querySpecification(node: ITree): Query {
    const querySpecificationNointo = getChildByType(node.children, "querySpecificationNointo");
    const fromClause = getChildByType(node.children, "opt_fromClause")?.children?.[0];
    const orderByClause = getChildByType(node.children, "opt_orderByClause")?.children?.[0];
    if (querySpecificationNointo) {
        return resolve_querySpecificationNointo(querySpecificationNointo);
    }
    let query: Query;
    query = new Query(
        node.location,
        resolve_selectElements(getChildByType(node.children, "selectElements")!),
        fromClause ? resolve_fromClause(fromClause) : [],
        [],
        null,
        undefined,
        orderByClause ? resolve_orderByClause(orderByClause) : null
    )
    return query;
}

function resolve_unionType(node: ITree): string {
    return node.getText();
}

function resolve_unionStatements(node: ITree): { unionType: string, query: Query } {
    const unionStatement = getChildByType(node.children, "unionStatement")!;
    const unionStatements = getChildByType(node.children, "unionStatements");

    const unionType = resolve_unionType(getChildByType(unionStatement.children, "unionType")!);
    const querySpecificationNointo = getChildByType(unionStatement.children, "querySpecificationNointo");
    const queryExpressionNointo = getChildByType(unionStatement.children, "queryExpressionNointo");
    let query = querySpecificationNointo ? resolve_querySpecificationNointo(querySpecificationNointo) : resolve_queryExpressionNointo(queryExpressionNointo!);
    if (unionStatements) {
        const { unionType, query: rightQuery } = resolve_unionStatements(unionStatements);
        query.unionType = unionType;
        query.union = rightQuery;
        query.location = node.location;
    }
    return {
        unionType,
        query
    }
}

function resolve_unionParenthesises(node: ITree): { union: Query, unionType: string } {
    const unionParenthesis = getChildByType(node.children, "unionParenthesis")!;
    const unionParenthesises = getChildByType(node.children, "unionParenthesises");

    const unionType = resolve_unionType(getChildByType(unionParenthesis.children, "unionType")!);
    const queryExpressionNointo = getChildByType(unionParenthesis.children, "queryExpressionNointo");

    const query = resolve_queryExpressionNointo(queryExpressionNointo!);
    if (unionParenthesises) {
        const { union, unionType } = resolve_unionParenthesises(unionParenthesises);
        query.unionType = unionType;
        query.union = union;
        query.location = node.location;
    }
    return {
        unionType,
        union: query
    }
}

function resolve_selectStatement(node: ITree): Query | null {
    const querySpecification = getChildByType(node.children, 'querySpecification');
    const queryExpression = getChildByType(node.children, 'queryExpression');
    const queryExpressionNointo = getChildByType(node.children, 'queryExpressionNointo');
    const querySpecificationNointo = getChildByType(node.children, 'querySpecificationNointo');
    const unionStatements = getChildByType(node.children, 'unionStatements');
    const unionParenthesises = getChildByType(node.children, 'unionParenthesises');
    const orderByClause = getChildByType(node.children, 'opt_orderByClause')?.children?.[0];
    if (!unionParenthesises && !querySpecificationNointo) {
        let query: Query;
        switch (node.children[0].type) {
            case "querySpecification": {
                query = resolve_querySpecification(querySpecification!);
                query.location = node.location;
                return query;
            }
            case "queryExpression": {
                query = resolve_queryExpression(queryExpression!);
                query.location = node.location;
                return query;
            }
            case "queryExpressionNointo": {
                query = resolve_queryExpressionNointo(queryExpressionNointo!);
                query.location = node.location;
                return query;
            }
            default: {
                return null;
            }
        }
    } else if (unionStatements) {
        // | querySpecificationNointo unionStatements UNION unionType querySpecification opt_orderByClause opt_limitClause opt_lockClause
        // | querySpecificationNointo unionStatements UNION unionType queryExpression opt_orderByClause opt_limitClause opt_lockClause
        // | querySpecificationNointo unionStatements opt_orderByClause opt_limitClause opt_lockClause 
        const leftQuery: Query = resolve_querySpecificationNointo(querySpecificationNointo!);
        leftQuery.location = node.location;
        if (orderByClause) {
            leftQuery.orderBy = resolve_orderByClause(orderByClause);
        }
        const { unionType, query } = resolve_unionStatements(unionStatements!);
        leftQuery.unionType = unionType;
        leftQuery.union = query;
        const unionTypeNode = getChildByType(node.children, 'unionType');
        if (unionTypeNode) {
            const rightQuery = findUnionRight(query);
            rightQuery.unionType = resolve_unionType(unionTypeNode);
            if (querySpecification) {
                rightQuery.union = resolve_querySpecification(querySpecification);
            } else if (queryExpression) {
                rightQuery.union = resolve_queryExpression(queryExpression);
            }
        }
        return query;
    } else {
        const query: Query = resolve_queryExpressionNointo(queryExpressionNointo!);
        const { union, unionType } = resolve_unionParenthesises(unionParenthesises!);
        query.unionType = unionType;
        query.union = union;
        query.location = node.location;
        if (orderByClause) {
            query.orderBy = resolve_orderByClause(orderByClause);
        }
        const unionTypeNode = getChildByType(node.children, 'unionType');
        if (unionTypeNode) {
            const rightQuery = findUnionRight(query);
            rightQuery.unionType = resolve_unionType(unionTypeNode);
            rightQuery.union = resolve_queryExpression(queryExpression!);
        }
        return query;
    }
}



export {
    createFromASTTree
}