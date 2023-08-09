import { Query } from "./query";

export function getTableContextFromMap(queryMap, offset) {
    let tableContext: Query | undefined;
    queryMap.forEach((query) => {
      const [start, stop] = query.location!.range!;
      if (offset >= start && offset <= stop) {
        if (!tableContext) {
          tableContext = query;
        } else if (tableContext.location!.range[0] < start) {
          /**
           * 取路径中最近的一个query
           */
          tableContext = query;
        }
      }
    });

    if (tableContext) {
      function getUnionQuery(query: Query, offset) {
        const union = query.union;
        if (!union) {
          return query;
        }
        const [start, stop] = union.location!.range;
        if (start <= offset && stop >= offset) {
          return getUnionQuery(union, offset)
        }
        return query;
      }
      tableContext = getUnionQuery(tableContext, offset)
    }
    return tableContext;
  }