

%lex

%{
 const keywords = require('./keywords');
%}

%option noyywrap nounput noinput case-insensitive


%x in_c_comment
%options case-insensitive
%options flex

DEC_DIGIT   [0-9]
CHARSET_NAME    (ARMSCII8|ASCII|BIG5|BINARY|CP1250|CP1251|CP1256|CP1257|CP850|CP852|CP866|CP932|DEC8|EUCJPMS|EUCKR|GB2312|GBK|GEOSTD8|GREEK|HEBREW|HP8|KEYBCS2|KOI8R|KOI8U|LATIN1|LATIN2|LATIN5|LATIN7|MACCE|MACROMAN|SJIS|SWE7|TIS620|UCS2|UJIS|UTF16|UTF16LE|UTF32|UTF8|UTF8MB3|UTF8MB4)
EXPONENT_NUM_PART   E[-+]?DEC_DIGIT+
ID_LITERAL  [A-Z_$0-9\u0080-\uFFFF]*?[A-Z_$\u0080-\uFFFF]+?[A-Z_$0-9\u0080-\uFFFF]*
DQUOTA_STRING   \"([^"\\]|(\"\")|(\\.))*\"
SQUOTA_STRING   \'([^'\\]|(\'\')|(\\.))*\'
BQUOTA_STRING   `([^`\\]|(``)|(\\.))*`
HEX_DIGIT   [0-9A-F]
BIT_STRING_L    B\'[01]+\'
QUOTE_SYMB  (\'|\"|\`)

%%

// SKIP
[ \t\r\n]  /* skip comment */
\/\*[\s\S]*?\*\/ /* skip comment */
((\-\-[ \t]|#)[^\r\n]*(\r?\n|<<EOF>>)|\-\-(\r?\n|<<EOF>>)) /* skip comment */

{QUOTE_SYMB}?"SESSION_VARIABLES_ADMIN"{QUOTE_SYMB}? { return "SESSION_VARIABLES_ADMIN"; }

{ID_LITERAL} {
  // 这里成立的前提前提之一是匹配的始终是最长字符串，并且每个关键字不包含空格等会被匹配成多段的字符
  return keywords[yytext.toUpperCase()] || 'ID';
}

':=' { return "VAR_ASSIGN"; }
'+=' { return "PLUS_ASSIGN"; }
'-=' { return "MINUS_ASSIGN"; }
'*=' { return "EQUAL_SYMBOL"; }
'/=' { return "DIV_ASSIGN"; }
'%=' { return "MOD_ASSIGN"; }
'&=' { return "AND_ASSIGN"; }
'^=' { return "XOR_ASSIGN"; }
'|=' { return "OR_ASSIGN"; }
// Operators. Arithmetics
'*' { return "STAR"; }
'/' { return "DIVIDE"; }
'%' { return "MODULE"; }
'+' { return "PLUS"; }
'--' { return "MINUSMINUS"; }
'-' { return "MINUS"; }
'DIV' { return "DIV"; }
'MOD' { return "MOD"; }
// Operators. Comparation
'=' { return "EQUAL_SYMBOL"; }
'>' { return "GREATER_SYMBOL"; }
'<' { return "LESS_SYMBOL"; }
'!' { return "EXCLAMATION_SYMBOL"; }
// Operators. Bit
'~' { return "BIT_NOT_OP"; }
'|' { return "BIT_OR_OP"; }
'||' { return "DOUBLE_BIT_OR_OP"; }
'&' { return "BIT_AND_OP"; }
'^' { return "BIT_XOR_OP"; }
// Constructors symbols
'.' { return "DOT"; }
'(' { return "LR_BRACKET"; }
')' { return "RR_BRACKET"; }
',' { return "COMMA"; }
';' { return "SEMI"; }
'@' { return "AT_SIGN"; }
'0' { return "ZERO_DECIMAL"; }
'1' { return "ONE_DECIMAL"; }
'2' { return "TWO_DECIMAL"; }
"'" { return "SINGLE_QUOTE_SYMB"; }
'"' { return "DOUBLE_QUOTE_SYMB"; }
'`' { return "REVERSE_QUOTE_SYMB"; }
':' { return "COLON_SYMB"; }

'`'{CHARSET_NAME}'`' { return "CHARSET_REVERSE_QOUTE_STRING"; }
{DEC_DIGIT}+('K'|'M'|'G'|'T')    { return "FILESIZE_LITERAL"; }
'N'{SQUOTA_STRING}   { return "START_NATIONAL_STRING_LITERAL"; }
({DQUOTA_STRING}|{SQUOTA_STRING}|{BQUOTA_STRING}) { return "STRING_LITERAL"; }
{DEC_DIGIT}+    {return "DECIMAL_LITERAL";}
("X'"({HEX_DIGIT}{HEX_DIGIT})+"'"|'0X'{HEX_DIGIT}+)  {return "HEXADECIMAL_LITERAL"; }
(({DEC_DIGIT}+)?'.'{DEC_DIGIT}+|{DEC_DIGIT}+'.'{EXPONENT_NUM_PART}|({DEC_DIGIT}+)?'.'({DEC_DIGIT}+{EXPONENT_NUM_PART})|{DEC_DIGIT}+{EXPONENT_NUM_PART}) { return "REAL_LITERAL"; }
"\\N"   { return "NULL_SPEC_LITERAL"; }
{BIT_STRING_L}  { return "BIT_STRING"; }
"_"{CHARSET_NAME}  { return "STRING_CHARSET_NAME"; }

// Hack for dotID
// Prevent recognize string:         .123somelatin AS ((.123), FLOAT_LITERAL), ((somelatin), ID)
//  it must recoginze:               .123somelatin AS ((.), DOT), (123somelatin, ID)

"."{ID_LITERAL} { return "DOT_ID"; }


