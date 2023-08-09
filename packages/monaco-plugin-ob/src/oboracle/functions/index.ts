import { IFunction } from "../../type";


/**
 * 单行函数
 */
const singleRowFunctions: IFunction[] = [
  {
    name: 'ABS',
    params: [
      {
        name: 'numeric_expression',
      },
    ],
    desc:
      '返回指定数值表达式的绝对值（正值）的数学函数。ABS 将负值更改为正值，对零或正值没有影响。',
  },
  {
    name: 'ACOS',
    params: [
      {
        name: 'numeric_expression',
      },
    ],
    desc: '返回以弧度表示的角，其余弦为指定的 NUMBER 表达式，也称为反余弦。',
  },
  {
    name: 'ASIN',
    params: [],
    desc: '',
    isNotSupport: true,
  },
  {
    name: 'ATAN',
    params: [],
    desc: '',
    isNotSupport: true,
  },
  {
    name: 'ATAN2',
    params: [],
    desc: '',
    isNotSupport: true,
  },
  {
    name: 'BITAND',
    params: [
      {
        name: 'nExpression1',
      },
      {
        name: 'nExpression2',
      },
    ],
    desc: '运算符按位进行“与”操作。输入和输出类型均为 NUMBER 数据类型。',
  },
  {
    name: 'CEIL',
    params: [
      {
        name: 'numeric_expression',
      },
    ],
    desc: '返回值大于等于数值 numeric_expression 的最小整数。',
  },
  {
    name: 'COS',
    params: [],
    desc: '',
    isNotSupport: true,
  },
  {
    name: 'COSH',
    params: [],
    desc: '',
    isNotSupport: true,
  },
  {
    name: 'EXP',
    params: [
      {
        name: 'numeric_expression',
      },
    ],
    desc:
      '返回 e 的 numeric_expression 次幂（e 为数学常量，e = 2.71828183... ）。',
  },
  {
    name: 'FLOOR',
    params: [
      {
        name: 'numeric_expression',
      },
    ],
    desc: '返回小于等于数值 numeric_expression 的最大整数。',
  },
  {
    name: 'LN',
    params: [
      {
        name: 'numeric_expression',
      },
    ],
    desc:
      '返回以 e 为底的 numeric_expression 的对数（e 为数学常量 e = 2.71828183...）。',
  },
  {
    name: 'LOG',
    params: [
      {
        name: 'x',
      },
      {
        name: 'y',
      },
    ],
    desc: '返回以 x 为底的 y 的对数。',
  },
  {
    name: 'MOD',
    params: [
      {
        name: 'x',
      },
      {
        name: 'y',
      },
    ],
    desc: '返回 x 除以 y 的余数。',
  },
  {
    name: 'POWER',
    params: [
      {
        name: 'x',
      },
      {
        name: 'y',
      },
    ],
    desc: '返回 x 的 y 次幂。',
  },
  {
    name: 'REMAINDER',
    params: [
      {
        name: 'x',
      },
      {
        name: 'y',
      },
    ],
    desc: '返回 x 除以 y 的余数。',
  },
  {
    name: 'ROUND',
    params: [
      {
        name: 'numeric',
      },
      {
        name: 'decimal',
      },
    ],
    desc: '返回参数 numeric 四舍五入后的值。',
  },
  {
    name: 'SIGN',
    params: [
      {
        name: 'n',
      },
    ],
    desc: '返回数字 n 的符号，大于 0 返回 1，小于 0 返回 -1 ，等于 0 返回 0。',
  },
  {
    name: 'SIN',
    params: [],
    desc: '',
    isNotSupport: true,
  },
  {
    name: 'SINH',
    params: [],
    desc: '',
    isNotSupport: true,
  },
  {
    name: 'SQRT',
    params: [
      {
        name: 'n',
      },
    ],
    desc: '返回 n 的平方根。',
  },
  {
    name: 'TAN',
    params: [],
    desc: '',
    isNotSupport: true,
  },
  {
    name: 'TANH',
    params: [],
    desc: '',
    isNotSupport: true,
  },
  {
    name: 'TRUNC',
    params: [
      {
        name: 'numberic',
      },
      {
        name: 'precision',
      },
    ],
    desc: '返回 numberic 按精度 precision 截取后的值。',
  },
  {
    name: 'WIDTH_BUCKET',
    params: [],
    desc: '',
    isNotSupport: true,
  },
  {
    name: 'CHR',
    params: [
      {
        name: 'n',
      },
    ],
    desc:
      '将 n 转换为等价的一个或多个字符返回，且返回值与当前系统的字符集相关。',
  },
  {
    name: 'CONCAT',
    params: [
      {
        name: 'c1',
      },
      {
        name: 'c2',
      },
    ],
    desc: '连接两个字符串。',
  },
  {
    name: 'INITCAP ',
    params: [
      {
        name: 'c1',
      },
    ],
    desc: '返回字符串并将字符串中每个单词的首字母大写，其他字母小写。',
  },
  {
    name: 'LOWER',
    params: [
      {
        name: 'c1',
      },
    ],
    desc: '将字符串全部转为小写。',
  },
  {
    name: 'LPAD ',
    params: [
      {
        name: 'c1',
      },
      {
        name: 'n',
      },
      {
        name: 'c2',
      },
    ],
    desc: '在字符串 c1 的左边用字符串 c2 填充，直到长度为 n 时为止。',
  },
  {
    name: 'LTRIM',
    params: [
      {
        name: 'c1',
      },
      {
        name: 'c2',
      },
    ],
    desc: '删除左边出现的字符串。',
  },
  {
    name: 'REGEXP_REPLACE',
    params: [
      {
        name: 'source_char',
      },
      {
        name: 'pattern',
      },
      {
        name: 'replace_string',
      },
      {
        name: 'position',
      },
      {
        name: 'occurrence',
      },
      {
        name: 'match_param',
      },
    ],
    desc: '正则表达式替换。',
  },
  {
    name: 'REGEXP_SUBSTR',
    params: [],
    desc: '',
    isNotSupport: true,
  },
  {
    name: 'REPLACE',
    params: [
      {
        name: 'c1',
      },
      {
        name: 'c2',
      },
      {
        name: 'c3',
      },
    ],
    desc: '将字符表达式值中，部分相同字符串，替换成新的字符串。',
  },
  {
    name: 'RPAD',
    params: [
      {
        name: 'c1',
      },
      {
        name: 'n',
      },
      {
        name: 'c2',
      },
    ],
    desc: '在字符串 c1 的右边用字符串 c2 填充，直到长度为 n 时为止。',
  },
  {
    name: 'RTRIM',
    params: [
      {
        name: 'c1',
      },
      {
        name: 'c2',
      },
    ],
    desc: '删除右边出现的字符串，此函数对于格式化查询的输出非常有用。',
  },
  {
    name: 'SUBSTR ',
    params: [
      {
        name: 'c1',
      },
      {
        name: 'n1',
      },
      {
        name: 'n2',
      },
    ],
    desc: '截取子字符串。其中多字节符（汉字、全角符等）按 1 个字符计算。',
  },
  {
    name: 'TRANSLATE',
    params: [
      {
        name: 'c1',
      },
      {
        name: 'c2',
      },
      {
        name: 'c3',
      },
    ],
    desc:
      '将字符表达式值中，指定字符替换为新字符。多字节符（汉字、全角符等），按 1 个字符计算。',
  },
  {
    name: 'TRIM ',
    body: 'TRIM(${1:trim_character} FROM ${2:trim_source})',
    desc: '删除一个字符串的开头或结尾（或两者）的字符。',
  },
  {
    name: 'UPPER',
    params: [
      {
        name: 'c1',
      },
    ],
    desc: '将字符串全部转为大写。',
  },
  {
    name: 'ASCII',
    params: [
      {
        name: 'x',
      },
    ],
    desc: '返回字符表达式最左端字符的 ASCII 码值。',
  },
  {
    name: 'INSTR',
    params: [
      {
        name: 'c1',
      },
      {
        name: 'c2',
      },
      {
        name: 'i',
      },
      {
        name: 'j',
      },
    ],
    desc: '在一个字符串中搜索指定的字符，返回发现指定的字符的位置。',
  },
  {
    name: 'LENGTH',
    params: [
      {
        name: 'c1',
      },
    ],
    desc: '返回字符串的长度。',
  },
  {
    name: 'REGEXP_COUNT',
    params: [],
    desc: '',
    isNotSupport: true,
  },
  {
    name: 'REGEXP_INSTR',
    params: [],
    desc: '',
    isNotSupport: true,
  },
  {
    name: 'ADD_MONTHS',
    params: [
      {
        name: 'date',
      },
      {
        name: 'n',
      },
    ],
    desc:
      '返回在日期 date 基础上 n 个月后的日期值，如果 n 的值为负数则返回日期 date 基础上 n 个月前的日期值（date 减去 n 个月）。',
  },
  {
    name: 'CURRENT_DATE',
    desc: '当前会话时区中的当前日期。',
  },
  {
    name: 'CURRENT_TIMESTAMP',
    params: [
      {
        name: 'precision',
      },
    ],
    desc:
      '返回 TIMESTAMP WITH TIME ZONE 数据类型的当前会话时区中的当前日期，返回值中包含当前的时区信息。',
  },
  {
    name: 'DBTIMEZONE',
    desc:
      '返回当前数据库实例的时区，在 OceanBase 中数据库时区恒为+00:00，且不支持修改。',
  },
  {
    name: 'EXTRACT',
    body: 'EXTRACT(${1:fields} FROM ${2:datetime})',
    desc: '从指定的时间字段或表达式中抽取年、月、日、时、分、秒等元素。',
  },
  {
    name: 'FROM_TZ',
    params: [
      {
        name: 'timestamp_value',
      },
      {
        name: 'timestamp_value',
      },
    ],
    desc:
      '将一个 TIMSTAMP 数据类型的值和时区信息拼成一个 TIMESTAMP WITH TIME ZONE 数据类型的时间值。',
  },
  {
    name: 'LAST_DAY',
    params: [
      {
        name: 'date',
      },
    ],
    desc: '返回日期 date 所在月份的最后一天的日期。',
  },
  {
    name: 'LOCALTIMESTAMP',
    params: [
      {
        name: 'timestamp_precision',
      },
    ],
    desc: '返回当前会话时区中的当前日期，返回 TIMESTAMP 数据类型的值。',
  },
  {
    name: 'MONTHS_BETWEEN ',
    params: [
      {
        name: 'date1',
      },
      {
        name: 'date2',
      },
    ],
    desc: '返回返回参数 date1 到 date2 之间的月数。',
  },
  {
    name: 'NEW_TIME',
    params: [],
    desc: '',
    isNotSupport: true,
  },
  {
    name: 'NEXT_DAY',
    params: [
      {
        name: 'd1',
      },
      {
        name: 'c1',
      },
    ],
    desc: '返回日期 d1 的下一周中 c1（星期值）所在的日期值。',
  },
  {
    name: 'NUMTODSINTERVAL',
    params: [
      {
        name: 'n',
      },
      {
        name: 'interval_unit',
      },
    ],
    desc:
      '把参数 n 转为以参数 interval_unit 为单位的 INTERVAL DAY TO SECOND 数据类型的值。',
  },
  {
    name: 'NUMTOYMINTERVAL',
    params: [
      {
        name: 'n',
      },
      {
        name: 'interval_unit',
      },
    ],
    desc:
      '把参数 n 转为以 interval_unit 为单位的 INTERVAL YEAR TO MONTH 数据类型的值。',
  },
  {
    name: 'ROUND',
    params: [
      {
        name: 'date',
      },
      {
        name: 'fmt',
      },
    ],
    desc: '返回以参数 fmt 为单位距离的离指定日期 date 最近的日期时间值。',
  },
  {
    name: 'SESSIONTIMEZONE',
    desc: '当前会话时区。',
  },
  {
    name: 'SYS_EXTRACT_UTC',
    params: [
      {
        name: 'datetime_with_timezone',
      },
    ],
    desc: '返回与指定时间相对应的标准 UTC 时间。',
  },
  {
    name: 'SYSDATE',
    desc: '当前日期。',
  },
  {
    name: 'SYSTIMESTAMP',
    desc: '系统当前日期，返回值的秒的小数位包含 6 位精度，且包含当前时区信息。',
  },
  {
    name: 'TO_CHAR',
    params: [
      {
        name: 'datetime',
      },
      {
        name: 'fmt',
      },
      {
        name: 'nlsparam',
      },
    ],
    desc:
      '将 DATE、TIMESTAMP、TIMESTAMP WITH TIME ZONE、TIMESTAMP WITH LOCAL TIME ZONE、INTERVAL DAY TO SECOND 和 INTERVAL YEAR TO MONTH 等数据类型的值按照参数 fmt 指定的格式转换为 VARCHAR2 数据类型的值。',
  },
  {
    name: 'TO_DSINTERVAL',
    params: [
      {
        name: 'n',
      },
    ],
    desc:
      '将一个 CHAR、VARCHAR2、NCHAR 或 NVARCHAR2 数据类型的字符串转换为一个 INTERVAL DAY TO SECOND 数据类型的值。',
  },
  {
    name: 'TO_TIMESTAMP',
    params: [
      {
        name: 'char',
      },
      {
        name: 'fmt',
      },
      {
        name: 'nlsparam',
      },
    ],
    desc: '将字符串转换为 TIMESTAMP 数据类型。',
  },
  {
    name: 'TO_TIMESTAMP_TZ ',
    params: [
      {
        name: 'char',
      },
      {
        name: 'fmt',
      },
      {
        name: 'nlsparam',
      },
    ],
    desc: '将字符串转换为 TIMESTAMP WITH TIME ZONE 数据类型，包含时区信息。',
  },
  {
    name: 'TO_YMINTERVAL',
    params: [
      {
        name: 'n',
      },
    ],
    desc:
      '将一个 CHAR、VARCHAR2、NCHAR 或 NVARCHAR2 数据类型的字符串转换为一个 INTERVAL YEAR TO MONTH 数据类型的值，该函数可以用来对一个日期时间值进行加减计算。',
  },
  {
    name: 'TRUNC',
    params: [
      {
        name: 'date',
      },
      {
        name: 'fmt',
      },
    ],
    desc:
      '返回以参数 fmt 为单位距离的离指定日期 date 最近的日期时间值，并且返回的日期值在 date 之前。',
  },
  {
    name: 'TZ_OFFSET',
    params: [
      {
        name: 'n',
      },
    ],
    desc:
      '返回时区 n 的时区偏移量。时区偏移量是指与格林尼治标准时间 GMT 的差（小时和分钟）。',
  },
  {
    name: 'GREATEST',
    params: [
      {
        name: 'expr',
      },
    ],
    desc: '返回一个或多个表达式列表中的最大值。',
  },
  {
    name: 'LEAST',
    params: [
      {
        name: 'expr',
      },
    ],
    desc: '返回一个或多个表达式列表中的最小值。',
  },
  {
    name: 'CAST',
    body: 'CAST(${1:expr} AS ${2:type_name})',
    desc: '将源数据类型的表达式显式转换为另一种数据类型。',
  },
  {
    name: 'ASCIISTR',
    params: [],
    desc: '',
    isNotSupport: true,
  },
  {
    name: 'BIN_TO_NUM',
    params: [],
    desc: '',
    isNotSupport: true,
  },
  {
    name: 'CHARTOROWID',
    params: [],
    desc: '',
    isNotSupport: true,
  },
  {
    name: 'HEXTORAW',
    params: [
      {
        name: 'char',
      },
    ],
    desc:
      '将 CHAR、VARCHAR2、NCHAR 或 NVARCHAR2 数据类型中包含十六进制数字的字符转换为 RAW 数据类型。',
  },
  {
    name: 'RAWTOHEX',
    params: [
      {
        name: 'raw',
      },
    ],
    desc: '将二进制数转换为一个相应的十六进制表示的字符串。',
  },
  {
    name: 'TO_BINARY_DOUBLE ',
    params: [
      {
        name: 'expr',
      },
      {
        name: 'fmt',
      },
      {
        name: 'nlsparam',
      },
    ],
    desc: '返回一个双精度的 64 位浮点数。',
  },
  {
    name: 'TO_BINARY_FLOAT',
    params: [
      {
        name: 'expr',
      },
      {
        name: 'fmt',
      },
      {
        name: 'nlsparam',
      },
    ],
    desc: '返回一个单精度的 32 位浮点数。',
  },
  {
    name: 'TO_CHAR',
    params: [
      {
        name: 'character',
      },
    ],
    desc: '将 NCHAR、NVARCHAR2 或 CLOB 数据转换为数据库字符集。',
  },
  {
    name: 'TO_DATE',
    params: [
      {
        name: 'char',
      },
      {
        name: 'fmt',
      },
      {
        name: 'nlsparam',
      },
    ],
    desc:
      '将 CHAR、VARCHAR、NCHAR 或 NVARCHAR2 数据类型的字符转换为日期数据类型的值。',
  },
  {
    name: 'TO_DSINTERVAL',
    params: [
      {
        name: 'n',
      },
    ],
    desc:
      '将一个 CHAR、VARCHAR2、NCHAR 或 NVARCHAR2 数据类型的字符串转换为一个 INTERVAL DAY TO SECOND 数据类型的值，该函数可以用来对一个日期时间值进行加减计算。',
  },
  {
    name: 'TO_NUMBER',
    params: [
      {
        name: 'char',
      },
      {
        name: 'fmt',
      },
      {
        name: 'nlsparam',
      },
    ],
    desc:
      '将 expr 转换为数值数据类型的值。expr 可以是 CHAR、VARCHAR2、NCHAR、NVARCHAR2、BINARY_FLOAT 或 BINARY_DOUBLE 数据类型的数值。',
  },
  {
    name: 'TO_TIMESTAMP',
    params: [
      {
        name: 'char',
      },
      {
        name: 'fmt',
      },
      {
        name: 'nlsparam',
      },
    ],
    desc: '将字符串转换为 TIMESTAMP 数据类型。',
  },
  {
    name: 'TO_TIMESTAMP_TZ',
    params: [
      {
        name: 'char',
      },
      {
        name: 'fmt',
      },
      {
        name: 'nlsparam',
      },
    ],
    desc: '将字符串转换为 TIMESTAMP WITH TIME ZONE 数据类型，包含时区信息。',
  },
  {
    name: 'TO_YMINTERVAL',
    params: [
      {
        name: 'n',
      },
    ],
    desc:
      '将一个 CHAR、VARCHAR2、NCHAR 或 NVARCHAR2 数据类型的字符串转换为一个 INTERVAL YEAR TO MONTH 数据类型的值，该函数可以用来对一个日期时间值进行加减计算。',
  },
  {
    name: 'DECODE',
    params: [
      {
        name: 'condition',
      },
      {
        name: 'search',
      },
      {
        name: 'result',
      },
    ],
    desc:
      '依次用参数 search 与 condition 做比较，直至 condition 与 search 的值相等，则返回对应 search 后跟随的参数 result 的值。如果没有 search 与 condition 相等，则返回参数 default 的值。',
  },
  {
    name: 'ORA_HASH',
    params: [
      {
        name: 'expr',
      },
      {
        name: 'max_bucket',
      },
      {
        name: 'seed_value',
      },
    ],
    desc: '获取对应表达式的 HASH 值。',
  },
  {
    name: 'VSIZE',
    params: [
      {
        name: 'x',
      },
    ],
    desc: '返回 x 的字节大小数。',
  },
  {
    name: 'COALESCE',
    params: [
      {
        name: 'expr1',
      },
      {
        name: 'expr1',
      },
    ],
    desc: '返回参数列表中第一个非空表达式，必须指定最少两个参数。',
  },
  {
    name: 'LNNVL',
    params: [
      {
        name: 'condition',
      },
    ],
    desc: '判断条件中的一个或者两个操作数是否为 NULL',
  },
  {
    name: 'NULLIF',
    params: [],
    desc: '',
    isNotSupport: true,
  },
  {
    name: 'NVL',
    params: [
      {
        name: 'expr1',
      },
      {
        name: 'expr2',
      },
    ],
    desc: '返回一个非 NULL 值',
  },
  {
    name: 'NVL2 ',
    params: [
      {
        name: 'expr1',
      },
      {
        name: 'expr2',
      },
      {
        name: 'expr3',
      },
    ],
    desc: '根据表达式是否为空，返回不同的值。',
  },
];
/**
 * 聚合函数
 */
