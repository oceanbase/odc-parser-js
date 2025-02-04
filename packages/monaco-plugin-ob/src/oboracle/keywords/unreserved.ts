const words: string[] = [
  "*",
  "ADMIN",
  "AFTER",
  "ALLOCATE",
  "ANALYZE",
  "ARCHIVE",
  "ARCHIVELOG",
  "AUTHORIZATION",
  "AVG",
  "BACKUP",
  "BECOME",
  "BEFORE",
  "BEGIN_KEY",
  "BLOCK",
  "BODY",
  "CACHE",
  "CANCEL",
  "CASCADE",
  "CHANGE",
  "CHARACTER",
  "CHECKPOINT",
  "CLOSE",
  "COBOL",
  "COMMIT",
  "COMPILE",
  "CONSTRAINT",
  "CONSTRAINTS",
  "CONTENTS",
  "CONTINUE",
  "CONTROLFILE",
  "COUNT",
  "CURSOR",
  "CYCLE",
  "DATABASE",
  "DATAFILE",
  "DBA",
  "DEC",
  "DECLARE",
  "DISABLE",
  "DISMOUNT",
  "DOUBLE",
  "DUMP",
  "EACH",
  "ENABLE",
  "END",
  "ESCAPE",
  "EVENTS",
  "EXCEPT",
  "EXCEPTIONS",
  "EXEC",
  "EXECUTE",
  "EXPLAIN",
  "EXTENT",
  "EXTERNALLY",
  "FETCH",
  "FLUSH",
  "FORCE",
  "FOREIGN",
  "FORTRAN",
  "FOUND",
  "FREELIST",
  "FREELISTS",
  "FUNCTION",
  "GO",
  "GOTO",
  "GROUPS",
  "INCLUDING",
  "INDICATOR",
  "INITRANS",
  "INSTANCE",
  "INT",
  "KEY",
  "LANGUAGE",
  "LAYER",
  "LINK",
  "LISTS",
  "LOGFILE",
  "MANAGE",
  "MANUAL",
  "MAX",
  "MAXDATAFILES",
  "MAXINSTANCES",
  "MAXLOGFILES",
  "MAXLOGHISTORY",
  "MAXLOGMEMBERS",
  "MAXTRANS",
  "MAXVALUE",
  "MIN",
  "MINEXTENTS",
  "MINVALUE",
  "MODULE",
  "MOUNT",
  "NEW",
  "NEXT",
  "NOARCHIVELOG",
  "NOCACHE",
  "NOCYCLE",
  "NOMAXVALUE",
  "NOMINVALUE",
  "NONE",
  "NOORDER",
  "NORESETLOGS",
  "NOSORT",
  "NUMERIC",
  "OFF",
  "OLD",
  "ONLY",
  "OPEN",
  "OPTIMAL",
  "OWN",
  "PACKAGE_KEY",
  "PARALLEL",
  "PCTINCREASE",
  "PCTUSED",
  "PLAN",
  "PLI",
  "PRECISION",
  "PRIMARY",
  "PRIVATE",
  "PROCEDURE",
  "PROFILE",
  "QUOTA",
  "READ",
  "REAL",
  "RECOVER",
  "REFERENCES",
  "REFERENCING",
  "RESETLOGS",
  "RESTRICTED",
  "REUSE",
  "ROLE",
  "ROLES",
  "ROLLBACK",
  "SAVEPOINT",
  "SCHEMA",
  "SCN",
  "SECTION",
  "SEGMENT",
  "SEQUENCE",
  "SHARED",
  "SNAPSHOT",
  "SOME",
  "SORT",
  "SQL",
  "SQLCODE",
  "SQLERROR",
  "SQLSTATE",
  "STATEMENT_ID",
  "STATISTICS",
  "STOP",
  "STORAGE",
  "SUM",
  "SWITCH",
  "SYSTEM",
  "TABLES",
  "TABLESPACE",
  "TEMPORARY",
  "THREAD",
  "TIME",
  "TRACING",
  "TRANSACTION",
  "TRIGGERS",
  "TRUNCATE",
  "UNDER",
  "UNLIMITED",
  "UNTIL",
  "USE",
  "USING",
  "WHEN",
  "WORK",
  "WRITE",
  "ACCOUNT",
  "ACCESSIBLE",
  "ACTION",
  "ACTIVE",
  "ADDDATE",
  "ADMINISTER",
  "AGGREGATE",
  "AGAINST",
  "ALGORITHM",
  "ALWAYS",
  "ANALYSE",
  "APPROX_COUNT_DISTINCT",
  "APPROX_COUNT_DISTINCT_SYNOPSIS",
  "APPROX_COUNT_DISTINCT_SYNOPSIS_MERGE",
  "ASENSITIVE",
  "AT",
  "AUTHORS",
  "AUTO",
  "AUTOEXTEND_SIZE",
  "AVG_ROW_LENGTH",
  "BASE",
  "BASELINE",
  "BASELINE_ID",
  "BASIC",
  "BALANCE",
  "BINARY",
  "BINARY_DOUBLE",
  "BINARY_FLOAT",
  "BINDING",
  "BINLOG",
  "BIT",
  "BLOB",
  "BLOCK_SIZE",
  "BLOCK_INDEX",
  "BLOOM_FILTER",
  "BOOL",
  "BOOLEAN",
  "BOOTSTRAP",
  "BOTH",
  "BTREE",
  "BULK",
  "BULK_EXCEPTIONS",
  "BULK_ROWCOUNT",
  "BYTE",
  "BREADTH",
  "CALL",
  "CASCADED",
  "CAST",
  "CATALOG_NAME",
  "CHAIN",
  "CHANGED",
  "CHARSET",
  "CHECKSUM",
  "CIPHER",
  "CLASS_ORIGIN",
  "CLEAN",
  "CLEAR",
  "CLIENT",
  "CLOB",
  "CLOG",
  "CLUSTER_ID",
  "CLUSTER_NAME",
  "COALESCE",
  "CODE",
  "COLLATE",
  "COLLATION",
  "COLLECT",
  "COLUMN_FORMAT",
  "COLUMN_NAME",
  "COLUMN_OUTER_JOIN_SYMBOL",
  "COLUMN_STAT",
  "COLUMNS",
  "COMMITTED",
  "COMPACT",
  "COMPLETION",
  "COMPRESSED",
  "COMPRESSION",
  "COMPUTE",
  "CONCURRENT",
  "CONNECTION",
  "CONNECT_BY_ISCYCLE",
  "CONNECT_BY_ISLEAF",
  "CONSISTENT",
  "CONSISTENT_MODE",
  "CONSTRAINT_CATALOG",
  "CONSTRAINT_NAME",
  "CONSTRAINT_SCHEMA",
  "CONTAINS",
  "CONTEXT",
  "CONTRIBUTORS",
  "CONVERT",
  "COPY",
  "CORR",
  "COVAR_POP",
  "COVAR_SAMP",
  "CPU",
  "CREATE_TIMESTAMP",
  "CROSS",
  "CUBE",
  "CUME_DIST",
  "CURRENT_USER",
  "CURRENT_SCHEMA",
  "CURRENT_DATE",
  "CURRENT_TIMESTAMP",
  "DATA",
  "DATABASES",
  "DATABASE_ID",
  "DATA_TABLE_ID",
  "DATE_ADD",
  "DATE_SUB",
  "DATETIME",
  "DAY",
  "DAY_HOUR",
  "DAY_MICROSECOND",
  "DAY_MINUTE",
  "DAY_SECOND",
  "DBA_RECYCLEBIN",
  "DBTIMEZONE",
  "DEALLOCATE",
  "DEFAULT_AUTH",
  "DEFINER",
  "DELAY",
  "DELAYED",
  "DELAY_KEY_WRITE",
  "DENSE_RANK",
  "DEPTH",
  "DES_KEY_FILE",
  "DESCRIBE",
  "DESTINATION",
  "DETERMINISTIC",
  "DIAGNOSTICS",
  "DICTIONARY",
  "DIRECTORY",
  "DISCARD",
  "DISK",
  "DISTINCTROW",
  "DIV",
  "DO",
  "DUMPFILE",
  "DUPLICATE",
  "DUPLICATE_SCOPE",
  "DYNAMIC",
  "DEFAULT_TABLEGROUP",
  "E",
  "EFFECTIVE",
  "ELSEIF",
  "ENCLOSED",
  "ENCRYPTION",
  "ENDS",
  "ENGINE_",
  "ENGINES",
  "ENUM",
  "ERROR_CODE",
  "ERROR_P",
  "ERROR_INDEX",
  "ERRORS",
  "ESCAPED",
  "ESTIMATE",
  "EVENT",
  "EVERY",
  "EXCHANGE",
  "EXCLUDE",
  "EXEMPT",
  "EXIT",
  "EXPANSION",
  "EXPIRE",
  "EXPIRE_INFO",
  "EXPORT",
  "EXTENDED",
  "EXTENDED_NOADDR",
  "EXTENT_SIZE",
  "EXTRACT",
  "FAILED_LOGIN_ATTEMPTS",
  "FAST",
  "FAULTS",
  "FIELDS",
  "FILE_ID",
  "FILEX",
  "FINAL_COUNT",
  "FIRST",
  "FIRST_VALUE",
  "FIXED",
  "FLASHBACK",
  "FLOAT4",
  "FLOAT8",
  "FOLLOWER",
  "FOLLOWING",
  "FORMAT",
  "FREEZE",
  "FREQUENCY",
  "FROZEN",
  "FULL",
  "G",
  "GENERAL",
  "GENERATED",
  "GEOMETRY",
  "GEOMETRYCOLLECTION",
  "GET",
  "GET_FORMAT",
  "GLOBAL",
  "GLOBAL_ALIAS",
  "GRANTS",
  "GROUPING",
  "GTS",
  "HANDLER",
  "HASH",
  "HELP",
  "HIGH",
  "HIGH_PRIORITY",
  "HOUR_MICROSECOND",
  "HOUR_MINUTE",
  "HOUR_SECOND",
  "HOST",
  "HOSTS",
  "HOUR",
  "ID",
  "IDC",
  "IF",
  "IFIGNORE",
  "IGNORE",
  "IGNORE_SERVER_IDS",
  "ILOG",
  "ILOGCACHE",
  "IMPORT",
  "INDEXES",
  "INDEX_TABLE_ID",
  "INCR",
  "INCLUDE",
  "INFO",
  "INFILE",
  "INITIAL_SIZE",
  "INNER",
  "INNER_PARSE",
  "INOUT",
  "INSENSITIVE",
  "INSERT_METHOD",
  "INSTALL",
  "INT1",
  "INT2",
  "INT3",
  "INT4",
  "INT8",
  "INTERVAL",
  "INVOKER",
  "IO",
  "IO_AFTER_GTIDS",
  "IO_BEFORE_GTIDS",
  "IO_THREAD",
  "IPC",
  "ISNULL",
  "ISOLATION",
  "ISSUER",
  "IS_TENANT_SYS_POOL",
  "ITERATE",
  "JOB",
  "JOIN",
  "JSON",
  "K",
  "KEY_BLOCK_SIZE",
  "KEYS",
  "KEYSTORE",
  "KEY_VERSION",
  "KILL",
  "KEEP",
  "KVCACHE",
  "LAG",
  "LAST",
  "LAST_VALUE",
  "LEAD",
  "LEADER",
  "LEADING",
  "LEAVE",
  "LEAVES",
  "LEFT",
  "LESS",
  "LIMIT",
  "LINEAR",
  "LINES",
  "LINESTRING",
  "LIST",
  "LISTAGG",
  "LNNVL",
  "LOAD",
  "LOCAL",
  "LOCALITY",
  "LOCALTIMESTAMP",
  "LOCK_",
  "LOCKED",
  "LOCKS",
  "LOGONLY_REPLICA_NUM",
  "LOGS",
  "LONGBLOB",
  "LONGTEXT",
  "LOOP",
  "LOW",
  "LOW_PRIORITY",
  "ISOPEN",
  "ISOLATION_LEVEL",
  "M",
  "MAJOR",
  "MANAGEMENT",
  "MASTER",
  "MASTER_AUTO_POSITION",
  "MASTER_BIND",
  "MASTER_CONNECT_RETRY",
  "MASTER_DELAY",
  "MASTER_HEARTBEAT_PERIOD",
  "MASTER_HOST",
  "MASTER_LOG_FILE",
  "MASTER_LOG_POS",
  "MASTER_PASSWORD",
  "MASTER_PORT",
  "MASTER_RETRY_COUNT",
  "MASTER_SERVER_ID",
  "MASTER_SSL",
  "MASTER_SSL_CA",
  "MASTER_SSL_CAPATH",
  "MASTER_SSL_CERT",
  "MASTER_SSL_CIPHER",
  "MASTER_SSL_CRL",
  "MASTER_SSL_CRLPATH",
  "MASTER_SSL_KEY",
  "MASTER_SSL_VERIFY_SERVER_CERT",
  "MASTER_USER",
  "MATCH",
  "MATCHED",
  "MAX_CONNECTIONS_PER_HOUR",
  "MAX_CPU",
  "MAX_DISK_SIZE",
  "MAX_IOPS",
  "MAX_MEMORY",
  "MAX_QUERIES_PER_HOUR",
  "MAX_ROWS",
  "MAX_SESSION_NUM",
  "MAX_SIZE",
  "MAX_UPDATES_PER_HOUR",
  "MAX_USED_PART_ID",
  "MAX_USER_CONNECTIONS",
  "MEDIUM",
  "MEDIUMBLOB",
  "MEDIUMINT",
  "MEDIUMTEXT",
  "MEMORY",
  "MEMTABLE",
  "MERGE",
  "MESSAGE_TEXT",
  "META",
  "MICROSECOND",
  "MIDDLEINT",
  "MIGRATE",
  "MIGRATION",
  "MIN_CPU",
  "MIN_IOPS",
  "MIN_MEMORY",
  "MINOR",
  "MIN_ROWS",
  "MINUTE",
  "MINUTE_MICROSECOND",
  "MINUTE_SECOND",
  "MOD",
  "MODIFIES",
  "MONTH",
  "MOVE",
  "MOVEMENT",
  "MULTILINESTRING",
  "MULTIPOINT",
  "MULTIPOLYGON",
  "MUTEX",
  "MYSQL_ERRNO",
  "NAME",
  "NAMES",
  "NATIONAL",
  "NATURAL",
  "NCHAR",
  "NDB",
  "NDBCLUSTER",
  "NO",
  "NODEGROUP",
  "NOLOGGING",
  "NOW",
  "NO_WAIT",
  "NO_WRITE_TO_BINLOG",
  "NULLS",
  "NTILE",
  "NTH_VALUE",
  "NVARCHAR",
  "NVARCHAR2",
  "OBJECT",
  "OCCUR",
  "OFFSET",
  "OLD_PASSWORD",
  "OLD_KEY",
  "OLTP",
  "OVER",
  "ONE",
  "ONE_SHOT",
  "OPTIONS",
  "OPTIMIZE",
  "OPTIONALLY",
  "ORA_ROWSCN",
  "ORIG_DEFAULT",
  "OUT",
  "OUTER",
  "OUTFILE",
  "OUTLINE",
  "OWNER",
  "P",
  "PACK_KEYS",
  "PAGE",
  "PARAMETERS",
  "PARAM_ASSIGN_OPERATOR",
  "PARSER",
  "PARTIAL",
  "PARTITION",
  "PARTITION_ID",
  "PARTITIONING",
  "PARTITIONS",
  "PERCENT_RANK",
  "PASSWORD",
  "PASSWORD_LOCK_TIME",
  "PASSWORD_VERIFY_FUNCTION",
  "PAUSE",
  "PERCENTAGE",
  "PHASE",
  "PLANREGRESS",
  "PLUGIN",
  "PLUGIN_DIR",
  "PLUGINS",
  "PIVOT",
  "POINT",
  "POLICY",
  "POLYGON",
  "POOL",
  "PORT",
  "POSITION",
  "PRECEDING",
  "PREPARE",
  "PRESERVE",
  "PREV",
  "PRIMARY_ZONE",
  "PRIVILEGE",
  "PROCESS",
  "PROCESSLIST",
  "PROFILES",
  "PROGRESSIVE_MERGE_NUM",
  "PROXY",
  "PURGE",
  "QUARTER",
  "QUERY",
  "QUICK",
  "RANK",
  "RANGE",
  "RATIO_TO_REPORT",
  "READ_WRITE",
  "READS",
  "READ_ONLY",
  "REBUILD",
  "RECURSIVE",
  "RECYCLE",
  "RECYCLEBIN",
  "REDACTION",
  "ROW_NUMBER",
  "REDO_BUFFER_SIZE",
  "REDOFILE",
  "REDUNDANT",
  "REFRESH",
  "REGEXP_LIKE",
  "REGION",
  "REGR_SLOPE",
  "REGR_INTERCEPT",
  "REGR_COUNT",
  "REGR_R2",
  "REGR_AVGX",
  "REGR_AVGY",
  "REGR_SXX",
  "REGR_SYY",
  "REGR_SXY",
  "RELAY",
  "RELAYLOG",
  "RELAY_LOG_FILE",
  "RELAY_LOG_POS",
  "RELAY_THREAD",
  "RELEASE",
  "RELOAD",
  "REMOVE",
  "REORGANIZE",
  "REPAIR",
  "REPEAT",
  "REPEATABLE",
  "REPLACE",
  "REPLICA",
  "REPLICA_NUM",
  "REPLICA_TYPE",
  "REPLICATION",
  "REPORT",
  "REQUIRE",
  "RESET",
  "RESIGNAL",
  "RESOURCE_POOL_LIST",
  "RESPECT",
  "RESTART",
  "RESTORE",
  "RESTRICT",
  "RESUME",
  "RETURN",
  "RETURNED_SQLSTATE",
  "RETURNING",
  "RETURNS",
  "REVERSE",
  "REWRITE_MERGE_VERSION",
  "REMOTE_OSS",
  "RLIKE",
  "RIGHT",
  "ROLLUP",
  "ROOT",
  "ROOTTABLE",
  "ROOTSERVICE",
  "ROOTSERVICE_LIST",
  "ROUTINE",
  "ROWCOUNT",
  "ROW_COUNT",
  "ROW_FORMAT",
  "RTREE",
  "RUN",
  "SAMPLE",
  "SCHEDULE",
  "SCHEMAS",
  "SCHEMA_NAME",
  "SCOPE",
  "SEARCH",
  "SECOND",
  "SECOND_MICROSECOND",
  "SECURITY",
  "SEED",
  "SENSITIVE",
  "SEPARATOR",
  "SERIAL",
  "SERIALIZABLE",
  "SERVER",
  "SERVER_IP",
  "SERVER_PORT",
  "SERVER_TYPE",
  "SESSION_ALIAS",
  "SESSION_USER",
  "SESSIONTIMEZONE",
  "SET_MASTER_CLUSTER",
  "SET_SLAVE_CLUSTER",
  "SET_TP",
  "SHRINK",
  "SHOW",
  "SHUTDOWN",
  "SIBLINGS",
  "SIGNAL",
  "SIGNED",
  "SIMPLE",
  "SLAVE",
  "SLOW",
  "SOCKET",
  "SONAME",
  "SOUNDS",
  "SOURCE",
  "SPACE",
  "SPATIAL",
  "SPECIFIC",
  "SPFILE",
  "SPLIT",
  "SQLEXCEPTION",
  "SQLWARNING",
  "SQL_BIG_RESULT",
  "SQL_CALC_FOUND_ROW",
  "SQL_SMALL_RESULT",
  "SQL_AFTER_GTIDS",
  "SQL_AFTER_MTS_GAPS",
  "SQL_BEFORE_GTIDS",
  "SQL_BUFFER_RESULT",
  "SQL_CACHE",
  "SQL_ID",
  "SQL_NO_CACHE",
  "SQL_THREAD",
  "SQL_TSI_DAY",
  "SQL_TSI_HOUR",
  "SQL_TSI_MINUTE",
  "SQL_TSI_MONTH",
  "SQL_TSI_QUARTER",
  "SQL_TSI_SECOND",
  "SQL_TSI_WEEK",
  "SQL_TSI_YEAR",
  "SSL",
  "STRAIGHT_JOIN",
  "STARTING",
  "STARTS",
  "STATS_AUTO_RECALC",
  "STATS_PERSISTENT",
  "STATS_SAMPLE_PAGES",
  "STATUS",
  "STATEMENTS",
  "STDDEV",
  "STDDEV_POP",
  "STDDEV_SAMP",
  "STORAGE_FORMAT_VERSION",
  "STORAGE_FORMAT_WORK_VERSION",
  "STORED",
  "STORING",
  "STRONG",
  "SUBCLASS_ORIGIN",
  "SUBDATE",
  "SUBJECT",
  "SUBPARTITION",
  "SUBPARTITIONS",
  "SUBSTR",
  "SUPER",
  "SUSPEND",
  "SWAPS",
  "SWITCHES",
  "SYSTEM_USER",
  "SYSTIMESTAMP",
  "SYSBACKUP",
  "SYSDBA",
  "SYSKM",
  "SYSOPER",
  "SYS_CONNECT_BY_PATH",
  "T",
  "TABLEGROUP",
  "TABLE_CHECKSUM",
  "TABLE_MODE",
  "TABLEGROUPS",
  "TABLEGROUP_ID",
  "TABLE_ID",
  "TABLE_NAME",
  "TABLET",
  "TABLET_SIZE",
  "TABLET_MAX_SIZE",
  "TASK",
  "TEMPLATE",
  "TEMPTABLE",
  "TENANT",
  "TERMINATED",
  "TEXT",
  "THAN",
  "TIMESTAMP",
  "TIMESTAMPADD",
  "TIMESTAMPDIFF",
  "TIMEZONE_ABBR",
  "TIMEZONE_HOUR",
  "TIMEZONE_MINUTE",
  "TIMEZONE_REGION",
  "TIME_ZONE_INFO",
  "TINYBLOB",
  "TINYTEXT",
  "TP_NAME",
  "TP_NO",
  "TRACE",
  "TRADITIONAL",
  "TRAILING",
  "TRIM",
  "TYPE",
  "TYPES",
  "UNCOMMITTED",
  "UNDEFINED",
  "UNDO",
  "UNDO_BUFFER_SIZE",
  "UNDOFILE",
  "UNICODE",
  "UNKNOWN",
  "UNINSTALL",
  "UNIT",
  "UNIT_NUM",
  "UNLOCK",
  "UNLOCKED",
  "UNUSUAL",
  "UNPIVOT",
  "UPGRADE",
  "UROWID",
  "USAGE",
  "USE_BLOOM_FILTER",
  "USE_FRM",
  "USER_RESOURCES",
  "UTC_DATE",
  "UTC_TIMESTAMP",
  "UNBOUNDED",
  "VALID",
  "VARIABLES",
  "VAR_POP",
  "VAR_SAMP",
  "VERBOSE",
  "MATERIALIZED",
  "WAIT",
  "WARNINGS",
  "WEEK",
  "WEIGHT_STRING",
  "WRAPPER",
  "X509",
  "XA",
  "XML",
  "YEAR",
  "ZONE",
  "ZONE_LIST",
  "ZONE_TYPE",
  "LOCATION",
  "VARIANCE",
  "VARYING",
  "VIRTUAL",
  "VISIBLE",
  "INVISIBLE",
  "RELY",
  "NORELY",
  "NOVALIDATE",
  "WITHIN",
  "WEAK",
  "WHILE",
  "XOR",
  "YEAR_MONTH",
  "ZEROFILL",
  "PERCENT",
  "TIES",
  "THROTTLE",
  "PRIORITY",
  "RT",
  "NETWORK",
  "LOGICAL_READS",
  "QUEUE_TIME",
  "MEMBER",
  "SUBMULTISET",
  "EMPTY",
  "A"
];

export default words;