// Identifiers
{ID_LITERAL}    { return "ID"; }
// DOUBLE_QUOTE_ID:                  '"' ~'"'+ '"';
'`'[^`]+'`'   { return "REVERSE_QUOTE_ID"; }
({SQUOTA_STRING}|{DQUOTA_STRING}|{BQUOTA_STRING}|{ID_LITERAL})@({SQUOTA_STRING}|{DQUOTA_STRING}|{BQUOTA_STRING}|{ID_LITERAL}|{IP_ADDRESS})   { return "STRING_USER_NAME"; }
([0-9]+'.'[0-9.]+|[0-9A-F:]+COLON_SYMB[0-9A-F:]+)   { return "IP_ADDRESS"; }
@([A-Z0-9._$]+|{SQUOTA_STRING}|{DQUOTA_STRING}|{BQUOTA_STRING})   { return "LOCAL_ID"; }
@@([A-Z0-9._$]+|{BQUOTA_STRING})   { return "GLOBAL_ID"; }
<<EOF>> {return 'END_P';}

/lex

%left LR_BRACKET RR_BRACKET
%left BIT_OR_OP
%left MINUSMINUS 
%left LESS_SYMBOL LESS_SYMBOL  GREATER_SYMBOL GREATER_SYMBOL  BIT_AND_OP  BIT_XOR_OP  BIT_OR_OP
%left PLUS  MINUS
%left STAR  DIVIDE  MODULE  DIV  MOD  MINUSMINUS
%left VAR_ASSIGN

%start root

%%

// Top Level Description

root
    : statement MINUSMINUS END_P
    | MINUSMINUS END_P
    | statement END_P
    { let a = yyvstack, b = yyrulelength, c = yystack, d= yysp, e = yylstack; }
    ;
opt_SEMI
    : SEMI
    | 
    ;
opt_MINUSMINUS
    : MINUSMINUS
    |
    ;
statement
    : sqlStatement opt_MINUSMINUS opt_SEMI 
    ;

sqlStatement
    : ddlStatement | dmlStatement | transactionStatement
    | replicationStatement | preparedStatement
    | administrationStatement | utilityStatement
    | emptyStatement
    ;

emptyStatement
    : SEMI
    ;

ddlStatement
    : createDatabase | createEvent | createIndex
    | createLogfileGroup | createProcedure | createFunction
    | createServer | createTable | createTablespaceInnodb
    | createTablespaceNdb | createTrigger | createView
    | alterDatabase | alterEvent | alterFunction
    | alterInstance | alterLogfileGroup | alterProcedure
    | alterServer | alterTable | alterTablespace | alterView
    | dropDatabase | dropEvent | dropIndex
    | dropLogfileGroup | dropProcedure | dropFunction
    | dropServer | dropTable | dropTablespace
    | dropTrigger | dropView
    | renameTable | truncateTable
    ;

dmlStatement
    : selectStatement | insertStatement | updateStatement
    | deleteStatement | replaceStatement | callStatement
    | loadDataStatement | loadXmlStatement | doStatement
    | handlerStatement
    ;

transactionStatement
    : startTransaction
    | beginWork | commitWork | rollbackWork
    | savepointStatement | rollbackStatement
    | releaseStatement | lockTables | unlockTables
    ;

replicationStatement
    : changeMaster | changeReplicationFilter | purgeBinaryLogs
    | resetMaster | resetSlave | startSlave | stopSlave
    | startGroupReplication | stopGroupReplication
    | xaStartTransaction | xaEndTransaction | xaPrepareStatement
    | xaCommitWork | xaRollbackWork | xaRecoverWork
    ;

preparedStatement
    : prepareStatement | executeStatement | deallocatePrepare
    ;

// remark: NOT INCLUDED IN sqlStatement, but include in body
//  of routine's statements
compoundStatement
    : blockStatement
    | caseStatement | ifStatement | leaveStatement
    | loopStatement | repeatStatement | whileStatement
    | iterateStatement | returnStatement | cursorStatement
    ;

administrationStatement
    : alterUser | createUser | dropUser | grantStatement
    | grantProxy | renameUser | revokeStatement
    | revokeProxy | analyzeTable | checkTable
    | checksumTable | optimizeTable | repairTable
    | createUdfunction | installPlugin | uninstallPlugin
    | setStatement | showStatement | binlogStatement
    | cacheIndexStatement | flushStatement | killStatement
    | loadIndexIntoCache | resetStatement
    | shutdownStatement
    ;

utilityStatement
    : simpleDescribeStatement | fullDescribeStatement
    | helpStatement | useStatement | signalStatement
    | resignalStatement | diagnosticsStatement
    ;


// Data Definition Language

//    Create statements
opt_ifNotExists
    : ifNotExists
    |
    ;
dbFormat
    : DATABASE | SCHEMA
    ;

createDatabase
    : CREATE dbFormat
      opt_ifNotExists uid createDatabaseOptions
    | CREATE dbFormat
      opt_ifNotExists uid
    ;
createDatabaseOptions
    : createDatabaseOption
    | createDatabaseOption createDatabaseOptions
    ;
createEvent
    : CREATE opt_ownerStatement EVENT opt_ifNotExists fullId
      ON SCHEDULE scheduleExpression
      opt_eventPreserve opt_enableType
      opt_comment
      DO routineBody
    ;
opt_eventPreserve
    : ON COMPLETION opt_NOT PRESERVE
    |
    ;
opt_comment
    : COMMENT STRING_LITERAL
    |
    ;
commentAssign
    : COMMENT EQUAL_SYMBOL STRING_LITERAL
    | COMMENT STRING_LITERAL
    ;
opt_commentAssign
    : commentAssign
    |
    ;
opt_NOT
    : NOT
    |
    ;

opt_ownerStatement
    : ownerStatement
    |
    ;
opt_enableType
    : enableType
    |
    ;
createIndex
    : CREATE
      opt_intimeAction
      opt_indexCategory
      INDEX uid opt_indexType
      ON tableName indexColumnNames
      opt_indexOptions
      optIndexLockAndAlgorithmAssigns
    ;
optIndexLockAndAlgorithmAssigns
    : algorithmAssign indexLockAndAlgorithmAssign
    | indexLockAssign indexLockAndAlgorithmAssign
    | 
    ;
opt_intimeAction
    : ONLINE | OFFLINE
    |
    ;
opt_indexCategory
    : UNIQUE | FULLTEXT | SPATIAL
    |
    ;
opt_indexType
    : indexType
    |
    ;
indexOptions
    : indexOption
    | indexOption indexOptions
    ;
opt_indexOptions
    : indexOptions
    |
    ;
createLogfileGroup
    : CREATE LOGFILE GROUP uid
      ADD UNDOFILE STRING_LITERAL
      opt_createLogfileGroup_size
      opt_createLogfileGroup_undo
      opt_createLogfileGroup_redo
      opt_nodeGroupAssign
      opt_WAIT
      opt_commentAssign
      ENGINE opt_MULT_ASSIGN engineName
    ;

opt_nodeGroupAssign
    : NODEGROUP EQUAL_SYMBOL uid
    | NODEGROUP uid
    |
    ;
opt_WAIT
    : WAIT
    |
    ;
opt_createLogfileGroup_size
    : INITIAL_SIZE EQUAL_SYMBOL fileSizeLiteral
    | INITIAL_SIZE fileSizeLiteral
    |
    ;
opt_createLogfileGroup_undo
    : UNDO_BUFFER_SIZE EQUAL_SYMBOL fileSizeLiteral
    | UNDO_BUFFER_SIZE fileSizeLiteral
    |
    ;
opt_createLogfileGroup_redo
    : REDO_BUFFER_SIZE EQUAL_SYMBOL fileSizeLiteral
    | REDO_BUFFER_SIZE fileSizeLiteral
    |
    ;

createProcedure
    : CREATE opt_ownerStatement
    PROCEDURE fullId
      LR_BRACKET opt_procedureParameters RR_BRACKET
      opt_routineOptions
    routineBody
    ;
routineOptions
    : routineOption
    | routineOption routineOptions
    ;
opt_routineOptions
    : routineOptions
    |
    ;
procedureParameters
    : procedureParameter
    | procedureParameter COMMA procedureParameters
    ;
opt_procedureParameters
    : procedureParameters
    |
    ;

createFunction
    : CREATE opt_ownerStatement
    FUNCTION fullId
      LR_BRACKET opt_functionParameters RR_BRACKET
      RETURNS dataType
      opt_routineOptions
    returnStatement
    | CREATE opt_ownerStatement
    FUNCTION fullId
      LR_BRACKET opt_functionParameters RR_BRACKET
      RETURNS dataType
      opt_routineOptions
    routineBody
    ;
functionParameters
    : functionParameter
    | functionParameter COMMA functionParameters
    ;
opt_functionParameters
    : functionParameters
    |
    ;

createServer
    : CREATE SERVER uid
    FOREIGN DATA WRAPPER STRING_LITERAL
    OPTIONS LR_BRACKET opt_serverOptions RR_BRACKET
    | CREATE SERVER uid
    FOREIGN DATA WRAPPER MYSQL
    OPTIONS LR_BRACKET opt_serverOptions RR_BRACKET
    ;

createTable
    : CREATE opt_TEMPORARY TABLE opt_ifNotExists
       tableName LIKE tableName                                                          
    | CREATE opt_TEMPORARY TABLE opt_ifNotExists
       tableName LR_BRACKET LIKE tableName RR_BRACKET
    | CREATE opt_TEMPORARY TABLE opt_ifNotExists
       tableName opt_createDefinitions
       opt_tableOptions
       opt_partitionDefinitions opt_keyViolate
       opt_AS selectStatement                                         
    | CREATE opt_TEMPORARY TABLE opt_ifNotExists
       tableName opt_createDefinitions
       opt_tableOptions
       opt_partitionDefinitions                                        
    ;
opt_keyViolate
    : IGNORE | REPLACE
    |
    ;
opt_partitionDefinitions
    : partitionDefinitions
    |
    ;
opt_AS
    : AS
    |
    ;
opt_tableOptions
    : tableOptions
    |
    ;
tableOptions
    : tableOption
    | tableOption COMMA tableOptions
    ;
opt_createDefinitions
    : createDefinitions
    |
    ;
opt_TEMPORARY
    : TEMPORARY
    |
    ;
createTablespaceInnodb
    : CREATE TABLESPACE uid
      ADD DATAFILE STRING_LITERAL
      FILE_BLOCK_SIZE EQUAL_SYMBOL fileSizeLiteral
      | CREATE TABLESPACE uid
      ADD DATAFILE STRING_LITERAL
      ENGINE opt_MULT_ASSIGN engineName
      | CREATE TABLESPACE uid
      ADD DATAFILE STRING_LITERAL
      FILE_BLOCK_SIZE EQUAL_SYMBOL fileSizeLiteral
      ENGINE opt_MULT_ASSIGN engineName
      | CREATE TABLESPACE uid
      ADD DATAFILE STRING_LITERAL
    ;

createTablespaceNdb
    : CREATE TABLESPACE uid
      ADD DATAFILE STRING_LITERAL
      USE LOGFILE GROUP uid
      opt_createTablespaceNdbExtent
      opt_createTablespaceNdbInitial
      opt_createTablespaceNdbAutoExtent
      opt_createTablespaceNdbAutoMaxSize
      opt_nodeGroupAssign
      opt_WAIT
      opt_commentAssign
      ENGINE opt_MULT_ASSIGN engineName
    ;
opt_createTablespaceNdbExtent
    : EXTENT_SIZE opt_MULT_ASSIGN fileSizeLiteral
    |
    ;
opt_createTablespaceNdbInitial
    : INITIAL_SIZE opt_MULT_ASSIGN fileSizeLiteral
    |
    ;
opt_createTablespaceNdbAutoExtent
    : AUTOEXTEND_SIZE opt_MULT_ASSIGN fileSizeLiteral
    |
    ;
opt_createTablespaceNdbAutoMaxSize
    : MAX_SIZE opt_MULT_ASSIGN fileSizeLiteral
    |
    ;
createTrigger
    : CREATE opt_ownerStatement
      TRIGGER fullId
      triggerTime
      triggerEvent
      ON tableName FOR EACH ROW
      triggerPlace fullId
      routineBody
      | CREATE opt_ownerStatement
      TRIGGER fullId
      triggerTime
      triggerEvent
      ON tableName FOR EACH ROW
      routineBody
    ;
triggerTime
    : BEFORE | AFTER
    ;
triggerEvent
    : INSERT | UPDATE | DELETE
    ;
triggerPlace
    : FOLLOWS | PRECEDES
    ;

createView
    : CREATE opt_orReplace
      opt_viewAlgorithmAssign
      opt_ownerStatement
      opt_sqlSecurity
      VIEW fullId opt_uidList AS selectStatement
      opt_viewCheckOption
    ;
opt_uidList
    : LR_BRACKET uidList RR_BRACKET
    |
    ;
opt_viewCheckOption
    : WITH CASCADED CHECK OPTION
    | WITH LOCAL CHECK OPTION
    | WITH CHECK OPTION
    |
    ;
opt_sqlSecurity
    : SQL SECURITY INVOKER
    | SQL SECURITY DEFINER
    |
    ;
opt_orReplace
    : OR REPLACE
    |
    ;
opt_viewAlgorithmAssign
    : ALGORITHM EQUAL_SYMBOL UNDEFINED
    | ALGORITHM EQUAL_SYMBOL MERGE
    | ALGORITHM EQUAL_SYMBOL TEMPTABLE
    |
    ;
// details

createDatabaseOption
    : opt_DEFAULT charsetKeywords opt_MULT_ASSIGN charsetValues
    | opt_DEFAULT COLLATE opt_MULT_ASSIGN collationName
    ;
charsetKeywords
    : CHARACTER SET
    | CHARSET
    ;
charsetValues
    : charsetName | DEFAULT
    ;
opt_DEFAULT
    : DEFAULT
    |
    ;
ownerStatement
    : DEFINER EQUAL_SYMBOL userName
    | DEFINER EQUAL_SYMBOL CURRENT_USER LR_BRACKET RR_BRACKET
    | DEFINER EQUAL_SYMBOL CURRENT_USER 
    ;

scheduleExpression
    : AT timestampValue opt_intervalExprs                               
    | EVERY intervalValue intervalType
        opt_scheduleStartTime
        opt_scheduleEndTime                                                       
    ;
opt_scheduleStartTime
    : STARTS timestampValue
          opt_intervalExprs
    |
    ;
opt_scheduleEndTime
    : ENDS timestampValue
          opt_intervalExprs
    |
    ;
intervalExprs
    : intervalExpr 
    | intervalExpr intervalExprs
    ;
opt_intervalExprs
    : intervalExprs
    |
    ;
intervalValue
    : expression
    ;
timestampValue
    : expression
    ;

intervalExpr
    : PLUS INTERVAL intervalValue intervalType
    ;

intervalType
    : intervalTypeBase
    | YEAR | YEAR_MONTH | DAY_HOUR | DAY_MINUTE
    | DAY_SECOND | HOUR_MINUTE | HOUR_SECOND | MINUTE_SECOND
    | SECOND_MICROSECOND | MINUTE_MICROSECOND
    | HOUR_MICROSECOND | DAY_MICROSECOND
    ;

enableType
    : ENABLE | DISABLE | DISABLE ON SLAVE
    ;

indexType
    : USING BTREE
    | USING HASH
    ;

indexOption
    : KEY_BLOCK_SIZE opt_MULT_ASSIGN fileSizeLiteral
    | indexType
    | WITH PARSER uid
    | COMMENT STRING_LITERAL
    | INVISIBLE
    | VISIBLE
    ;

procedureParameter
    : opt_procDirection uid dataType
    ;
opt_procDirection
    : IN | OUT | INOUT
    |
    ;

functionParameter
    : uid dataType
    ;

routineOption
    : COMMENT STRING_LITERAL                                       
    | LANGUAGE SQL                                                  
    | opt_NOT DETERMINISTIC                                           
    | routineSQLType                                                           
    | SQL SECURITY DEFINER
    | SQL SECURITY INVOKER                     
    ;
routineSQLType
    : CONTAINS SQL | NO SQL | READS SQL DATA
        | MODIFIES SQL DATA
    ;

serverOption
    : HOST STRING_LITERAL
    | DATABASE STRING_LITERAL
    | USER STRING_LITERAL
    | PASSWORD STRING_LITERAL
    | SOCKET STRING_LITERAL
    | OWNER STRING_LITERAL
    | PORT decimalLiteral
    ;

createDefinitions
    : LR_BRACKET createDefinitionsNoB RR_BRACKET
    ;
createDefinitionsNoB
    : createDefinition COMMA createDefinitionsNoB
    | createDefinition
    ;

createDefinition
    : uid columnDefinition                                          
    | tableConstraint                                               
    | indexColumnDefinition                                         
    ;

columnDefinition
    : dataType opt_columnConstraints
    ;
opt_columnConstraints
    : columnConstraints
    |
    ;
columnConstraints
    : columnConstraint
    | columnConstraint columnConstraints
    ;

columnConstraint
    : nullNotnull                                                   
    | DEFAULT defaultValue                                          
    | ON UPDATE currentTimestamp
    | AUTO_INCREMENT      
    | KEY
    | PRIMARY KEY                                              
    | UNIQUE KEY
    | UNIQUE                                           
    | COMMENT STRING_LITERAL                                        
    | COLUMN_FORMAT colformat        
    | STORAGE storageval                  
    | referenceDefinition                                            
    | COLLATE collationName                                          
    | GENERATED ALWAYS AS LR_BRACKET expression RR_BRACKET opt_generatedType  
    | AS LR_BRACKET expression RR_BRACKET opt_generatedType
    | SERIAL DEFAULT VALUE                                           
    | opt_tableConstraint
      CHECK LR_BRACKET expression RR_BRACKET                                       
    ;
opt_tableConstraint
    : CONSTRAINT opt_uid
    |
    ;
opt_uid
    : uid 
    |
    ;
opt_generatedType
    : VIRTUAL | STORED
    |
    ;
colformat
    : FIXED | DYNAMIC | DEFAULT
    ;
storageval
    : DISK | MEMORY | DEFAULT
    ;
tableConstraint
    : opt_tableConstraint
      PRIMARY KEY opt_uid opt_indexType
      indexColumnNames opt_indexOptions                                 
    | opt_tableConstraint
      UNIQUE opt_tableConstraintFormat opt_uid
      opt_indexType indexColumnNames opt_indexOptions                     
    | opt_tableConstraint
      FOREIGN KEY opt_uid indexColumnNames
      referenceDefinition                                           
    | opt_tableConstraint
      CHECK LR_BRACKET expression RR_BRACKET                                      
    ;
opt_tableConstraintFormat
    : tableConstraintFormat
    |
    ;
tableConstraintFormat
    : INDEX | KEY
    ;
referenceDefinition
    : REFERENCES tableName opt_indexColumnNames
      MATCH referenceDefinitionMatchType
      opt_referenceAction
    | REFERENCES tableName opt_indexColumnNames
      opt_referenceAction
    ;
opt_referenceAction
    : referenceAction
    |
    ;
opt_indexColumnNames
    : indexColumnNames
    |
    ;
referenceDefinitionMatchType
    : FULL | PARTIAL | SIMPLE
    ;
referenceAction
    : ON DELETE referenceControlType
      ON UPDATE referenceControlType
    | ON DELETE referenceControlType
    | ON UPDATE referenceControlType
    | ON UPDATE referenceControlType
      ON DELETE referenceControlType
    ;

referenceControlType
    : RESTRICT | CASCADE | SET NULL_LITERAL | NO ACTION
    ;

indexColumnDefinition
    : tableConstraintFormat opt_uid opt_indexType
      indexColumnNames opt_indexOptions                                 
    | SPATIAL
      opt_tableConstraintFormat opt_uid
      indexColumnNames opt_indexOptions             
    | FULLTEXT
      opt_tableConstraintFormat opt_uid
      indexColumnNames opt_indexOptions                        
    ;

tableOption
    : ENGINE opt_MULT_ASSIGN engineName                                        
    | AUTO_INCREMENT opt_MULT_ASSIGN decimalLiteral                            
    | AVG_ROW_LENGTH opt_MULT_ASSIGN decimalLiteral                            
    | opt_DEFAULT charsetKeywords opt_MULT_ASSIGN charsetValues
    | CHECKSUM opt_MULT_ASSIGN boolNumValue   
    | PAGE_CHECKSUM opt_MULT_ASSIGN boolNumValue  
    | opt_DEFAULT COLLATE opt_MULT_ASSIGN collationName                          
    | commentAssign                                   
    | COMPRESSION opt_MULT_ASSIGN STRING_LITERAL
    | COMPRESSION opt_MULT_ASSIGN ID                     
    | CONNECTION opt_MULT_ASSIGN STRING_LITERAL                                
    | DATA DIRECTORY opt_MULT_ASSIGN STRING_LITERAL                           
    | DELAY_KEY_WRITE opt_MULT_ASSIGN boolNumValue                    
    | ENCRYPTION opt_MULT_ASSIGN STRING_LITERAL                                
    | INDEX DIRECTORY opt_MULT_ASSIGN STRING_LITERAL                           
    | INSERT_METHOD opt_MULT_ASSIGN insertMethod      
    | KEY_BLOCK_SIZE opt_MULT_ASSIGN fileSizeLiteral                           
    | MAX_ROWS opt_MULT_ASSIGN decimalLiteral                                 
    | MIN_ROWS opt_MULT_ASSIGN decimalLiteral                                  
    | PACK_KEYS opt_MULT_ASSIGN boolNumValue      
    | PACK_KEYS opt_MULT_ASSIGN DEFAULT       
    | PASSWORD opt_MULT_ASSIGN STRING_LITERAL                                 
    | ROW_FORMAT opt_MULT_ASSIGN rowFormat                                                          
    | STATS_AUTO_RECALC opt_MULT_ASSIGN DEFAULT                      
    | STATS_AUTO_RECALC opt_MULT_ASSIGN boolNumValue     
    | STATS_PERSISTENT opt_MULT_ASSIGN DEFAULT 
    | STATS_PERSISTENT opt_MULT_ASSIGN  boolNumValue   
    | STATS_SAMPLE_PAGES opt_MULT_ASSIGN decimalLiteral                        
    | TABLESPACE uid tablespaceStorage                            
    | TABLESPACE uid                           
    | tablespaceStorage                                             
    | UNION opt_MULT_ASSIGN LR_BRACKET tables RR_BRACKET                                    
    ;
rowFormat
    : DEFAULT | DYNAMIC | FIXED | COMPRESSED
          | REDUNDANT | COMPACT | ID
    ;
insertMethod
    : NO | FIRST | LAST
    ;
boolNumValue
    : ZERO_DECIMAL | ONE_DECIMAL
    ;
tablespaceStorage
    : STORAGE storageval
    ;

partitionDefinitions
    : PARTITION BY partitionFunctionDefinition opt_partitionCount SUBPARTITION BY subpartitionFunctionDefinition opt_subPartitionCount
    | PARTITION BY partitionFunctionDefinition opt_partitionCount LR_BRACKET partitionDefinitionList RR_BRACKET
    | PARTITION BY partitionFunctionDefinition opt_partitionCount
    | PARTITION BY partitionFunctionDefinition opt_partitionCount
        SUBPARTITION BY subpartitionFunctionDefinition
        opt_subPartitionCount
    LR_BRACKET partitionDefinitionList RR_BRACKET
    ;
partitionDefinitionList
    : partitionDefinition
    | partitionDefinition COMMA partitionDefinitionList
    ;
opt_partitionCount
    : PARTITIONS decimalLiteral
    |
    ;
opt_subPartitionCount
    : SUBPARTITIONS decimalLiteral
    |
    ;
partitionFunctionDefinition
    : opt_LINEAR HASH LR_BRACKET expression RR_BRACKET                              
    | opt_LINEAR KEY opt_linearKeyAlgType
      LR_BRACKET uidList RR_BRACKET                                              
    | RANGE COLUMNS LR_BRACKET uidList RR_BRACKET  
    | RANGE  LR_BRACKET expression RR_BRACKET 
    | LIST COLUMNS LR_BRACKET uidList RR_BRACKET    
    | LIST LR_BRACKET expression RR_BRACKET       
    ;

subpartitionFunctionDefinition
    : opt_LINEAR HASH LR_BRACKET expression RR_BRACKET                               
    | opt_LINEAR KEY opt_linearKeyAlgType
      LR_BRACKET uidList RR_BRACKET                                               
    ;
opt_LINEAR
    : LINEAR
    |
    ;
opt_linearKeyAlgType
    : ALGORITHM EQUAL_SYMBOL STRING_LITERAL
    |
    ;
partitionDefinition
    : PARTITION uid VALUES LESS THAN
      LR_BRACKET
          partitionDefinerAtoms
      RR_BRACKET
      opt_partitionOptions
      opt_subpartitionDefinitions       
    | PARTITION uid VALUES LESS THAN partitionDefinerAtom partitionOptions  opt_subpartitionDefinitions       
    | PARTITION uid VALUES LESS THAN partitionDefinerAtom opt_subpartitionDefinitions       
    | PARTITION uid VALUES IN
      LR_BRACKET
          partitionDefinerAtoms
      RR_BRACKET
      opt_partitionOptions
      opt_subpartitionDefinitions       
    | PARTITION uid VALUES IN
      LR_BRACKET
          partitionDefinerVectors
      RR_BRACKET
      opt_partitionOptions
      opt_subpartitionDefinitions       
    | PARTITION uid opt_partitionOptions
      opt_subpartitionDefinitions       
    ;
partitionDefinerVectors
    : partitionDefinerVector
    | partitionDefinerVector COMMA partitionDefinerVectors
    ;
partitionOptions
    : partitionOption
    | partitionOption partitionOptions
    ;
opt_partitionOptions
    : partitionOptions
    |
    ;
partitionDefinerAtoms
    : partitionDefinerAtom
    | partitionDefinerAtom partitionDefinerAtoms
    ;
subpartitionDefinitions
    : subpartitionDefinition
    | subpartitionDefinition subpartitionDefinitions
    ;
opt_subpartitionDefinitions
    : subpartitionDefinitions
    |
    ;
partitionDefinerAtom
    : expression | MAXVALUE
    ;

partitionDefinerVector
    : LR_BRACKET partitionDefinerAtom COMMA partitionDefinerAtoms  RR_BRACKET
    ;

subpartitionDefinition
    : SUBPARTITION uid opt_partitionOptions
    ;
opt_STORAGE
    : STORAGE
    |
    ;
partitionOption
    : opt_STORAGE ENGINE opt_MULT_ASSIGN engineName                              
    | commentAssign
    | DATA DIRECTORY opt_MULT_ASSIGN STRING_LITERAL              
    | INDEX DIRECTORY opt_MULT_ASSIGN STRING_LITERAL            
    | MAX_ROWS opt_MULT_ASSIGN decimalLiteral                         
    | MIN_ROWS opt_MULT_ASSIGN decimalLiteral                         
    | TABLESPACE opt_MULT_ASSIGN uid                                
    | NODEGROUP opt_MULT_ASSIGN uid                                  
    ;

//    Alter statements

alterDatabase
    : ALTER dbFormat opt_uid
      createDatabaseOptions                                         
    | ALTER dbFormat uid
      UPGRADE DATA DIRECTORY NAME                                   
    ;

alterEvent
    : ALTER opt_ownerStatement
      EVENT fullId
      opt_scheduleExpress
      opt_eventPreserve
      opt_renameEvent opt_enableType
      opt_comment
      optEventDo
    ;
optEventDo
    : DO routineBody
    |
    ;
opt_renameEvent
    : RENAME TO fullId
    |
    ;
opt_scheduleExpress
    : ON SCHEDULE scheduleExpression
    |
    ;
alterFunction
    : ALTER FUNCTION fullId opt_routineOptions
    ;

alterInstance
    : ALTER INSTANCE ROTATE INNODB MASTER KEY
    ;

alterLogfileGroup
    : ALTER LOGFILE GROUP uid
      ADD UNDOFILE STRING_LITERAL
      opt_WAIT ENGINE opt_MULT_ASSIGN engineName
    |  ALTER LOGFILE GROUP uid
      ADD UNDOFILE STRING_LITERAL
      INITIAL_SIZE opt_MULT_ASSIGN fileSizeLiteral
      opt_WAIT ENGINE opt_MULT_ASSIGN engineName
    ;

alterProcedure
    : ALTER PROCEDURE fullId opt_routineOptions
    ;

alterServer
    : ALTER SERVER uid OPTIONS
      LR_BRACKET opt_serverOptions RR_BRACKET
    ;
serverOptions
    : serverOption
    | serverOption COMMA serverOptions
    ;
opt_serverOptions
    : serverOptions
    |
    ;

alterTable
    : ALTER opt_intimeAction
      opt_IGNORE TABLE tableName
      opt_alterSpecifications
      opt_partitionDefinitions
    ;
alterSpecifications
    : alterSpecification
    | alterSpecification COMMA alterSpecifications
    ;
opt_alterSpecifications
    : alterSpecifications
    |
    ;

alterTablespace
    : ALTER TABLESPACE uid
      ADD DATAFILE STRING_LITERAL
      opt_tablespaceSize
      opt_WAIT
      ENGINE opt_MULT_ASSIGN engineName
    | ALTER TABLESPACE uid
      DROP DATAFILE STRING_LITERAL
      opt_tablespaceSize
      opt_WAIT
      ENGINE opt_MULT_ASSIGN engineName
    ;
opt_tablespaceSize
    : INITIAL_SIZE EQUAL_SYMBOL fileSizeLiteral
    |
    ;
alterView
    : ALTER
      opt_viewAlgorithmAssign
      opt_ownerStatement
      opt_sqlSecurity
      VIEW fullId opt_uidList AS selectStatement
      opt_viewCheckOption
    ;

// details
uidColumndefintions
    : uid columnDefinition
    | uid columnDefinition COMMA uidColumndefintions
    ;
opt_COLUMN
    : COLUMN
    |
    ;
opt_alterColumnSort
    : FIRST | AFTER uid
    ;
opt_RESTRICT
    : RESTRICT
    |
    ;
alterSpecification
    : tableOptions                               
    | ADD opt_COLUMN uid columnDefinition FIRST
    | ADD opt_COLUMN uid columnDefinition AFTER uid      
    | ADD opt_COLUMN
        LR_BRACKET
          uidColumndefintions
        RR_BRACKET                                                         
    | ADD tableConstraintFormat opt_uid opt_indexType
      indexColumnNames opt_indexOptions                                 
    | ADD opt_tableConstraint PRIMARY KEY opt_uid
      opt_indexType indexColumnNames opt_indexOptions                      
    | ADD opt_tableConstraint UNIQUE
      opt_tableConstraintFormat opt_uid
      opt_indexType indexColumnNames opt_indexOptions                      
    | ADD FULLTEXT
      opt_tableConstraintFormat opt_uid
      indexColumnNames opt_indexOptions        
    | ADD SPATIAL
      opt_tableConstraintFormat opt_uid
      indexColumnNames opt_indexOptions                            
    | ADD opt_tableConstraint FOREIGN KEY
      opt_uid indexColumnNames referenceDefinition           
    | ADD opt_tableConstraint CHECK LR_BRACKET expression RR_BRACKET          
    | algorithmAssign             
    | ALTER opt_COLUMN uid DROP DEFAULT   
    | ALTER opt_COLUMN uid SET DEFAULT defaultValue               
    | CHANGE opt_COLUMN uid
      uid columnDefinition
      opt_alterColumnSort                             
    | RENAME COLUMN uid TO uid                 
    | indexLockAssign     
    | MODIFY opt_COLUMN
      uid columnDefinition opt_alterColumnSort             
    | DROP opt_COLUMN uid opt_RESTRICT                                    
    | DROP CONSTRAINT uid                                   
    | DROP CHECK uid                                
    | DROP PRIMARY KEY                                              
    | RENAME tableConstraintFormat uid TO uid                   
    | ALTER INDEX uid INVISIBLE           
    | ALTER INDEX uid VISIBLE                        
    | DROP tableConstraintFormat uid                            
    | DROP FOREIGN KEY uid                                          
    | DISABLE KEYS                                                  
    | ENABLE KEYS                                                   
    | RENAME renameFormat renameFormatValue                
    | ORDER BY uidList                                              
    | CONVERT TO CHARACTER SET charsetName
      opt_collateConfig                                      
    | opt_DEFAULT CHARACTER SET EQUAL_SYMBOL charsetName COLLATE EQUAL_SYMBOL collationName     
    | opt_DEFAULT CHARACTER SET EQUAL_SYMBOL charsetName                            
    | DISCARD TABLESPACE                                            
    | IMPORT TABLESPACE                                             
    | FORCE                                                         
    | WITHOUT VALIDATION 
    | WITH VALIDATION                 
    | ADD PARTITION
        LR_BRACKET
          partitionDefinitionList
        RR_BRACKET                                                         
    | DROP PARTITION uidList                                        
    | DISCARD PARTITION partitionUid TABLESPACE                  
    | IMPORT PARTITION partitionUid TABLESPACE                   
    | TRUNCATE PARTITION partitionUid                            
    | COALESCE PARTITION decimalLiteral                             
    | REORGANIZE PARTITION uidList
        INTO LR_BRACKET
          partitionDefinitionList
        RR_BRACKET                                                         
    | EXCHANGE PARTITION uid WITH TABLE tableName
    | EXCHANGE PARTITION uid WITH TABLE tableName
     WITH VALIDATION
    | EXCHANGE PARTITION uid WITH TABLE tableName
      WITHOUT VALIDATION               
    | ANALYZE PARTITION partitionUid                             
    | CHECK PARTITION partitionUid                               
    | OPTIMIZE PARTITION partitionUid                            
    | REBUILD PARTITION partitionUid                             
    | REPAIR PARTITION partitionUid                              
    | REMOVE PARTITIONING                                           
    | UPGRADE PARTITIONING                                          
    ;
collateConfig
    : COLLATE collationName
    ;

opt_collateConfig
    : collateConfig
    |
    ;
partitionUid
    : uidList | ALL
    ;
renameFormat
    : TO | AS
    |
    ;
renameFormatValue
    : fullId
    ;

//    Drop statements
opt_ifExists
    : ifExists
    |
    ;
dropDatabase
    : DROP dbFormat opt_ifExists uid
    ;

dropEvent
    : DROP EVENT opt_ifExists fullId
    ;

dropIndex
    : DROP INDEX opt_intimeAction
      uid ON tableName
      optIndexLockAndAlgorithmAssigns
    ;
algType
    : DEFAULT | INPLACE | COPY
    ;
lockType
    : DEFAULT | NONE | SHARED | EXCLUSIVE
    ;
indexLockAssign
    : LOCK EQUAL_SYMBOL lockType
    | LOCK lockType
    ;
algorithmAssign
    : ALGORITHM   algType
    | ALGORITHM EQUAL_SYMBOL algType
    ;

dropLogfileGroup
    : DROP LOGFILE GROUP uid ENGINE EQUAL_SYMBOL engineName
    ;

dropProcedure
    : DROP PROCEDURE opt_ifExists fullId
    ;

dropFunction
    : DROP FUNCTION opt_ifExists fullId
    ;

dropServer
    : DROP SERVER opt_ifExists uid
    ;

dropTable
    : DROP opt_TEMPORARY TABLE opt_ifExists
      tables opt_dropType
    ;
opt_dropType
    : RESTRICT | CASCADE
    |
    ;

dropTablespace
    : DROP TABLESPACE uid
    | DROP TABLESPACE uid ENGINE opt_MULT_ASSIGN engineName
    ;

dropTrigger
    : DROP TRIGGER opt_ifExists fullId
    ;

dropView
    : DROP VIEW opt_ifExists
     fullIds opt_dropType
    ;
fullIds
    : fullId
    | fullId COMMA fullIds
    ;

//    Other DDL statements

renameTable
    : RENAME TABLE
    renameTableClauses
    ;
renameTableClauses
    : renameTableClause
    | renameTableClause COMMA renameTableClauses
    ;

renameTableClause
    : tableName TO tableName
    ;

truncateTable
    : TRUNCATE tableName
    | TRUNCATE TABLE tableName
    ;


// Data Manipulation Language

//    Primary DML Statements


callStatement
    : CALL fullId
      | CALL fullId
        LR_BRACKET constants RR_BRACKET
      | CALL fullId
        LR_BRACKET RR_BRACKET
    ;

deleteStatement
    : singleDeleteStatement | multipleDeleteStatement
    ;

doStatement
    : DO expressions
    ;

handlerStatement
    : handlerOpenStatement
    | handlerReadIndexStatement
    | handlerReadStatement
    | handlerCloseStatement
    ;

insertStatement
    : INSERT
      opt_insertPriority
      opt_IGNORE opt_INTO tableName
      opt_insertStatement_partition
      insertStatement_value
      |
      INSERT
      opt_insertPriority
      opt_IGNORE opt_INTO tableName
      opt_insertStatement_partition
      insertStatement_value
      ON DUPLICATE KEY UPDATE updatedElements
      
    ;
insertStatement_value
    : opt_uidList insertStatementValue
        | SET updatedElements
        ;
updatedElements
    : updatedElement
    | updatedElement COMMA updatedElements
    ;
opt_insertStatement_partition
    : PARTITION LR_BRACKET uidList RR_BRACKET 
    | PARTITION LR_BRACKET RR_BRACKET 
    |
    ;
opt_IGNORE
    : IGNORE
    |
    ;
opt_INTO
    : INTO
    |
    ;
opt_insertPriority
    : LOW_PRIORITY | DELAYED | HIGH_PRIORITY
    |
    ;
loadDataStatement
    : LOAD DATA
      opt_loadPriority
      opt_LOCAL INFILE STRING_LITERAL
      opt_violation
      INTO TABLE tableName
      opt_partitonValueList
      opt_characterSet
      opt_load_fieldFormat
      opt_load_lines
      opt_loadIgnore
      opt_assignmentFieldsWithB
      opt_setUpdatedElements
    ;
opt_load_fieldFormat
    :  fieldsFormat
        selectFieldsIntos
        |
        ;
opt_load_lines
    : LINES
          selectLinesIntos
          |
          ;
opt_assignmentFieldsWithB
    :  LR_BRACKET assignmentFields RR_BRACKET 
    |
    ;
opt_loadIgnore
    : IGNORE decimalLiteral linesFormat
    |
    ;
assignmentFields
    : assignmentField
    | assignmentField COMMA assignmentFields
    ;
linesFormat
    : LINES | ROWS
    ;
selectFieldsIntos
    : selectFieldsInto
    | selectFieldsInto selectFieldsIntos
    ;
selectLinesIntos
    : selectLinesInto
    | selectLinesInto selectLinesIntos
    ;
fieldsFormat
    : FIELDS | COLUMNS
    ;
characterSet
    : CHARACTER SET charsetName
    ;
opt_characterSet
    : characterSet
    |
    ;
partitonValueList
    : PARTITION LR_BRACKET uidList RR_BRACKET
    ;
opt_partitonValueList
    : partitonValueList
    |
    ;
opt_violation
    : REPLACE | IGNORE
    |
    ;
opt_LOCAL
    : LOCAL
    |
    ;
opt_loadPriority
    : LOW_PRIORITY | CONCURRENT
    |
    ;
loadXmlStatement
    : LOAD XML
      opt_loadPriority
      opt_LOCAL INFILE STRING_LITERAL
      opt_violation
      INTO TABLE tableName
      opt_characterSet
      opt_loadxmlrows
      opt_loadIgnore
      opt_assignmentFieldsWithB
      opt_setUpdatedElements
    ;
opt_loadxmlrows
    : ROWS IDENTIFIED BY LESS_SYMBOL STRING_LITERAL GREATER_SYMBOL
    |
    ;
opt_setUpdatedElements
    : SET updatedElements
    |
    ;
replaceStatement
    : REPLACE opt_replacePriority
      opt_INTO tableName
      opt_partitonValueList
      insertStatement_value
    ;
opt_replacePriority
    : LOW_PRIORITY | DELAYED
    |
    ;
opt_lockClause
    : lockClause
    |
    ;
selectStatement
    : querySpecification opt_lockClause                               
    | queryExpression opt_lockClause
    | queryExpressionNointo opt_lockClause
    | querySpecificationNointo unionStatements UNION unionType querySpecification opt_orderByClause opt_limitClause opt_lockClause
    | querySpecificationNointo unionStatements UNION unionType queryExpression opt_orderByClause opt_limitClause opt_lockClause
    | querySpecificationNointo unionStatements opt_orderByClause opt_limitClause opt_lockClause 
    | queryExpressionNointo unionParenthesises opt_orderByClause opt_limitClause opt_lockClause
    | queryExpressionNointo unionParenthesises UNION unionType queryExpression opt_orderByClause opt_limitClause opt_lockClause                                                                   
    ;
unionParenthesises
    : unionParenthesies
    | unionParenthesis unionParenthesises
    ;
opt_orderByClause
    : orderByClause
    |
    ;
opt_limitClause
    : limitClause
    |
    ;
unionStatements
    : unionStatement
    | unionStatement unionStatements
    ;
unionType
    : ALL | DISTINCT
    |
    ;
updateStatement
    : singleUpdateStatement | multipleUpdateStatement
    ;

// details

insertStatementValue
    : selectStatement
    | insertValueKeyword insertValues
    ;
insertValues
    : LR_BRACKET opt_expressionsWithDefaults RR_BRACKET
    | LR_BRACKET opt_expressionsWithDefaults RR_BRACKET COMMA insertValues
    ;
insertValueKeyword
    : VALUES | VALUE
    ;
opt_expressionsWithDefaults
    : expressionsWithDefaults
    |
    ;
updatedElement
    : fullColumnName EQUAL_SYMBOL expression
    | fullColumnName EQUAL_SYMBOL DEFAULT
    ;

assignmentField
    : uid | LOCAL_ID
    ;

lockClause
    : FOR UPDATE | LOCK IN SHARE MODE
    ;

//    Detailed DML Statements

singleDeleteStatement
    : DELETE opt_LOW_PRIORITY opt_QUICK opt_IGNORE
    FROM tableName
      opt_partitonValueList
      opt_whereClause
      opt_orderByClause opt_limitClause
    ;
opt_QUICK
    : QUICK
    |
    ;
opt_whereClause
    : WHERE expression
    |
    ;
opt_LOW_PRIORITY
    : LOW_PRIORITY
    |
    ;
multipleDeleteStatement
    : DELETE opt_LOW_PRIORITY opt_QUICK opt_IGNORE
      tableWithOptStars
    FROM tableSources
      opt_whereClause
      | DELETE opt_LOW_PRIORITY opt_QUICK opt_IGNORE
      FROM
            tableWithOptStars
            USING tableSources
      opt_whereClause
    ;
tableWithOptStars
    : tableWithOptStar
    | tableWithOptStar COMMA tableWithOptStars
    ;
tableWithOptStar
    : tableName
    | tableName DOT STAR
    ;
handlerOpenStatement
    : HANDLER tableName OPEN
    | HANDLER tableName OPEN opt_AS uid
    ;

handlerReadIndexStatement
    : HANDLER tableName READ uid
      readIndexMoveOrder
      opt_whereClause opt_limitClause
      |
      HANDLER tableName READ uid
     comparisonOperator LR_BRACKET constants RR_BRACKET
      opt_whereClause opt_limitClause
    ;
readIndexMoveOrder
    : FIRST | NEXT | PREV | LAST
    ;
handlerReadStatement
    : HANDLER tableName READ NEXT
      opt_whereClause opt_limitClause
      |
      HANDLER tableName READ FIRST
      opt_whereClause opt_limitClause
    ;

handlerCloseStatement
    : HANDLER tableName CLOSE
    ;

singleUpdateStatement
    : UPDATE opt_LOW_PRIORITY opt_IGNORE tableName opt_asUid
      SET updatedElements
      opt_whereClause opt_orderByClause opt_limitClause
    ;
opt_asUid
    : AS uid
    | uid
    |
    ;
multipleUpdateStatement
    : UPDATE opt_LOW_PRIORITY opt_IGNORE tableSources
      SET updatedElements
      opt_whereClause
    ;

// details

orderByClause
    : ORDER BY orderByExprList
    ;
orderByExprList
    : orderByExpression
    | orderByExpression COMMA orderByExprList
    ;
orderByExpression
    : expression 
    | expression ASC
    | expression DESC
    ;
tableSources
    : tableSource
    | tableSource COMMA tableSources
    ;
tableSource
    : tableSourceItem opt_joinParts                                     
    | LR_BRACKET tableSourceItem opt_joinParts RR_BRACKET                       
    ;
joinParts
    : joinPart
    | joinPart joinParts
    ;
opt_joinParts
    : joinParts
    |
    ;
tableSourceItem
    : tableName
      partitonValueList opt_asUid
      opt_indexHints                            
    | tableName
      opt_asUid
      opt_indexHints                            
    | selectStatement opt_AS uid                                             
    | LR_BRACKET tableSources RR_BRACKET                                          
    ;
indexHints
    : indexHint
    | indexHint COMMA indexHints
    ;
opt_indexHints
    : indexHints
    |
    ;
indexHint
    : indexHintAction indexHintKeyFormat LR_BRACKET uidList RR_BRACKET
    | indexHintAction indexHintKeyFormat FOR indexHintType LR_BRACKET uidList RR_BRACKET
    ;
indexHintAction
    : USE | IGNORE | FORCE
    ;
indexHintKeyFormat
    : INDEX | KEY
    ;
indexHintType
    : JOIN | ORDER BY | GROUP BY
    ;

joinPart
    : opt_innerOrCross JOIN tableSourceItem innerJoinBody                                                       
    |  STRAIGHT_JOIN tableSourceItem            
    |  STRAIGHT_JOIN tableSourceItem ON expression               
    | leftOrRight opt_OUTER JOIN tableSourceItem innerJoinBody                                            
    | NATURAL JOIN tableSourceItem    
    | NATURAL leftOrRight opt_OUTER JOIN tableSourceItem      
    ;
innerJoinBody
    : ON expression
    | USING LR_BRACKET uidList RR_BRACKET
    |
    ;
opt_OUTER
    : OUTER
    |
    ;
leftOrRight
    : LEFT | RIGHT
    ;
opt_innerOrCross
    : INNER | CROSS
    |
    ;
//    Select Statement's Details

queryExpression
    : LR_BRACKET querySpecification RR_BRACKET
    | LR_BRACKET queryExpression RR_BRACKET
    ;

queryExpressionNointo
    : LR_BRACKET querySpecificationNointo RR_BRACKET
    | LR_BRACKET queryExpressionNointo RR_BRACKET
    ;

querySpecification
    : SELECT opt_selectSpecs selectElements selectIntoExpression
      opt_fromClause opt_orderByClause opt_limitClause
    | querySpecificationNointo
    | SELECT opt_selectSpecs selectElements
    opt_fromClause opt_orderByClause opt_limitClause selectIntoExpression
    ;
opt_fromClause
    : fromClause
    |
    ;
selectSpecs
    : selectSpec
    | selectSpec selectSpecs
    ;
opt_selectSpecs
    : selectSpecs
    |
    ;
querySpecificationNointo
    : SELECT opt_selectSpecs selectElements
      opt_fromClause opt_orderByClause opt_limitClause
    ;

unionParenthesis
    : UNION unionType queryExpressionNointo
    ;

unionStatement
    : UNION unionType querySpecificationNointo
    | UNION unionType queryExpressionNointo
    ;

// details

selectSpec
    : ALL 
    | DISTINCT 
    | DISTINCTROW
    | HIGH_PRIORITY 
    | STRAIGHT_JOIN 
    | SQL_SMALL_RESULT
    | SQL_BIG_RESULT 
    | SQL_BUFFER_RESULT
    | SQL_CACHE 
    | SQL_NO_CACHE
    | SQL_CALC_FOUND_ROWS
    ;

selectElements
    : selectElement opt_selectElementPart
    | STAR opt_selectElementPart
    ;
opt_selectElementPart
    : selectElementPart
    |
    ;
selectElementPart
    : COMMA selectElement
    | COMMA selectElement selectElementPart
    ;

selectElement
    : fullId DOT STAR                                              
    | expression                                       
    | expression uid                                   
    | expression AS uid               
    ;

selectIntoExpression
    : INTO assignmentFields                  
    | INTO DUMPFILE STRING_LITERAL                                  
    | INTO OUTFILE STRING_LITERAL
        opt_characterSet
        opt_selectIntoExpressionFormat
        opt_selectIntoExpressionLines                                                             
    ;
opt_selectIntoExpressionFormat
    : fieldsFormat
          selectFieldsIntos
          |
          ;
opt_selectIntoExpressionLines
    : LINES selectLinesIntos
   |
    ;

selectFieldsInto
    : TERMINATED BY STRING_LITERAL
    | opt_OPTIONALLY ENCLOSED BY STRING_LITERAL
    | ESCAPED BY STRING_LITERAL
    ;
opt_OPTIONALLY
    : OPTIONALLY
    |
    ;
selectLinesInto
    : STARTING BY STRING_LITERAL
    | TERMINATED BY STRING_LITERAL
    ;

fromClause
    : FROM tableSources
      opt_whereClause
      opt_havingClause
    | FROM tableSources
      opt_whereClause
        GROUP BY
        groupByItems
        opt_withRollup
      opt_havingClause
    ;
opt_havingClause
    : HAVING expression
    |
    ;
groupByItems
    : groupByItem
    | groupByItem COMMA groupByItems
    ;
opt_withRollup
    : WITH ROLLUP
    |
    ;
groupByItem
    : expression ASC
    | expression DESC
    | expression 
    ;

limitClause
    : LIMIT limitClauseAtom COMMA limitClauseAtom
    | LIMIT limitClauseAtom OFFSET limitClauseAtom
    | LIMIT limitClauseAtom
    ;

limitClauseAtom
	: decimalLiteral | mysqlVariable | simpleId
	;


// Transaction's Statements

startTransaction
    : START TRANSACTION opt_transactionModes
    ;
transactionModes
    : transactionMode
    | transactionMode COMMA transactionModes
    ;
opt_transactionModes
    : transactionModes
    | 
    ;
beginWork
    : BEGIN WORK
    | BEGIN
    ;

commitWork
    : COMMIT opt_WORK
      | COMMIT opt_WORK AND opt_NO CHAIN
      | COMMIT opt_WORK opt_NO RELEASE
    ;
opt_NO
    : NO
    |
    ;
opt_WORK
    : WORK
    |
    ;
rollbackWork
    : ROLLBACK opt_WORK
    | ROLLBACK opt_WORK AND opt_NO CHAIN
    | ROLLBACK opt_WORK opt_NO RELEASE
    ;

savepointStatement
    : SAVEPOINT uid
    ;

rollbackStatement
    : ROLLBACK opt_WORK TO opt_SAVEPOINT uid
    ;
opt_SAVEPOINT
    : SAVEPOINT
    |
    ;
releaseStatement
    : RELEASE SAVEPOINT uid
    ;

lockTables
    : LOCK TABLES lockTableElements
    ;
lockTableElements
    : lockTableElement
    | lockTableElement COMMA lockTableElements
    ;
unlockTables
    : UNLOCK TABLES
    ;


// details

setAutocommitStatement
    : SET AUTOCOMMIT EQUAL_SYMBOL boolNumValue
    ;

setTransactionStatement
    : SET opt_transactionScope TRANSACTION
      transactionOptions
    ;
opt_transactionScope
    : GLOBAL | SESSION
    |
    ;
transactionOptions
    : transactionOption
    | transactionOption COMMA transactionOptions
    ;
transactionMode
    : WITH CONSISTENT SNAPSHOT
    | READ WRITE
    | READ ONLY
    ;

lockTableElement
    : tableName opt_asUid lockAction
    ;

lockAction
    : READ opt_LOCAL | opt_LOW_PRIORITY WRITE
    ;

transactionOption
    : ISOLATION LEVEL transactionLevel
    | READ WRITE
    | READ ONLY
    ;

transactionLevel
    : REPEATABLE READ
    | READ COMMITTED
    | READ UNCOMMITTED
    | SERIALIZABLE
    ;


// Replication's Statements

//    Base Replication---------

changeMaster
    : CHANGE MASTER TO
      masterOptions opt_channelOption
    ;
opt_channelOption
    : channelOption
    |
    ;
masterOptions
    : masterOption
    | masterOption COMMA masterOptions
    ;

changeReplicationFilter
    : CHANGE REPLICATION FILTER
      replicationFilters
    ;
replicationFilters
    : replicationFilter
    | replicationFilter COMMA replicationFilters
    ;

purgeBinaryLogs
    : PURGE purgeFormat LOGS  TO STRING_LITERAL
       | PURGE purgeFormat LOGS BEFORE STRING_LITERAL
    ;
purgeFormat
    : BINARY | MASTER
    ;

resetMaster
    : RESET MASTER
    ;

resetSlave
    : RESET SLAVE opt_ALL opt_channelOption
    ;
opt_ALL
    : ALL
    |
    ;
startSlave
    : START SLAVE opt_threadTypes
      UNTIL untilOption
      opt_connectionOptions opt_channelOption
      | START SLAVE opt_threadTypes
      opt_connectionOptions opt_channelOption
    ;
connectionOptions
    : connectionOption
    | connectionOption connectionOptions
    ;
opt_connectionOptions
    : connectionOptions
    |
    ;
threadTypes
    : threadType
    | threadType COMMA threadTypes
    ;
opt_threadTypes
    : threadTypes
    |
    ;
stopSlave
    : STOP SLAVE opt_threadTypes
    ;

startGroupReplication
    : START GROUP_REPLICATION
    ;

stopGroupReplication
    : STOP GROUP_REPLICATION
    ;

// details

masterOption
    : stringMasterOption EQUAL_SYMBOL STRING_LITERAL                         
    | decimalMasterOption EQUAL_SYMBOL decimalLiteral                        
    | boolMasterOption EQUAL_SYMBOL boolNumValue                    
    | MASTER_HEARTBEAT_PERIOD EQUAL_SYMBOL REAL_LITERAL                      
    | IGNORE_SERVER_IDS EQUAL_SYMBOL LR_BRACKET uidList RR_BRACKET       
    | IGNORE_SERVER_IDS EQUAL_SYMBOL LR_BRACKET  RR_BRACKET               
    ;

stringMasterOption
    : MASTER_BIND | MASTER_HOST | MASTER_USER | MASTER_PASSWORD
    | MASTER_LOG_FILE | RELAY_LOG_FILE | MASTER_SSL_CA
    | MASTER_SSL_CAPATH | MASTER_SSL_CERT | MASTER_SSL_CRL
    | MASTER_SSL_CRLPATH | MASTER_SSL_KEY | MASTER_SSL_CIPHER
    | MASTER_TLS_VERSION
    ;
decimalMasterOption
    : MASTER_PORT | MASTER_CONNECT_RETRY | MASTER_RETRY_COUNT
    | MASTER_DELAY | MASTER_LOG_POS | RELAY_LOG_POS
    ;

boolMasterOption
    : MASTER_AUTO_POSITION | MASTER_SSL
    | MASTER_SSL_VERIFY_SERVER_CERT
    ;

channelOption
    : FOR CHANNEL STRING_LITERAL
    ;

replicationFilter
    : REPLICATE_DO_DB EQUAL_SYMBOL LR_BRACKET uidList RR_BRACKET                          
    | REPLICATE_IGNORE_DB EQUAL_SYMBOL LR_BRACKET uidList RR_BRACKET                      
    | REPLICATE_DO_TABLE EQUAL_SYMBOL LR_BRACKET tables RR_BRACKET                         
    | REPLICATE_IGNORE_TABLE EQUAL_SYMBOL LR_BRACKET tables RR_BRACKET                     
    | REPLICATE_WILD_DO_TABLE EQUAL_SYMBOL LR_BRACKET simpleStrings RR_BRACKET            
    | REPLICATE_WILD_IGNORE_TABLE
       EQUAL_SYMBOL LR_BRACKET simpleStrings RR_BRACKET                                    
    | REPLICATE_REWRITE_DB EQUAL_SYMBOL
      LR_BRACKET tablePairs RR_BRACKET                            
    ;
tablePairs
    : tablePair
    | tablePair COMMA tablePairs
    ;
tablePair
    : LR_BRACKET tableName COMMA tableName RR_BRACKET
    ;

threadType
    : IO_THREAD | SQL_THREAD
    ;

untilOption
    : SQL_BEFORE_GTIDS EQUAL_SYMBOL gtuidSet   
    | SQL_AFTER_GTIDS EQUAL_SYMBOL gtuidSet                                                  
    | MASTER_LOG_FILE EQUAL_SYMBOL STRING_LITERAL
      COMMA MASTER_LOG_POS EQUAL_SYMBOL decimalLiteral                         
    | RELAY_LOG_FILE EQUAL_SYMBOL STRING_LITERAL
      COMMA RELAY_LOG_POS EQUAL_SYMBOL decimalLiteral                          
    | SQL_AFTER_MTS_GAPS                                            
    ;

connectionOption
    : USER EQUAL_SYMBOL STRING_LITERAL                            
    | PASSWORD EQUAL_SYMBOL STRING_LITERAL                   
    | DEFAULT_AUTH EQUAL_SYMBOL STRING_LITERAL                 
    | PLUGIN_DIR EQUAL_SYMBOL STRING_LITERAL                 
    ;

gtuidSet
    : uuidSets
    | STRING_LITERAL
    ;
uuidSets
    : uuidSet
    | uuidSet COMMA uuidSets
    ;

//    XA Transactions

xaStartTransaction
    : XA xaStart xid xaAction
    ;
xaStart
    : START | BEGIN
    ;
xaAction
    : JOIN | RESUME
    |
    ;
xaEndTransaction
    : XA END xid 
    | XA END xid SUSPEND
    | XA END xid SUSPEND FOR MIGRATE
    ;

xaPrepareStatement
    : XA PREPARE xid
    ;

xaCommitWork
    : XA COMMIT xid
    | XA COMMIT xid ONE PHASE
    ;

xaRollbackWork
    : XA ROLLBACK xid
    ;

xaRecoverWork
    : XA RECOVER
    | XA RECOVER CONVERT xid
    ;


// Prepared Statements

prepareStatement
    : PREPARE uid FROM STRING_LITERAL
    | PREPARE uid FROM LOCAL_ID
    ;

executeStatement
    : EXECUTE uid
    | EXECUTE uid USING userVariables
    ;

deallocatePrepare
    : DEALLOCATE PREPARE uid
    | DROP PREPARE uid
    ;


// Compound Statements

routineBody
    : blockStatement | sqlStatement
    ;

// details

blockStatement
    : opt_StmtLabel BEGIN
        opt_declareVariableWithSEMI
        opt_declareConditionWithSEMI
        opt_declareCursorWithSEMI
        opt_declareHandlerWithSEMI
        opt_procedureSqlStatements
      END opt_uid
      | opt_StmtLabel BEGIN END opt_uid
    ;
declareVariableWithSEMIs
    : declareVariable SEMI declareVariableWithSEMIs
    | declareVariable SEMI
    ;
opt_declareVariableWithSEMI
    : declareVariableWithSEMIs
    |
    ;
declareConditionWithSEMIs
    :  declareCondition SEMI declareConditionWithSEMIs
    | declareCondition SEMI 
    ;
opt_declareConditionWithSEMI
    : declareConditionWithSEMIs
    |
    ;
declareCursorWithSEMIs
    : declareCursor SEMI
    | declareCursor SEMI declareCursorWithSEMIs
    ;
opt_declareCursorWithSEMI
    : declareCursorWithSEMIs
    |
    ;
declareHandlerWithSEMIs
    : declareHandler SEMI
    | declareHandler SEMI declareHandlerWithSEMIs
    ;
opt_declareHandlerWithSEMI
    : declareHandlerWithSEMIs
    |
    ;
procedureSqlStatements
    : procedureSqlStatement
    | procedureSqlStatement procedureSqlStatements
    ;
opt_procedureSqlStatements
    : procedureSqlStatements
    |
    ;
opt_StmtLabel
    : uid COLON_SYMB
    |
    ;
caseStatement
    : CASE caseExpr caseAlternatives
      ELSE procedureSqlStatements
      END CASE
      | CASE caseExpr caseAlternatives
      END CASE
    ;
caseExpr
    : expression
    |
    ;
caseAlternatives
    : caseAlternative
    | caseAlternative caseAlternatives
    ;
ifStatement
    : IF expression
      THEN procedureSqlStatements
      opt_elifAlternatives
      ELSE procedureSqlStatements
      END IF
      | IF expression
      THEN procedureSqlStatements
      opt_elifAlternatives
      END IF
    ;
elifAlternatives
    : elifAlternative
    | elifAlternative elifAlternatives
    ;
opt_elifAlternatives
    : elifAlternatives
    |
    ;
iterateStatement
    : ITERATE uid
    ;

leaveStatement
    : LEAVE uid
    ;

loopStatement
    : opt_StmtLabel
      LOOP procedureSqlStatements
      END LOOP opt_uid
    ;

repeatStatement
    : opt_StmtLabel
      REPEAT procedureSqlStatements
      UNTIL expression
      END REPEAT opt_uid
    ;

returnStatement
    : RETURN expression
    ;

whileStatement
    : opt_StmtLabel
      WHILE expression
      DO procedureSqlStatements
      END WHILE opt_uid
    ;

cursorStatement
    : CLOSE uid                                                     
    | FETCH uid INTO uidList        
    | FETCH FROM uid INTO uidList
    | FETCH NEXT FROM uid INTO uidList                   
    | OPEN uid                                                      
    ;

// details

declareVariable
    : DECLARE uidList dataType DEFAULT expression
    | DECLARE uidList dataType
    ;

declareCondition
    : DECLARE uid CONDITION FOR SQLSTATE opt_VALUE STRING_LITERAL
      | DECLARE uid CONDITION FOR decimalLiteral
    ;

declareCursor
    : DECLARE uid CURSOR FOR selectStatement
    ;

declareHandler
    : DECLARE handlerAction
      HANDLER FOR
      handlerConditionValues
      routineBody
    ;
handlerConditionValues
    : handlerConditionValue
    | handlerConditionValue handlerConditionValues
    ;
handlerAction
    : CONTINUE | EXIT | UNDO
    ;
handlerConditionValue
    : decimalLiteral                                                
    | SQLSTATE opt_VALUE STRING_LITERAL                                
    | uid                                                           
    | SQLWARNING                                                    
    | NOT FOUND                                                     
    | SQLEXCEPTION                                                  
    ;
opt_VALUE
    : VALUE
    |
    ;
procedureSqlStatement
    : sqlStatement SEMI
    | compoundStatement SEMI
    ;

caseAlternative
    : WHEN constant THEN procedureSqlStatements
    | WHEN expression THEN procedureSqlStatements
    ;

elifAlternative
    : ELSEIF expression
      THEN procedureSqlStatements
    ;

// Administration Statements

//    Account management statements

alterUser
    : ALTER USER
      userSpecifications                    
    | ALTER USER opt_ifExists
        userAuthOptions
          REQUIRE
          user_tlsOpt
        opt_withUserResourceOpt
        opt_userPwdOption  
    | ALTER USER opt_ifExists
        userAuthOptions
        opt_withUserResourceOpt
        opt_userPwdOption                    
    ;
tlsOptions
    : tlsOption opt_AND tlsOptions
    | tlsOption
    ;
user_tlsOpt
    : NONE | tlsOptions
    ;
opt_userPwdOption
    : userPasswordOption opt_userPwdOption
    | userLockOption opt_userPwdOption
    | 
    ;
opt_withUserResourceOpt
    : WITH userResourceOptions
    |
    ;
opt_AND
    : AND
    |
    ;
userSpecifications
    : userSpecification
    | userSpecification COMMA userSpecifications
    ;
userAuthOptions
    : userAuthOption
    | userAuthOption COMMA userAuthOptions
    ;
createUser
    : CREATE USER userAuthOptions              
    | CREATE USER opt_ifNotExists
        userAuthOptions
        opt_withUserResourceOpt
        opt_userPwdOption 
    | CREATE USER opt_ifNotExists
        userAuthOptions
          REQUIRE
          user_tlsOpt
        opt_withUserResourceOpt
        opt_userPwdOption                      
    ;
userResourceOptions
    : userResourceOption
    | userResourceOption userResourceOptions
    ;
dropUser
    : DROP USER opt_ifExists userNames
    ;
userNames
    : userName COMMA userNames
    | userName
    ;
grantStatement
    : GRANT privelegeClauses
      ON
      privilegeObject
      privilegeLevel
      TO userAuthOptions
          REQUIRE
          user_tlsOpt
      opt_withGrantOptions
    | GRANT privelegeClauses
      ON
      privilegeObject
      privilegeLevel
      TO userAuthOptions
      opt_withGrantOptions
    ;
grantOptions
    : GRANT OPTION  grantOptions
    | userResourceOption grantOptions
    | 
    ;
opt_withGrantOptions
    : WITH grantOptions
    |
    ;
privilegeObject
    : TABLE | FUNCTION | PROCEDURE
    |
    ;
privelegeClauses
    : privelegeClause
    | privelegeClause COMMA privelegeClauses
    ;
grantProxy
    : GRANT PROXY ON userName
      TO userNames
      WITH GRANT OPTION
    | GRANT PROXY ON userName
      TO userNames
    ;

renameUser
    : RENAME USER renameUserClauses
    ;
renameUserClauses
    : renameUserClause
    | renameUserClause COMMA renameUserClauses
    ;
revokeStatement
    : REVOKE privelegeClauses
      ON
      privilegeObject
      privilegeLevel
      FROM userNames                                 
    | REVOKE ALL opt_PRIVILEGES COMMA GRANT OPTION
      FROM userNames                                 
    ;
opt_PRIVILEGES
    : PRIVILEGES
    |
    ;
revokeProxy
    : REVOKE PROXY ON userName
      FROM userNames
    ;

setPasswordStatement
    : SET PASSWORD opt_forUser EQUAL_SYMBOL setPasswordValue
    ;
setPasswordValue
    : passwordFunctionClause | STRING_LITERAL
    ;
opt_forUser
    : FOR userName
    |
    ;
// details

userSpecification
    : userName userPasswordOption
    ;

userAuthOption
    : userName IDENTIFIED BY PASSWORD STRING_LITERAL        
    | userName
      IDENTIFIED WITH authPlugin BY STRING_LITERAL
    | userName
      IDENTIFIED BY STRING_LITERAL               
    | userName
      IDENTIFIED WITH authPlugin
    | userName
      IDENTIFIED WITH authPlugin
      AS STRING_LITERAL                                         
    | userName                                                     
    ;

tlsOption
    : SSL
    | X509
    | CIPHER STRING_LITERAL
    | ISSUER STRING_LITERAL
    | SUBJECT STRING_LITERAL
    ;

userResourceOption
    : MAX_QUERIES_PER_HOUR decimalLiteral
    | MAX_UPDATES_PER_HOUR decimalLiteral
    | MAX_CONNECTIONS_PER_HOUR decimalLiteral
    | MAX_USER_CONNECTIONS decimalLiteral
    ;

userPasswordOption
    : PASSWORD EXPIRE
      | PASSWORD EXPIRE DEFAULT
      | PASSWORD EXPIRE NEVER
      | PASSWORD EXPIRE INTERVAL decimalLiteral DAY
    ;

userLockOption
    : ACCOUNT LOCK
    | ACCOUNT UNLOCK
    ;

privelegeClause
    : privilege opt_uidList
    ;

privilege
    : ALL opt_PRIVILEGES
    | ALTER opt_ROUTINE
    | CREATE privilegeCreateType
    | DELETE | DROP | DROP ROLE | EVENT | EXECUTE | FILE | GRANT OPTION
    | INDEX | INSERT | LOCK TABLES | PROCESS | PROXY
    | REFERENCES | RELOAD
    | REPLICATION SLAVE
    | REPLICATION CLIENT
    | SELECT
    | SHOW DATABASES
    | SHOW VIEW
    | SHUTDOWN | SUPER | TRIGGER | UPDATE | USAGE
    | AUDIT_ADMIN | BACKUP_ADMIN | BINLOG_ADMIN | BINLOG_ENCRYPTION_ADMIN | CLONE_ADMIN
    | CONNECTION_ADMIN | ENCRYPTION_KEY_ADMIN | FIREWALL_ADMIN | FIREWALL_USER | GROUP_REPLICATION_ADMIN
    | INNODB_REDO_LOG_ARCHIVE | NDB_STORED_USER | PERSIST_RO_VARIABLES_ADMIN | REPLICATION_APPLIER
    | REPLICATION_SLAVE_ADMIN | RESOURCE_GROUP_ADMIN | RESOURCE_GROUP_USER | ROLE_ADMIN
    | SESSION_VARIABLES_ADMIN | SET_USER_ID | SHOW_ROUTINE | SYSTEM_VARIABLES_ADMIN | TABLE_ENCRYPTION_ADMIN
    | VERSION_TOKEN_ADMIN | XA_RECOVER_ADMIN
    ;
privilegeCreateType
    : TEMPORARY TABLES | ROUTINE | VIEW | USER | TABLESPACE | ROLE
    |
    ;
opt_ROUTINE
    : ROUTINE
    |
    ;
privilegeLevel
    : STAR                                                           
    | STAR DOT STAR                                                   
    | uid DOT STAR                                                  
    | uid dottedId                                                  
    | uid                                                           
    ;

renameUserClause
    : userName TO userName
    ;

//    Table maintenance statements

analyzeTable
    : ANALYZE analyzeTable
       TABLE tables
    ;
actionOption
    : NO_WRITE_TO_BINLOG | LOCAL
    |
    ;
checkTable
    : CHECK TABLE tables checkTableOptions
    | CHECK TABLE tables
    ;
checkTableOptions
    : checkTableOption
    | checkTableOption checkTableOptions
    ;
checksumTable
    : CHECKSUM TABLE tables checksumActionType
    ;
checksumActionType
    : QUICK | EXTENDED
    |
    ;
optimizeTable
    : OPTIMIZE analyzeTable TABLE tables
    | OPTIMIZE analyzeTable TABLES tables
    ;

repairTable
    : REPAIR analyzeTable
      TABLE tables
      opt_QUICK opt_EXTENDED opt_USE_FRM
    ;
opt_USE_FRM
    : USE_FRM
    |
    ;
opt_EXTENDED
    : EXTENDED
    |
    ;
// details

checkTableOption
    : FOR UPGRADE | QUICK | FAST | MEDIUM | EXTENDED | CHANGED
    ;


//    Plugin and udf statements

createUdfunction
    : CREATE AGGREGATE FUNCTION uid
      RETURNS returnType
      SONAME STRING_LITERAL
      | CREATE  FUNCTION uid
      RETURNS returnType
      SONAME STRING_LITERAL
    ;
returnType
    : STRING | INTEGER | REAL | DECIMAL
    ;
installPlugin
    : INSTALL PLUGIN uid SONAME STRING_LITERAL
    ;

uninstallPlugin
    : UNINSTALL PLUGIN uid
    ;


//    Set and show statements

setStatement
    : SET setVariablesAssign               
    | SET charsetKeywords charsetValues         
    | SET NAMES charsetName opt_collateConfig
    | SET NAMES DEFAULT           
    | setPasswordStatement                                         
    | setTransactionStatement                                      
    | setAutocommitStatement                                        
    | SET setFullIdAssign                        
    ;
setFullIdAssign
    : fullId assign expression
    | fullId assign expression COMMA setFullIdAssign
    ;
setVariablesAssign
    : variableClause assign expression
    | variableClause assign expression COMMA setVariablesAssign
    ;
assign
    : EQUAL_SYMBOL | VAR_ASSIGN
    ;
showLogFormat
    : BINLOG | RELAYLOG
    ;
opt_showFilter
    : showFilter
    |
    ;
opt_FULL
    : FULL
    |
    ;
opt_showEventIn
    : IN STRING_LITERAL
    |
    ;
opt_showEventFrom
    : FROM decimalLiteral
    |
    ;
decimalLiteralPair
    : decimalLiteral COMMA decimalLiteral
    | decimalLiteral
    ;
databaseOrSchema
    : DATABASE | SCHEMA
    ;
columnOrFields
    : COLUMNS | FIELDS
    ;
fromOrIn
    : FROM | IN
    ;
showCreateType
    : EVENT | FUNCTION | PROCEDURE
          | TABLE | TRIGGER | VIEW
    ;
errorOrWarn
    : ERRORS | WARNINGS
    ;
optShowFromOrInId
    : fromOrIn uid
    |
    ;
showIndexType
    : INDEX | INDEXES | KEYS
    ;
showProfileTypes
    : showProfileType
    | showProfileType COMMA showProfileTypes
    ;
opt_showProfileFor
    : FOR QUERY decimalLiteral
    |
    ;
showStatement
    : SHOW purgeFormat LOGS                        
    | SHOW showLogFormat EVENTS opt_showEventIn opt_showEventFrom LIMIT decimalLiteralPair 
    | SHOW showLogFormat EVENTS opt_showEventIn opt_showEventFrom                                                         
    | SHOW showCommonEntity opt_showFilter                             
    | SHOW opt_FULL columnOrFields fromOrIn tableName fromOrIn uid opt_showFilter
    | SHOW opt_FULL columnOrFields fromOrIn tableName opt_showFilter                 
    | SHOW CREATE databaseOrSchema opt_ifNotExists uid                                              
    | SHOW CREATE showCreateType fullId                                                      
    | SHOW CREATE USER userName                                     
    | SHOW ENGINE engineName STATUS
    | SHOW ENGINE engineName  MUTEX        
    | SHOW showGlobalInfoClause                                    
    | SHOW errorOrWarn LIMIT decimalLiteralPair                                                         
    | SHOW COUNT LR_BRACKET STAR RR_BRACKET errorOrWarn        
    | SHOW showSchemaEntity optShowFromOrInId opt_showFilter                 
    | SHOW PROCEDURE CODE fullId
    | SHOW FUNCTION CODE fullId              
    | SHOW GRANTS
    | SHOW GRANTS FOR userName                                  
    | SHOW showIndexType fromOrIn tableName optShowFromOrInId opt_whereClause         
    | SHOW OPEN TABLES optShowFromOrInId opt_showFilter                                                   
    | SHOW PROFILE showProfileTypes opt_showProfileFor LIMIT decimalLiteralPair                                                      
    | SHOW SLAVE STATUS FOR CHANNEL STRING_LITERAL
    | SHOW SLAVE STATUS              
    ;

// details

variableClause
    : LOCAL_ID 
    | GLOBAL_ID
    | uid
    | AT_SIGN AT_SIGN variableIdScope uid
    | GLOBAL uid
    | SESSION uid
    | LOCAL uid
    ;
variableIdScope
    : GLOBAL | SESSION | LOCAL
    ;
showCommonEntity
    : CHARACTER SET | COLLATION | DATABASES | SCHEMAS
    | FUNCTION STATUS | PROCEDURE STATUS
    | opt_transactionScope STATUS
    | opt_transactionScope VARIABLES
    ;

showFilter
    : LIKE STRING_LITERAL
    | WHERE expression
    ;

showGlobalInfoClause
    : opt_STORAGE ENGINES | MASTER STATUS | PLUGINS
    | PRIVILEGES | opt_FULL PROCESSLIST | PROFILES
    | SLAVE HOSTS | AUTHORS | CONTRIBUTORS
    ;

showSchemaEntity
    : EVENTS | TABLE STATUS | opt_FULL TABLES | TRIGGERS
    ;

showProfileType
    : ALL | BLOCK IO | CONTEXT SWITCHES | CPU | IPC | MEMORY
    | PAGE FAULTS | SOURCE | SWAPS
    ;


//    Other administrative statements

binlogStatement
    : BINLOG STRING_LITERAL
    ;

cacheIndexStatement
    : CACHE INDEX tableIndexesList IN uid
    | CACHE INDEX tableIndexesList PARTITION LR_BRACKET partitionUid RR_BRACKET IN uid
    ;
tableIndexesList
    : tableIndexes
    | tableIndexes COMMA tableIndexesList
    ;
flushStatement
    : FLUSH actionOption flushOptions
    ;
flushOptions
    : flushOption
    | flushOption COMMA flushOptions
    ;
killStatement
    : KILL QUERY decimalLiterals
    | KILL decimalLiterals
    | KILL CONNECTION decimalLiterals
    ;
decimalLiterals
    : decimalLiteral
    | decimalLiteral decimalLiterals
    ;
loadIndexIntoCache
    : LOAD INDEX INTO CACHE loadedTableIndexesList
    ;
loadedTableIndexesList
    : loadedTableIndexes
    | loadedTableIndexes COMMA loadedTableIndexesList
    ;
// remark reset (maser | slave) describe in replication's
//  statements section
resetStatement
    : RESET QUERY CACHE
    ;

shutdownStatement
    : SHUTDOWN
    ;

// details

tableIndexes
    : tableName
    | tableName opt_tableConstraintFormat LR_BRACKET uidList RR_BRACKET
    ;

flushOption
    : DES_KEY_FILE 
    | HOSTS
    | flushLogType LOGS
    | OPTIMIZER_COSTS | PRIVILEGES | QUERY CACHE | STATUS
    | USER_RESOURCES | TABLES | TABLES WITH READ LOCK                                                                
    | RELAY LOGS opt_channelOption                                     
    | TABLES tables opt_flushTableOption                              
    ;
opt_flushTableOption
    : flushTableOption
    |
    ;
flushLogType
    : BINARY | ENGINE | ERROR | GENERAL | RELAY | SLOW
    |
    ;
flushTableOption
    : WITH READ LOCK
    | FOR EXPORT
    ;

loadedTableIndexes
    : tableName opt_loadedTablePartition opt_loadedTableFormat IGNORE LEAVES
    | tableName opt_loadedTablePartition opt_loadedTableFormat
    ;

opt_loadedTablePartition
    : PARTITION LR_BRACKET ALL RR_BRACKET
    | PARTITION LR_BRACKET uidList RR_BRACKET
    |
    ;
opt_loadedTableFormat
    : opt_tableConstraintFormat LR_BRACKET uidList RR_BRACKET
    |
    ;
// Utility Statements


simpleDescribeStatement
    : descKeyword tableName
    |  descKeyword tableName uid
    ;
descKeyword
    : EXPLAIN | DESCRIBE | DESC
    ;
fullDescribeStatement
    : descKeyword fullDescFormat EQUAL_SYMBOL fullDescFormatValue describeObjectClause
    | descKeyword describeObjectClause
    ;
fullDescFormat
    : EXTENDED | PARTITIONS | FORMAT 
    ;
fullDescFormatValue
    : TRADITIONAL | JSON
    ;
helpStatement
    : HELP STRING_LITERAL
    ;

useStatement
    : USE uid
    ;

signalStatement
    : SIGNAL signValue
        opt_setSignalConditionInformations
    ;
signValue
    : SQLSTATE opt_VALUE stringLiteral
    | ID | REVERSE_QUOTE_ID
    ;
opt_signValue
    : signValue
    |
    ;
signalConditionInformations
    : signalConditionInformation
    | signalConditionInformation COMMA signalConditionInformations
    ;
opt_setSignalConditionInformations
    : SET signalConditionInformations
    |
    ;
resignalStatement
    : RESIGNAL opt_signValue
        opt_setSignalConditionInformations
    ;

signalConditionInformation
    : signalConditionLeft EQUAL_SYMBOL signalConditionRight
    ;
signalConditionLeft
    : CLASS_ORIGIN
          | SUBCLASS_ORIGIN
          | MESSAGE_TEXT
          | MYSQL_ERRNO
          | CONSTRAINT_CATALOG
          | CONSTRAINT_SCHEMA
          | CONSTRAINT_NAME
          | CATALOG_NAME
          | SCHEMA_NAME
          | TABLE_NAME
          | COLUMN_NAME
          | CURSOR_NAME
        ;
signalConditionRight
    : stringLiteral | DECIMAL_LITERAL | mysqlVariable | simpleId 
    ;
diagnosticsStatement
    : GET diagnosticsScope DIAGNOSTICS variableClauseAssignNumber
    | GET diagnosticsScope DIAGNOSTICS CONDITION  variableClause variableClauseAssignCondition
    | GET diagnosticsScope DIAGNOSTICS CONDITION  decimalLiteral variableClauseAssignCondition
    ;
variableClauseAssignNumber
    : variableClause EQUAL_SYMBOL numberOrCount
    | variableClause EQUAL_SYMBOL numberOrCount COMMA variableClauseAssignNumber
    ;
variableClauseAssignCondition
    : variableClause EQUAL_SYMBOL diagnosticsConditionInformationName
    | variableClause EQUAL_SYMBOL diagnosticsConditionInformationName COMMA variableClauseAssignCondition
    ;
numberOrCount
    : NUMBER | ROW_COUNT
    ;
diagnosticsScope
    : CURRENT | STACKED
    |
    ;
diagnosticsConditionInformationName
    : CLASS_ORIGIN
    | SUBCLASS_ORIGIN
    | RETURNED_SQLSTATE
    | MESSAGE_TEXT
    | MYSQL_ERRNO
    | CONSTRAINT_CATALOG
    | CONSTRAINT_SCHEMA
    | CONSTRAINT_NAME
    | CATALOG_NAME
    | SCHEMA_NAME
    | TABLE_NAME
    | COLUMN_NAME
    | CURSOR_NAME
    ;

// details

describeObjectClause
    : selectStatement 
    | deleteStatement 
    | insertStatement
    | replaceStatement 
    | updateStatement                                                         
    | FOR CONNECTION uid                                           
    ;


// Common Clauses

//    DB Objects

fullId
    : uid
    | uid dottedId
    ;

tableName
    : fullId
    ;
fullColumnName
    : uid dottedId dottedId
    | fullId
    ;

indexColumnName
    : uid  opt_ascOrDesc
    | uid LR_BRACKET decimalLiteral RR_BRACKET opt_ascOrDesc
    ;

opt_ascOrDesc
    : ASC
    | DESC
    |
    ;
userName
    : STRING_USER_NAME | ID | STRING_LITERAL;

mysqlVariable
    : LOCAL_ID
    | GLOBAL_ID
    ;

charsetName
    : BINARY
    | charsetNameBase
    | STRING_LITERAL
    | CHARSET_REVERSE_QOUTE_STRING
    ;

collationName
    : uid;

engineName
    : ARCHIVE | BLACKHOLE | CSV | FEDERATED | INNODB | MEMORY
    | MRG_MYISAM | MYISAM | NDB | NDBCLUSTER | PERFORMANCE_SCHEMA
    | TOKUDB
    | ID
    | STRING_LITERAL | REVERSE_QUOTE_ID
    ;

uuidSet
    : decimalLiteral MINUS decimalLiteral MINUS decimalLiteral
      MINUS decimalLiteral MINUS decimalLiteral uuidRight
    ;
uuidRight
    : COLON_SYMB decimalLiteral MINUS decimalLiteral
    | COLON_SYMB decimalLiteral MINUS decimalLiteral uuidRight
    ;
xid
    : xuidStringId COMMA xuidStringId
    | xuidStringId COMMA xuidStringId COMMA decimalLiteral
    | xuidStringId
    ;

xuidStringId
    : STRING_LITERAL
    | BIT_STRING
    | HEXADECIMAL_LITERALs
    ;
HEXADECIMAL_LITERALs
    : HEXADECIMAL_LITERAL
    | HEXADECIMAL_LITERAL HEXADECIMAL_LITERALs
    ;
authPlugin
    : uid
    ;

uid
    : simpleId
    //| DOUBLE_QUOTE_ID
    | CHARSET_REVERSE_QOUTE_STRING
    ;

simpleId
    : charsetNameBase
    | transactionLevelBase
    | ARCHIVE | BLACKHOLE | CSV | FEDERATED | INNODB
    | MRG_MYISAM | MYISAM | NDB | NDBCLUSTER | PERFORMANCE_SCHEMA
    | TOKUDB
    | ID
    | STRING_LITERAL | REVERSE_QUOTE_ID
    | privilegesBase
    | DATETIME | ENUM | TEXT
    | functionNameBase 
    | ACCOUNT | ACTION | AFTER | AGGREGATE | ALGORITHM | ANY
    | AT | AUDIT_ADMIN | AUTHORS | AUTOCOMMIT | AUTOEXTEND_SIZE
    | AUTO_INCREMENT | AVG | AVG_ROW_LENGTH | BACKUP_ADMIN | BEGIN | BINLOG | BINLOG_ADMIN | BINLOG_ENCRYPTION_ADMIN | BIT | BIT_AND | BIT_OR | BIT_XOR
    | BLOCK | BOOL | BOOLEAN | BTREE | CACHE | CASCADED | CHAIN | CHANGED
    | CHANNEL | CHECKSUM | PAGE_CHECKSUM | CATALOG_NAME | CIPHER
    | CLASS_ORIGIN | CLIENT | CLONE_ADMIN | CLOSE | COALESCE | CODE
    | COLUMNS | COLUMN_FORMAT | COLUMN_NAME | COMMENT | COMMIT | COMPACT
    | COMPLETION | COMPRESSED | COMPRESSION | CONCURRENT
    | CONNECTION | CONNECTION_ADMIN | CONSISTENT | CONSTRAINT_CATALOG | CONSTRAINT_NAME
    | CONSTRAINT_SCHEMA | CONTAINS | CONTEXT
    | CONTRIBUTORS | COPY | CPU | CURRENT | CURSOR_NAME
    | DATA | DATAFILE | DEALLOCATE
    | DEFAULT_AUTH | DEFINER | DELAY_KEY_WRITE | DES_KEY_FILE | DIAGNOSTICS | DIRECTORY
    | DISABLE | DISCARD | DISK | DO | DUMPFILE | DUPLICATE
    | DYNAMIC | ENABLE | ENCRYPTION | ENCRYPTION_KEY_ADMIN | END | ENDS | ENGINE | ENGINES
    | ERROR | ERRORS | ESCAPE | EVEN | EVENT | EVENTS | EVERY
    | EXCHANGE | EXCLUSIVE | EXPIRE | EXPORT | EXTENDED | EXTENT_SIZE | FAST | FAULTS
    | FIELDS | FILE_BLOCK_SIZE | FILTER | FIREWALL_ADMIN | FIREWALL_USER | FIRST | FIXED | FLUSH
    | FOLLOWS | FOUND | FULL | FUNCTION | GENERAL | GLOBAL | GRANTS | GROUP_CONCAT
    | GROUP_REPLICATION | GROUP_REPLICATION_ADMIN | HANDLER | HASH | HELP | HOST | HOSTS | IDENTIFIED
    | IGNORE_SERVER_IDS | IMPORT | INDEXES | INITIAL_SIZE | INNODB_REDO_LOG_ARCHIVE
    | INPLACE | INSERT_METHOD | INSTALL | INSTANCE | INTERNAL | INVOKER | IO
    | IO_THREAD | IPC | ISOLATION | ISSUER | JSON | KEY_BLOCK_SIZE
    | LANGUAGE | LAST | LEAVES | LESS | LEVEL | LIST | LOCAL
    | LOGFILE | LOGS | MASTER | MASTER_AUTO_POSITION
    | MASTER_CONNECT_RETRY | MASTER_DELAY
    | MASTER_HEARTBEAT_PERIOD | MASTER_HOST | MASTER_LOG_FILE
    | MASTER_LOG_POS | MASTER_PASSWORD | MASTER_PORT
    | MASTER_RETRY_COUNT | MASTER_SSL | MASTER_SSL_CA
    | MASTER_SSL_CAPATH | MASTER_SSL_CERT | MASTER_SSL_CIPHER
    | MASTER_SSL_CRL | MASTER_SSL_CRLPATH | MASTER_SSL_KEY
    | MASTER_TLS_VERSION | MASTER_USER
    | MAX_CONNECTIONS_PER_HOUR | MAX_QUERIES_PER_HOUR
    | MAX | MAX_ROWS | MAX_SIZE | MAX_UPDATES_PER_HOUR
    | MAX_USER_CONNECTIONS | MEDIUM | MEMBER | MEMORY | MERGE | MESSAGE_TEXT
    | MID | MIGRATE
    | MIN | MIN_ROWS | MODE | MODIFY | MUTEX | MYSQL | MYSQL_ERRNO | NAME | NAMES
    | NCHAR | NDB_STORED_USER | NEVER | NEXT | NO | NODEGROUP | NONE | NUMBER | OFFLINE | OFFSET
    | OF | OJ | OLD_PASSWORD | ONE | ONLINE | ONLY | OPEN | OPTIMIZER_COSTS
    | OPTIONS | ORDER | OWNER | PACK_KEYS | PAGE | PARSER | PARTIAL
    | PARTITIONING | PARTITIONS | PASSWORD | PERSIST_RO_VARIABLES_ADMIN | PHASE | PLUGINS
    | PLUGIN_DIR | PLUGIN | PORT | PRECEDES | PREPARE | PRESERVE | PREV
    | PROCESSLIST | PROFILE | PROFILES | PROXY | QUERY | QUICK
    | REBUILD | RECOVER | REDO_BUFFER_SIZE | REDUNDANT
    | RELAY | RELAYLOG | RELAY_LOG_FILE | RELAY_LOG_POS | REMOVE
    | REORGANIZE | REPAIR | REPLICATE_DO_DB | REPLICATE_DO_TABLE
    | REPLICATE_IGNORE_DB | REPLICATE_IGNORE_TABLE
    | REPLICATE_REWRITE_DB | REPLICATE_WILD_DO_TABLE
    | REPLICATE_WILD_IGNORE_TABLE | REPLICATION | REPLICATION_APPLIER | REPLICATION_SLAVE_ADMIN | RESET
    | RESOURCE_GROUP_ADMIN | RESOURCE_GROUP_USER | RESUME
    | RETURNED_SQLSTATE | RETURNS | ROLE | ROLE_ADMIN | ROLLBACK | ROLLUP | ROTATE | ROW | ROWS
    | ROW_FORMAT | SAVEPOINT | SCHEDULE | SCHEMA_NAME | SECURITY | SERIAL | SERVER
    | SESSION | SET_USER_ID | SHARE | SHARED | SHOW_ROUTINE | SIGNED | SIMPLE | SLAVE
    | SLOW | SNAPSHOT | SOCKET | SOME | SONAME | SOUNDS | SOURCE
    | SQL_AFTER_GTIDS | SQL_AFTER_MTS_GAPS | SQL_BEFORE_GTIDS
    | SQL_BUFFER_RESULT | SQL_CACHE | SQL_NO_CACHE | SQL_THREAD
    | STACKED | START | STARTS | STATS_AUTO_RECALC | STATS_PERSISTENT
    | STATS_SAMPLE_PAGES | STATUS | STD | STDDEV | STDDEV_POP | STDDEV_SAMP | STOP | STORAGE | STRING
    | SUBCLASS_ORIGIN | SUBJECT | SUBPARTITION | SUBPARTITIONS | SUM | SUSPEND | SWAPS
    | SWITCHES | SYSTEM_VARIABLES_ADMIN | TABLE_NAME | TABLESPACE | TABLE_ENCRYPTION_ADMIN
    | TEMPORARY | TEMPTABLE | THAN | TRADITIONAL
    | TRANSACTION | TRANSACTIONAL | TRIGGERS | TRUNCATE | UNDEFINED | UNDOFILE
    | UNDO_BUFFER_SIZE | UNINSTALL | UNKNOWN | UNTIL | UPGRADE | USER | USE_FRM | USER_RESOURCES
    | VALIDATION | VALUE | VAR_POP | VAR_SAMP | VARIABLES | VARIANCE | VERSION_TOKEN_ADMIN | VIEW | WAIT | WARNINGS | WITHOUT
    | WORK | WRAPPER | X509 | XA | XA_RECOVER_ADMIN | XML
    ;

dottedId
    : DOT_ID
    | DOT uid
    ;


//    Literals

decimalLiteral
    : DECIMAL_LITERAL | ZERO_DECIMAL | ONE_DECIMAL | TWO_DECIMAL
    ;

fileSizeLiteral
    : FILESIZE_LITERAL | decimalLiteral;
STRING_LITERALs
    : STRING_LITERAL
    | STRING_LITERAL STRING_LITERALs
    ;
opt_STRING_CHARSET_NAME
    : STRING_CHARSET_NAME
    |
    ;
stringLiteral
    : stringLiteralLeft STRING_LITERALs
    | stringLiteralLeft opt_collateConfig
    ;
stringLiteralLeft
    : opt_STRING_CHARSET_NAME STRING_LITERAL
        | START_NATIONAL_STRING_LITERAL
    ;
booleanLiteral
    : TRUE | FALSE;

hexadecimalLiteral
    : opt_STRING_CHARSET_NAME HEXADECIMAL_LITERAL;

nullNotnull
    : opt_NOT NULL_SPEC_LITERAL
    | opt_NOT NULL_LITERAL
    ;

constant
    : stringLiteral | decimalLiteral
    | MINUS decimalLiteral
    | hexadecimalLiteral | booleanLiteral
    | REAL_LITERAL | BIT_STRING
    | NOT NULL_SPEC_LITERAL
    | NULL_SPEC_LITERAL
    | NULL_LITERAL
    | NOT NULL_LITERAL
    ;


//    Data Types----
dataTypeName
    : CHAR | CHARACTER | VARCHAR | TINYTEXT | TEXT | MEDIUMTEXT | LONGTEXT
       | NCHAR | NVARCHAR | LONG
       ;
opt_lengthOneDimension
    : lengthOneDimension
    |
    ;
opt_BINARY
    : BINARY
    |
    ;
opt_dataTypeCharsetAssign
    : charsetKeywords charsetName
    |
    ;
opt_dataTypeCollateAssign
    : COLLATE collationName | BINARY
    |
    ;
dataTypeNatinalType
    : VARCHAR | CHARACTER
    ;
dataTypeIntType
    : TINYINT | SMALLINT | MEDIUMINT | INT | INTEGER | BIGINT
        | MIDDLEINT | INT1 | INT2 | INT3 | INT4 | INT8
        ;
opt_ZEROFILL
    :ZEROFILL
    |
    ;
opt_signOrUnsign
    : SIGNED
    | UNSIGNED
    |
    ;
opt_PRECISION
    : PRECISION
    |
    ;
opt_lengthTwoDimension
    : lengthTwoDimension
    |
    ;
dataTypeDecimal
    : DECIMAL | DEC | FIXED | NUMERIC | FLOAT | FLOAT4 | FLOAT8
    ;
opt_lengthTwoOptionalDimension
    : lengthTwoOptionalDimension
    |
    ;
dataTypeLob
    :  DATE | TINYBLOB | MEDIUMBLOB | LONGBLOB
        | BOOL | BOOLEAN | SERIAL
    ;
dataTypeLobWithLength
    : BIT | TIME | TIMESTAMP | DATETIME | BINARY
        | VARBINARY | BLOB | YEAR
    ;
enumOrSet
    : ENUM | SET
    ;
dataTypeGis
    : GEOMETRYCOLLECTION | GEOMCOLLECTION | LINESTRING | MULTILINESTRING
        | MULTIPOINT | MULTIPOLYGON | POINT | POLYGON | JSON | GEOMETRY
    ;
dataType
    : dataTypeName opt_BINARY opt_dataTypeCharsetAssign opt_dataTypeCollateAssign 
    | dataTypeName lengthOneDimension opt_BINARY opt_dataTypeCharsetAssign opt_dataTypeCollateAssign 
    | dataTypeName VARYING opt_lengthOneDimension opt_BINARY opt_dataTypeCharsetAssign opt_dataTypeCollateAssign                           
    | NATIONAL dataTypeNatinalType opt_lengthOneDimension opt_BINARY                                 
    | NCHAR VARCHAR opt_lengthOneDimension opt_BINARY                                   
    | NATIONAL CHAR VARYING opt_lengthOneDimension opt_BINARY 
    | NATIONAL CHARACTER VARYING opt_lengthOneDimension opt_BINARY                                  
    | dataTypeIntType opt_lengthOneDimension opt_signOrUnsign opt_ZEROFILL            
    | REAL opt_lengthTwoDimension opt_signOrUnsign opt_ZEROFILL            
    | DOUBLE opt_PRECISION opt_lengthTwoDimension opt_signOrUnsign opt_ZEROFILL           
    | dataTypeDecimal opt_lengthTwoOptionalDimension opt_signOrUnsign opt_ZEROFILL   
    | dataTypeLob                                                            
    | dataTypeLobWithLength opt_lengthOneDimension                                           
    | enumOrSet collectionOptions opt_BINARY
      opt_dataTypeCharsetAssign                      
    | dataTypeGis                                                                 
    | LONG VARCHAR
      opt_BINARY
      opt_dataTypeCharsetAssign
      opt_collateConfig                                    
    | LONG VARBINARY                                                
    ;

collectionOptions
    : LR_BRACKET STRING_LITERALList RR_BRACKET
    ;
STRING_LITERALList
    : STRING_LITERAL
    | STRING_LITERAL COMMA STRING_LITERALList
    ;
opt_INTEGER
    : INTEGER
    |
    ;
convertedDateType
    : DATE | DATETIME | TIME | JSON
    ;
convertedDataType
    : NCHAR opt_lengthOneDimension
    | BINARY opt_lengthOneDimension
    | CHAR opt_lengthOneDimension opt_dataTypeCharsetAssign
    | convertedDateType
    | DECIMAL opt_lengthTwoDimension
    | UNSIGNED opt_INTEGER
    | SIGNED opt_INTEGER
    ;

lengthOneDimension
    : LR_BRACKET decimalLiteral RR_BRACKET
    ;

lengthTwoDimension
    : LR_BRACKET decimalLiteral COMMA decimalLiteral RR_BRACKET
    ;

lengthTwoOptionalDimension
    : LR_BRACKET decimalLiteral COMMA decimalLiteral RR_BRACKET
    | LR_BRACKET decimalLiteral RR_BRACKET
    ;


//    Common Lists

uidList
    : uid
    | uid COMMA uidList
    ;

tables
    : tableName
    | tableName COMMA tables
    ;

indexColumnNames
    : LR_BRACKET indexColumnNameList RR_BRACKET
    ;
indexColumnNameList
    : indexColumnName
    | indexColumnName COMMA indexColumnNameList
    ;
expressions
    : expression
    | expression COMMA expressions
    ;

expressionsWithDefaults
    : expressionOrDefault
    | expressionOrDefault COMMA expressionsWithDefaults
    ;

constants
    : constant
    | constant COMMA constants
    ;

simpleStrings
    : STRING_LITERALList
    ;

userVariables
    : LOCAL_ID
    | LOCAL_ID COMMA userVariables
    ;


//    Common Expressons-----

defaultValue
    : EXCLAMATION_SYMBOL constant opt_defaultValueOnUpdate
    | BIT_NOT_OP constant opt_defaultValueOnUpdate
    | PLUS constant opt_defaultValueOnUpdate
    | constant 
    | constant ON UPDATE currentTimestamp
    | currentTimestamp opt_defaultValueOnUpdate
    | LR_BRACKET expression RR_BRACKET opt_defaultValueOnUpdate
    ;
opt_defaultValueOnUpdate
    :ON UPDATE currentTimestamp
    |
    ;

currentTimestamp
    : currentTimestampKeyword
    | currentTimestampKeyword LR_BRACKET opt_decimalLiteral RR_BRACKET
    | NOW LR_BRACKET opt_decimalLiteral RR_BRACKET
    ;
currentTimestampKeyword
    : CURRENT_TIMESTAMP | LOCALTIME | LOCALTIMESTAMP
    ;
opt_decimalLiteral
    : decimalLiteral
    |
    ;
expressionOrDefault
    : expression | DEFAULT
    ;

ifExists
    : IF EXISTS;

ifNotExists
    : IF NOT EXISTS;


//    Functions
opt_functionArgs
    : functionArgs
    |
    ;
functionCall
    : specificFunction                                              
    | aggregateWindowedFunction                                     
    | scalarFunctionName LR_BRACKET opt_functionArgs RR_BRACKET                      
    | fullId LR_BRACKET opt_functionArgs RR_BRACKET                                 
    | passwordFunctionClause                                     
    ;
caseFuncAlternatives
    : caseFuncAlternative
    | caseFuncAlternative caseFuncAlternatives
    ;
stringOrExpr
    : expression
    ;
opt_stringOrExpr
    : stringOrExpr
    |
    ;
substringKeyword
    : SUBSTR | SUBSTRING
    ;
decimalOrExpr
    : expression
    ;
trimType
    : BOTH | LEADING | TRAILING
    ;
stringFormat
    : CHAR | BINARY
    ;
opt_levelsInWeightString
    : levelsInWeightString
    |
    ;
specificFunction
    : CURRENT_DATE 
    | CURRENT_TIME 
    | CURRENT_TIMESTAMP
    | CURRENT_USER 
    | LOCALTIME
    | CURRENT_DATE LR_BRACKET RR_BRACKET
    | CURRENT_TIME LR_BRACKET RR_BRACKET
    | CURRENT_TIMESTAMP LR_BRACKET RR_BRACKET
    | CURRENT_USER LR_BRACKET RR_BRACKET
    | LOCALTIME LR_BRACKET RR_BRACKET                                                 
    | CONVERT LR_BRACKET expression COMMA convertedDataType RR_BRACKET 
    | CONVERT LR_BRACKET expression USING charsetName RR_BRACKET                 
    | CAST LR_BRACKET expression AS convertedDataType RR_BRACKET               
    | VALUES LR_BRACKET fullColumnName RR_BRACKET                               
    | CASE expression caseFuncAlternatives ELSE functionArg END
    | CASE expression caseFuncAlternatives END                              
    | CASE caseFuncAlternatives END   
    | CASE caseFuncAlternatives ELSE functionArg END                            
    | CHAR LR_BRACKET functionArgs  USING charsetName RR_BRACKET              
    | CHAR LR_BRACKET functionArgs RR_BRACKET
    | POSITION LR_BRACKET stringOrExpr IN stringOrExpr RR_BRACKET                                                          
    | substringKeyword LR_BRACKET stringOrExpr FROM decimalOrExpr FOR decimalOrExpr RR_BRACKET   
    | substringKeyword LR_BRACKET stringOrExpr FROM decimalOrExpr RR_BRACKET                                                        
    | TRIM
      LR_BRACKET
        trimType
        opt_stringOrExpr
        FROM
        stringOrExpr
      RR_BRACKET                                                           
    | TRIM
      LR_BRACKET
        stringOrExpr
        FROM
        stringOrExpr
      RR_BRACKET                                                          
    | WEIGHT_STRING LR_BRACKET stringOrExpr opt_levelsInWeightString RR_BRACKET 
    | WEIGHT_STRING LR_BRACKET stringOrExpr AS stringFormat LR_BRACKET decimalLiteral RR_BRACKET  opt_levelsInWeightString RR_BRACKET                                                          
    | EXTRACT
      LR_BRACKET
        intervalType
        FROM
        stringOrExpr
      RR_BRACKET                                                          
    | GET_FORMAT
      LR_BRACKET
        datetimeFormat
        COMMA stringLiteral
      RR_BRACKET                                                           
    ;
datetimeFormat
    : DATE | TIME | DATETIME
    ;
caseFuncAlternative
    : WHEN functionArg
      THEN functionArg
    ;

levelsInWeightString
    : LEVEL levelInWeightListElements                             
    | LEVEL decimalLiteral MINUS decimalLiteral       
    ;
levelInWeightListElements
    : levelInWeightListElement
    | levelInWeightListElement COMMA levelInWeightListElements
    ;
levelInWeightListElement
    : decimalLiteral levelInWeightListElement_orderType
    ;
levelInWeightListElement_orderType
    : ASC | DESC | REVERSE
    |
    ;
aggregateCompareFunc
    : AVG | MAX | MIN | SUM
    ;
aggregateBitFunc
    : BIT_AND | BIT_OR | BIT_XOR | STD | STDDEV | STDDEV_POP
        | STDDEV_SAMP | VAR_POP | VAR_SAMP | VARIANCE
        ;
opt_DISTINCT
    : DISTINCT
    |
    ;
opt_order_by
    : ORDER BY  orderByExprList
    |
    ;
aggregateWindowedFunction
    : aggregateCompareFunc  LR_BRACKET unionType functionArg RR_BRACKET
    | COUNT LR_BRACKET opt_ALL functionArg RR_BRACKET
    | COUNT LR_BRACKET STAR RR_BRACKET
    | COUNT LR_BRACKET DISTINCT functionArgs RR_BRACKET
    | aggregateBitFunc LR_BRACKET opt_ALL functionArg RR_BRACKET
    | GROUP_CONCAT LR_BRACKET opt_DISTINCT functionArgs opt_order_by RR_BRACKET
    | GROUP_CONCAT LR_BRACKET opt_DISTINCT functionArgs opt_order_by SEPARATOR STRING_LITERAL RR_BRACKET
    ;

scalarFunctionName
    : functionNameBase
    | ASCII | CURDATE | CURRENT_DATE | CURRENT_TIME
    | CURRENT_TIMESTAMP | CURTIME | DATE_ADD | DATE_SUB
    | IF | INSERT | LOCALTIME | LOCALTIMESTAMP | MID | NOW
    | REPLACE | SUBSTR | SUBSTRING | SYSDATE | TRIM
    | UTC_DATE | UTC_TIME | UTC_TIMESTAMP
    ;

passwordFunctionClause
    : OLD_PASSWORD LR_BRACKET functionArg RR_BRACKET
    | PASSWORD LR_BRACKET functionArg RR_BRACKET
    ;

functionArgs
    : functionArg
    | functionArg COMMA functionArgs
    ;

functionArg
    : expression
    ;


//    Expressions, predicates

// Simplified approach for expression
expression
    : expression logicalOperator expression                         
    | predicate IS opt_NOT testValue         
    | predicate                                                     
    ;
testValue
    : TRUE | FALSE | UNKNOWN
    ;
predicate
    : predicate NOT IN LR_BRACKET expressions RR_BRACKET 
    | predicate NOT IN LR_BRACKET selectStatement RR_BRACKET   
    | predicate IN LR_BRACKET expressions RR_BRACKET 
    | predicate IN LR_BRACKET selectStatement RR_BRACKET  
    | predicate IS nullNotnull                                      
    | predicate comparisonOperator predicate            
    | predicate comparisonOperator ALL LR_BRACKET selectStatement RR_BRACKET    
    | predicate comparisonOperator ANY LR_BRACKET selectStatement RR_BRACKET  
    | predicate comparisonOperator SOME LR_BRACKET selectStatement RR_BRACKET       
    | predicate NOT BETWEEN predicate AND predicate 
    | predicate BETWEEN predicate AND predicate                
    | predicate SOUNDS LIKE predicate                              
    | predicate LIKE predicate
    | predicate LIKE predicate ESCAPE STRING_LITERAL      
    | predicate REGEXP predicate     
    | predicate RLIKE predicate                             
    | predicate NOT LIKE predicate
    | predicate NOT LIKE predicate ESCAPE STRING_LITERAL      
    | predicate NOT REGEXP predicate     
    | predicate NOT RLIKE predicate               
    | LOCAL_ID VAR_ASSIGN expressionAtom            
    | expressionAtom                        
    | predicate MEMBER OF LR_BRACKET predicate RR_BRACKET                        
    ;

// Add in ASTVisitor nullNotnull in constant
expressionAtom
    : constant                                                      
    | functionCall                                                
    | fullColumnName                                        
    | expressionAtom COLLATE collationName                         
    | mysqlVariable     
    | EXCLAMATION_SYMBOL expressionAtom | BIT_NOT_OP expressionAtom | PLUS expressionAtom                                                                         
    | BINARY expressionAtom                                        
    | LR_BRACKET expressions RR_BRACKET                         
    | ROW LR_BRACKET expression COMMA expressions  RR_BRACKET                     
    | EXISTS LR_BRACKET selectStatement RR_BRACKET                               
    | LR_BRACKET selectStatement RR_BRACKET                                      
    | INTERVAL expression intervalType                              
    | expressionAtom bitOperator expressionAtom          
    | expressionAtom mathOperator expressionAtom         
    | expressionAtom jsonOperator expressionAtom         
    ;
comparisonOperator
    : EQUAL_SYMBOL | GREATER_SYMBOL | LESS_SYMBOL | LESS_SYMBOL EQUAL_SYMBOL | GREATER_SYMBOL EQUAL_SYMBOL
    | LESS_SYMBOL GREATER_SYMBOL | EXCLAMATION_SYMBOL EQUAL_SYMBOL | LESS_SYMBOL EQUAL_SYMBOL GREATER_SYMBOL
    ;

logicalOperator
    : AND | BIT_AND_OP BIT_AND_OP | XOR | OR | DOUBLE_BIT_OR_OP
    ;

bitOperator
    : LESS_SYMBOL LESS_SYMBOL | GREATER_SYMBOL GREATER_SYMBOL | BIT_AND_OP | BIT_XOR_OP | BIT_OR_OP
    ;

mathOperator
    : STAR | DIVIDE | MODULE | DIV | MOD | PLUS | MINUS | MINUSMINUS
    ;

jsonOperator
    : MINUS GREATER_SYMBOL | MINUS GREATER_SYMBOL GREATER_SYMBOL
    ;

//    Simple id sets
//     (that keyword, which can be id)

charsetNameBase
    : ARMSCII8 | ASCII | BIG5 | CP1250 | CP1251 | CP1256 | CP1257
    | CP850 | CP852 | CP866 | CP932 | DEC8 | EUCJPMS | EUCKR
    | GB2312 | GBK | GEOSTD8 | GREEK | HEBREW | HP8 | KEYBCS2
    | KOI8R | KOI8U | LATIN1 | LATIN2 | LATIN5 | LATIN7 | MACCE
    | MACROMAN | SJIS | SWE7 | TIS620 | UCS2 | UJIS | UTF16
    | UTF16LE | UTF32 | UTF8 | UTF8MB3 | UTF8MB4
    ;

transactionLevelBase
    : REPEATABLE | COMMITTED | UNCOMMITTED | SERIALIZABLE
    ;

privilegesBase
    : TABLES | ROUTINE | EXECUTE | FILE | PROCESS
    | RELOAD | SHUTDOWN | SUPER | PRIVILEGES
    ;

intervalTypeBase
    : QUARTER | MONTH | DAY | HOUR
    | MINUTE | WEEK | SECOND | MICROSECOND
    ;



functionNameBase
    : ABS | ACOS | ADDDATE | ADDTIME | AES_DECRYPT | AES_ENCRYPT
    | AREA | ASBINARY | ASIN | ASTEXT | ASWKB | ASWKT
    | ASYMMETRIC_DECRYPT | ASYMMETRIC_DERIVE
    | ASYMMETRIC_ENCRYPT | ASYMMETRIC_SIGN | ASYMMETRIC_VERIFY
    | ATAN | ATAN2 | BENCHMARK | BIN | BIT_COUNT | BIT_LENGTH
    | BUFFER | CEIL | CEILING | CENTROID | CHARACTER_LENGTH
    | CHARSET | CHAR_LENGTH | COERCIBILITY | COLLATION
    | COMPRESS | CONCAT | CONCAT_WS | CONNECTION_ID | CONV
    | CONVERT_TZ | COS | COT | COUNT  | CRC32
    | CREATE_ASYMMETRIC_PRIV_KEY | CREATE_ASYMMETRIC_PUB_KEY
    | CREATE_DH_PARAMETERS | CREATE_DIGEST | CROSSES | DATABASE | DATE
    | DATEDIFF | DATE_FORMAT | DAY | DAYNAME | DAYOFMONTH
    | DAYOFWEEK | DAYOFYEAR | DECODE | DEGREES | DES_DECRYPT
    | DES_ENCRYPT | DIMENSION | DISJOINT | ELT | ENCODE
    | ENCRYPT | ENDPOINT | ENVELOPE | EQUALS | EXP | EXPORT_SET
    | EXTERIORRING | EXTRACTVALUE | FIELD | FIND_IN_SET | FLOOR
    | FORMAT | FOUND_ROWS | FROM_BASE64 | FROM_DAYS
    | FROM_UNIXTIME | GEOMCOLLFROMTEXT | GEOMCOLLFROMWKB
    | GEOMETRYCOLLECTION | GEOMETRYCOLLECTIONFROMTEXT
    | GEOMETRYCOLLECTIONFROMWKB | GEOMETRYFROMTEXT
    | GEOMETRYFROMWKB | GEOMETRYN | GEOMETRYTYPE | GEOMFROMTEXT
    | GEOMFROMWKB | GET_FORMAT | GET_LOCK | GLENGTH | GREATEST
    | GTID_SUBSET | GTID_SUBTRACT | HEX | HOUR | IFNULL
    | INET6_ATON | INET6_NTOA | INET_ATON | INET_NTOA | INSTR
    | INTERIORRINGN | INTERSECTS | INVISIBLE
    | ISCLOSED | ISEMPTY | ISNULL
    | ISSIMPLE | IS_FREE_LOCK | IS_IPV4 | IS_IPV4_COMPAT
    | IS_IPV4_MAPPED | IS_IPV6 | IS_USED_LOCK | LAST_INSERT_ID
    | LCASE | LEAST | LEFT | LENGTH | LINEFROMTEXT | LINEFROMWKB
    | LINESTRING | LINESTRINGFROMTEXT | LINESTRINGFROMWKB | LN
    | LOAD_FILE | LOCATE | LOG | LOG10 | LOG2 | LOWER | LPAD
    | LTRIM | MAKEDATE | MAKETIME | MAKE_SET | MASTER_POS_WAIT
    | MBRCONTAINS | MBRDISJOINT | MBREQUAL | MBRINTERSECTS
    | MBROVERLAPS | MBRTOUCHES | MBRWITHIN | MD5 | MICROSECOND
    | MINUTE | MLINEFROMTEXT | MLINEFROMWKB | MOD| MONTH | MONTHNAME
    | MPOINTFROMTEXT | MPOINTFROMWKB | MPOLYFROMTEXT
    | MPOLYFROMWKB | MULTILINESTRING | MULTILINESTRINGFROMTEXT
    | MULTILINESTRINGFROMWKB | MULTIPOINT | MULTIPOINTFROMTEXT
    | MULTIPOINTFROMWKB | MULTIPOLYGON | MULTIPOLYGONFROMTEXT
    | MULTIPOLYGONFROMWKB | NAME_CONST | NULLIF | NUMGEOMETRIES
    | NUMINTERIORRINGS | NUMPOINTS | OCT | OCTET_LENGTH | ORD
    | OVERLAPS | PERIOD_ADD | PERIOD_DIFF | PI | POINT
    | POINTFROMTEXT | POINTFROMWKB | POINTN | POLYFROMTEXT
    | POLYFROMWKB | POLYGON | POLYGONFROMTEXT | POLYGONFROMWKB
    | POSITION| POW | POWER | QUARTER | QUOTE | RADIANS | RAND
    | RANDOM_BYTES | RELEASE_LOCK | REVERSE | RIGHT | ROUND
    | ROW_COUNT | RPAD | RTRIM | SECOND | SEC_TO_TIME
    | SCHEMA | SESSION_USER | SESSION_VARIABLES_ADMIN 
    | SHA | SHA1 | SHA2 | SIGN | SIN | SLEEP
    | SOUNDEX | SQL_THREAD_WAIT_AFTER_GTIDS | SQRT | SRID
    | STARTPOINT | STRCMP | STR_TO_DATE | ST_AREA | ST_ASBINARY
    | ST_ASTEXT | ST_ASWKB | ST_ASWKT | ST_BUFFER | ST_CENTROID
    | ST_CONTAINS | ST_CROSSES | ST_DIFFERENCE | ST_DIMENSION
    | ST_DISJOINT | ST_DISTANCE | ST_ENDPOINT | ST_ENVELOPE
    | ST_EQUALS | ST_EXTERIORRING | ST_GEOMCOLLFROMTEXT
    | ST_GEOMCOLLFROMTXT | ST_GEOMCOLLFROMWKB
    | ST_GEOMETRYCOLLECTIONFROMTEXT
    | ST_GEOMETRYCOLLECTIONFROMWKB | ST_GEOMETRYFROMTEXT
    | ST_GEOMETRYFROMWKB | ST_GEOMETRYN | ST_GEOMETRYTYPE
    | ST_GEOMFROMTEXT | ST_GEOMFROMWKB | ST_INTERIORRINGN
    | ST_INTERSECTION | ST_INTERSECTS | ST_ISCLOSED | ST_ISEMPTY
    | ST_ISSIMPLE | ST_LINEFROMTEXT | ST_LINEFROMWKB
    | ST_LINESTRINGFROMTEXT | ST_LINESTRINGFROMWKB
    | ST_NUMGEOMETRIES | ST_NUMINTERIORRING
    | ST_NUMINTERIORRINGS | ST_NUMPOINTS | ST_OVERLAPS
    | ST_POINTFROMTEXT | ST_POINTFROMWKB | ST_POINTN
    | ST_POLYFROMTEXT | ST_POLYFROMWKB | ST_POLYGONFROMTEXT
    | ST_POLYGONFROMWKB | ST_SRID | ST_STARTPOINT
    | ST_SYMDIFFERENCE | ST_TOUCHES | ST_UNION | ST_WITHIN
    | ST_X | ST_Y | SUBDATE | SUBSTRING_INDEX | SUBTIME
    | SYSTEM_USER | TAN | TIME | TIMEDIFF | TIMESTAMP
    | TIMESTAMPADD | TIMESTAMPDIFF | TIME_FORMAT | TIME_TO_SEC
    | TOUCHES | TO_BASE64 | TO_DAYS | TO_SECONDS | UCASE
    | UNCOMPRESS | UNCOMPRESSED_LENGTH | UNHEX | UNIX_TIMESTAMP
    | UPDATEXML | UPPER | UUID | UUID_SHORT
    | VALIDATE_PASSWORD_STRENGTH | VERSION | VISIBLE
    | WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS | WEEK | WEEKDAY
    | WEEKOFYEAR | WEIGHT_STRING | WITHIN | YEAR | YEARWEEK
    | Y_FUNCTION | X_FUNCTION | JSON_VALID | JSON_SCHEMA_VALID
    ;
opt_MULT_ASSIGN
    : EQUAL_SYMBOL
    |
    ;