const aggregateFunctions: IFunction[] = [
  {
    name: 'AVG',
    params: [
      {
        name: 'expr',
      },
    ],
    desc: '返回数值列的平均值。',
  },
  {
    name: 'COUNT',
    params: [
      {
        name: 'expr',
      },
    ],
    desc: '查询 expr 的行数。',
  },
  {
    name: 'SUM',
    params: [
      {
        name: 'expr',
      },
    ],
    desc: '返回参数中指定列的和。',
  },
  {
    name: 'GROUPING',
    params: [],
    desc: '',
    isNotSupport: true,
  },
  {
    name: 'MAX',
    params: [
      {
        name: 'expr',
      },
    ],
    desc: '返回参数中指定的列中的最大值。',
  },
  {
    name: 'MIN',
    params: [
      {
        name: 'expr',
      },
    ],
    desc: '返回参数中指定列的最小值。',
  },
  {
    name: 'LISTAGG',
    body:
      'LISTAGG (${1:measure_expr}) WITHIN GROUP (ORDER BY ${2: expr}) OVER ${3:query_partition_clause}',
    desc:
      '用于列转行，LISTAGG 对 ORDER BY 子句中指定的每个组内的数据进行排序，然后合并度量列的值。',
  },
  {
    name: 'ROLLUP',
    params: [
      {
        name: 'col1',
      },
    ],
    desc:
      '在数据统计和报表生成过程中，它可以为每个分组返回一个小计，同时为所有分组返回总计。',
  },
  {
    name: 'STDDEV',
    params: [
      {
        name: 'expr',
      },
    ],
    desc: '计算总体标准差。',
  },
  {
    name: 'STDDEV_POP',
    params: [
      {
        name: 'expr',
      },
    ],
    desc: '计算总体标准差。',
  },
  {
    name: 'STDDEV_SAMP',
    params: [
      {
        name: 'expr',
      },
    ],
    desc: '计算样本标准差。',
  },
  {
    name: 'VARIANCE',
    params: [
      {
        name: 'expr',
      },
    ],
    desc: '返回参数指定列的方差。',
  },
  {
    name: 'APPROX_COUNT_DISTINCT ',
    params: [
      {
        name: 'expr',
      },
    ],
    desc:
      '对某一列去重后的行数进行计算，结果只能返回一个值，且该值是近似值，该函数可以进一步用于计算被引用的列的选择性。',
  },
];

/**
 * 分析函数
 */
const analyticFunctions: IFunction[] = [];

const functions: IFunction[] = singleRowFunctions
  .concat(aggregateFunctions)
  .concat(analyticFunctions);

export default functions;
