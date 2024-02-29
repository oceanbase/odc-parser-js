export enum LanguageType {
    OB_MySQL = 'obmysql',
    OB_Oracle = 'oboracle',
    MySQL = 'mysql',
}

export interface IFunction {
    name: string;
    desc: string;
    params?: IFunctionParam[];
    isNotSupport?: boolean;
    body?: string;
}

export interface ISnippet {
    label: string;
    documentation: string;
    insertText: string;
}

export interface IFunctionParamRich {
    name: string;
    desc?: string;
    dataType?: string;
}
export declare type IFunctionParam = IFunctionParamRich | string;


export interface IModelOptions {
    delimiter: string;
    getTableList?: (schema?: string) => Promise<string[]>;
    getSchemaList?: () => Promise<string[]>;
    getViewList?: (schema?: string) => Promise<string[]>;
    getFunctions?: () => Promise<IFunction[]>;
    getProcedure?: () => Promise<string[]>;
    getDataTypes?: () => Promise<string[]>;
    getPkgs?: () => Promise<string[]>;
    getTableColumns?: (tableName: string, dbName?: string) => Promise<{ columnName: string; columnType: string; }[]>;
    getTableDDL?: (tableName: string, dbName?: string) => Promise<string>;
    getSchemaInfo?: (dbName?: string) => Promise<string>;
    getSnippets?: () => Promise<ISnippet[]>;
}