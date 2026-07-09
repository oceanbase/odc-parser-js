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

export declare type IObjectCompletion = string | {
    name: string;
    desc?: string;
    schema?: string;
};

export declare type IRoutineCompletion = string | IFunction;

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
    /**
     * 自动提示下一个token,默认为true
     */
    autoNext?: boolean;
    getTableList?: (schema?: string) => Promise<string[]>;
    getSchemaList?: () => Promise<string[]>;
    getViewList?: (schema?: string) => Promise<string[]>;
    getFunctions?: () => Promise<IFunction[]>;
    getProcedure?: (schema?: string) => Promise<IRoutineCompletion[]>;
    getDataTypes?: () => Promise<string[]>;
    getPkgs?: () => Promise<string[]>;
    getExternalTableList?: (schema?: string) => Promise<IObjectCompletion[]>;
    getMaterializedViewList?: (schema?: string) => Promise<IObjectCompletion[]>;
    getTriggerList?: (schema?: string) => Promise<IObjectCompletion[]>;
    getSequenceList?: (schema?: string) => Promise<IObjectCompletion[]>;
    getSynonymList?: (schema?: string) => Promise<IObjectCompletion[]>;
    getPackageSubprograms?: (pkgName: string, schema?: string) => Promise<IRoutineCompletion[]>;
    getTableColumns?: (tableName: string, dbName?: string) => Promise<{ columnName: string; columnType: string; }[]>;
    getTableDDL?: (tableName: string, dbName?: string) => Promise<string>;
    getSchemaInfo?: (dbName?: string) => Promise<string>;
    getSnippets?: () => Promise<ISnippet[]>;
    llm?: {
        completions: (input: string, cursorPosition: number) => Promise<string>;
    }
}
