import { IFromTable, ILocation, IOrderBy, ISelectColumn, IWithTable } from ".";

export enum QueryCursorContext {
    SelectList,
    FromList,
    WhereAndGruopBy
}
export class Query {

    constructor(
        public location: ILocation | null = null,
        public selectColumns: ISelectColumn[] = [],
        public fromTables: IFromTable[] = [],
        public withTables: IWithTable[] = [],
        public union: Query | null = null,
        public unionType: string = '',
        public orderBy: IOrderBy | null = null
    ) { }

    /**
     * 获取当前光标所在的上下文位置
     * 不用处理union，因为union会在获取query的阶段去处理，最终会定位到一个最小粒度的query上
     * with也不用处理，因为with的补全只有with的query的部分，里面属于子查询，不属于当前的query。
     */
    public getContext(offset): QueryCursorContext {
        let fromMinIndex = -1, fromMaxIndex = -1;
        this.fromTables.forEach(fromTable => {
            const { location } = fromTable;
            const [start, stop] = location.range;
            if (fromMinIndex === -1) {
                fromMinIndex  = start
            }
            if (fromMaxIndex === -1) {
                fromMaxIndex = stop;
            }
            fromMinIndex = Math.min(start, fromMinIndex)
            fromMaxIndex = Math.max(stop, fromMinIndex)
        })
        if (offset < fromMinIndex) {
            return QueryCursorContext.SelectList
        } else if (offset > fromMaxIndex) {
            return QueryCursorContext.WhereAndGruopBy
        } else {
            return QueryCursorContext.FromList
        }
    }

    /**
     * 合并一个order by，需要考虑更改location
     */
    public mergeOrderBy(orderBy: IOrderBy) {
        this.orderBy = orderBy;
        this.addLocation(orderBy.location);
    }

    public addLocation(endLocation: ILocation) {
        this.location = {
            first_line: this.location!.first_line,
            first_column: this.location!.first_column,
            last_column: endLocation.last_column,
            last_line: endLocation.last_line,
            range: [this.location!.range[0], endLocation.range[1]]
        }
    }
}