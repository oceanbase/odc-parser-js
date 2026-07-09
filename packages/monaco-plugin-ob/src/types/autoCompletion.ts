export interface CompletionAllTables {
    type: 'allTables';
    schema?: string;
    disableSys?: boolean;
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

export interface CompletionAllUserFunctions {
    type: 'allUserFunctions';
}

export interface CompletionAllObjects {
    type: 'allObjects';
}

export interface CompletionAllTableLikeObjects {
    type: 'allTableLikeObjects';
    schema?: string;
    disableSys?: boolean;
}

export interface CompletionAllRoutines {
    type: 'allRoutines';
}

export interface CompletionAllUserRoutines {
    type: 'allUserRoutines';
}

export interface CompletionAllPackages {
    type: 'allPackages';
}

export interface CompletionPackageSubprograms {
    type: 'packageSubprograms';
    packageName: string;
    schemaName?: string;
}

export interface CompletionTableColumns {
    type: 'tableColumns';
    schemaName?: string;
    tableName: string;
    autoNext?: boolean;
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
    CompletionAllObjects |
    CompletionAllTableLikeObjects |
    CompletionAllRoutines |
    CompletionAllUserRoutines |
    CompletionAllPackages |
    CompletionPackageSubprograms |
    CompletionAllFunction | 
    CompletionAllUserFunctions | 
    CompletionTableColumns | 
    CompletionAllSchemas | 
    CompletionWithTableName | 
    CompletionFromTable |
    string
    )[] | null | undefined;
