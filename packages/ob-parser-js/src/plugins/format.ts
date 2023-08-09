import SQLDocument from '../core/SQLDocument';
import { SQLType } from '../parser/type';

interface FormatPluginParams {
    sql: string;
    type: SQLType;
    delimiter?: string;
}

export default function (params: FormatPluginParams): string {
    if (!params) {
        return null;
    }
    const { sql, type, delimiter } = params;
    const sqlDocument = new SQLDocument({
        text: sql,
        type,
        delimiter
    });
    return sqlDocument.getFormatText();
}