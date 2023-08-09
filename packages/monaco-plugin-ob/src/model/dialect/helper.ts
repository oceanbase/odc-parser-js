import { ILocation } from "..";
import { Query } from "../query";

export interface ITree {
    type: string;
    children: ITree[];
    location: ILocation;
    getText: () => string;
}
/**
 * 先序遍历
 */
export function loopTree(tree: ITree, callback: (node) => ITree | void) {
    if (!tree) {
        return;
    }
    const newTree = callback(tree);
    if (newTree) {
        /**
         * 可以选择跳过部分节点的遍历
         */
        loopTree(newTree, callback);
        return;
    }
    const { children } = tree;
    if (!children) {
        return;
    }
    children.forEach(child => {
       loopTree(child, callback);
    })
}

export function getChildByType(children: ITree[], type: string) {
    return children.find(c => c.type === type);
}

/**
 * 寻找union最右边的query
 */
export function findUnionRight(query: Query): Query {
    if (query.union) {
        return findUnionRight(query.union);
    } else {
        return query;
    }
}