import format from './plugins/format';

export const plugins = {
    format
}

export { default as SQLDocument } from './core/SQLDocument';

export { SQLType } from './parser/type';

export { PlSqlLexer } from './parser/oracle/PlSqlLexer';
export { PLLexer as MysqlLexer } from './parser/mysql/PLLexer';
