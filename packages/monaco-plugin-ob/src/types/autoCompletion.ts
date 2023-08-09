export interface CompletionAllTables {
    type: 'allTables';
    schema?: string;
}

export interface CompletionAllSchemas {
    type: 'allSchemas';
}

export interface CompletionWithTableName {
    type: 'withTable';
    tableName: string;
}

export interface CompletionAllFunction {
    type: 'allFunction';
}

export interface CompletionTableColumns {
    type: 'tableColumns';
    schemaName?: string;
    tableName: string;
}

export interface CompletionObjectAccess {
    type: 'objectAccess';
    objectName: string;
}

export interface CompletionFromTable {
    type: 'fromTable';
    tableName: string;
    schemaName?: string;
}

export type AutoCompletionItems = (
    CompletionAllTables | 
    CompletionObjectAccess | 
    CompletionAllFunction | 
    CompletionTableColumns | 
    CompletionAllSchemas | 
    CompletionWithTableName | 
    CompletionFromTable |
    string
    )[] | null | undefined;