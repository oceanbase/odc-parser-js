import { IFunction } from "../../type";

/**
 * 单行函数
 */
const singleRowFunctions: IFunction[] = [
  // 日期函数
  {
    name: 'CURDATE',
    params: [],
    desc: '返回当前日期，不含时间部分。',
  },
  {
    name: 'CURRENT_DATE',
    params: [],
    desc: '返回当前日期，不含时间部分。',
  },
  {
    name: 'CURRENT_TIME',
    params: [
      {
        name: 'scale',
      },
    ],
    desc: '返回当前时间，不含日期部分。',
  },
  {
    name: 'CURRENT_TIMESTAMP',
    params: [
      {
        name: 'scale',
      },
    ],
    desc: '返回当前日期时间，考虑时区设置。',
  },
  {
    name: 'CURTIME',
    params: [],
    desc: '返回当前时间，不含日期部分。',
  },
  {
    name: 'DATE_ADD',
    params: [
      {
        name: 'date',
      },
      {
        name: 'INTERVAL',
      },
    ],
    desc: '日期时间的算术计算。',
  },
  {
    name: 'DATE_FORMAT',
    params: [
      {
        name: 'date',
      },
      {
        name: 'format',
      },
    ],
    desc: '将日期时间以指定格式输出。',
  },
  {
    name: 'DATE_SUB',
    params: [
      {
        name: 'date',
      },
      {
        name: 'INTERVAL',
      },
    ],
    desc: '日期时间的算术计算。',
  },
  {
    name: 'DATEDIFF',
    params: [
      {
        name: 'date1',
      },
      {
        name: 'date2',
      },
    ],
    desc: '返回 date1 和 date2 之间的天数。',
  },
  {
    name: 'EXTRACT',
    body: 'EXTRACT(${1:unit} FROM ${2:date})',
    desc: '以整数类型返回 date 的指定部分值。',
  },
  {
    name: 'FROM_DAYS',
    params: [
      {
        name: 'N',
      },
    ],
    desc: '返回指定天数 N 对应的 DATE 值。',
  },
  {
    name: 'FROM_UNIXTIME',
    params: [
      {
        name: 'unix_timestamp',
      },
      {
        name: 'format',
      },
    ],
    desc: '返回指定格式的日期时间字符串。',
  },
  {
    name: 'MONTH',
    params: [
      {
        name: 'date',
      },
    ],
    desc: '返回 date 的月份信息。',
  },
  {
    name: 'NOW',
    params: [
      {
        name: 'scale',
      },
    ],
    desc: '返回当前日期时间，考虑时区设置。',
  },
  {
    name: 'PERIOD_DIFF',
    params: [
      {
        name: 'p1',
      },
      {
        name: 'p2',
      },
    ],
    desc: '以月份位单位返回两个日期之间的间隔。',
  },
  {
    name: 'STR_TO_DATE',
    params: [
      {
        name: 'str',
      },
      {
        name: 'format',
      },
    ],
    desc: '使用 format 将 str 转换为 DATETIME 值、DATE 值、或 TIME 值。',
  },
  {
    name: 'TIME',
    params: [
      {
        name: 'datetime',
      },
    ],
    desc: '以 TIME 类型返回 datetime 的时间信息。',
  },
  {
    name: 'TIME_TO_USEC',
    params: [
      {
        name: 'date',
      },
    ],
    desc:
      '将 date 值转换为距离 1970-01-01 00:00:00.000000 的微秒数，考虑时区信息。',
  },
  {
    name: 'TIMEDIFF',
    params: [
      {
        name: 'date1',
      },
      {
        name: 'date2',
      },
    ],
    desc: '以 TIME 类型返回两个日期时间的时间间隔。',
  },
  {
    name: 'TIMESTAMPDIFF',
    params: [
      {
        name: 'unit',
      },
      {
        name: 'date1',
      },
      {
        name: 'date2',
      },
    ],
    desc: '以 unit 为单位返回两个日期时间的间隔。',
  },
  {
    name: 'TIMESTAMPADD',
    params: [
      {
        name: 'unit',
      },
      {
        name: 'interval_expr',
      },
      {
        name: 'date',
      },
    ],
    desc: '日期时间的算术计算。',
  },
  {
    name: 'TO_DAYS',
    params: [
      {
        name: 'date',
      },
    ],
    desc: '返回指定 date 值对应的天数。',
  },
  {
    name: 'USEC_TO_TIME',
    params: [
      {
        name: 'usec',
      },
    ],
    desc: '将 usec 值转换为 TIMESTAMP 类型值。',
  },
  {
    name: 'UNIX_TIMESTAMP',
    params: [
      {
        name: 'date',
      },
    ],
    desc: "返回指定时间距离 '1970-01-01 00:00:00' 的秒数，考虑时区。",
  },
  {
    name: 'UTC_TIMESTAMP',
    params: [],
    desc: '返回当前 UTC 时间。',
  },
  {
    name: 'YEAR',
    params: [
      {
        name: 'date',
      },
    ],
    desc: '返回 date 值的年份信息。',
  },
  // 字符串函数
  {
    name: 'CONCAT',
    params: [
      {
        name: 'str',
      },
    ],
    desc: '把多个字符串连接成一个字符串。',
  },
  {
    name: 'CONCAT_WS',
    params: [
      {
        name: 'separator',
      },
      {
        name: 'str',
      },
    ],
    desc: '把多个字符串连接成一个字符串，相邻字符串间使用 separator 分隔。',
  },
  {
    name: 'FORMAT',
    params: [
      {
        name: 'x',
      },
      {
        name: 'd',
      },
    ],
    desc:
      '把数字 X 格式化为“#,###,###.##”格式，四舍五入到 D 位小数，并以字符串形式返回结果（如果整数部分超过三位，会用“,”作为千分位分隔符）。',
  },
  {
    name: 'SUBSTR',
    params: [
      {
        name: 'str',
      },
      {
        name: 'pos',
      },
    ],
    desc: '返回 str 的子字符串，起始位置为 pos，长度为 len。',
  },
  {
    name: 'SUBSTRING',
    params: [
      {
        name: 'str',
      },
      {
        name: 'pos',
      },
    ],
    desc: '返回 str 的子字符串，起始位置为 pos，长度为 len。',
  },
  {
    name: 'TRIM',
    params: [
      {
        name: 'x',
      },
    ],
    desc: '删除字符串所有前缀和/或后缀，默认为 BOTH。',
  },
  {
    name: 'LTRIM',
    params: [
      {
        name: 'str',
      },
    ],
    desc: '删除字符串左侧的空格。',
  },
  {
    name: 'RTRIM',
    params: [
      {
        name: 'str',
      },
    ],
    desc: '删除字符串右侧的空格。',
  },
  {
    name: 'ASCII',
    params: [
      {
        name: 'str',
      },
    ],
    desc: '返回字符串最左侧字符的 ASCII 码。',
  },
  {
    name: 'ORD',
    params: [
      {
        name: 'str',
      },
    ],
    desc: '返回字符串最左侧字符的字符码。',
  },
  {
    name: 'LENGTH',
    params: [
      {
        name: 'str',
      },
    ],
    desc: '返回 str 的字节长度。',
  },
  {
    name: 'CHAR_LENGTH',
    params: [
      {
        name: 'str',
      },
    ],
    desc: '返回字符串包含的字符数。',
  },
  {
    name: 'UPPER',
    params: [
      {
        name: 'str',
      },
    ],
    desc: '将字符串中的小写字母转化为大写字母。',
  },
  {
    name: 'LOWER',
    params: [
      {
        name: 'str',
      },
    ],
    desc: '将字符串中的大写字母转化为小写字母。',
  },
  {
    name: 'HEX',
    params: [
      {
        name: 'str',
      },
    ],
    desc: '将数字或字符串转化为十六进制字符串。',
  },
  {
    name: 'UNHEX',
    params: [
      {
        name: 'str',
      },
    ],
    desc: '将十六进制字符串转化为正常字符串。',
  },
  {
    name: 'MD5',
    params: [
      {
        name: 'str',
      },
    ],
    desc: '返回字符串的 MD5 值。',
  },
  {
    name: 'INT2IP',
    params: [
      {
        name: 'int_value',
      },
    ],
    desc: '将整数内码转换成 IP 地址。',
  },
  {
    name: 'IP2INT',
    params: [
      {
        name: 'ip_addr',
      },
    ],
    desc: '将 IP 地址转换成整数内码。',
  },
  {
    name: 'LIKE',
    body: 'LIKE ${1:str}',
    desc: '字符串通配符匹配。',
  },
  {
    name: 'REGEXP',
    body: 'REGEXP ${1:str}',
    desc: '正则匹配。',
  },
  {
    name: 'REPEAT',
    params: [
      {
        name: 'str',
      },
      {
        name: 'count',
      },
    ],
    desc: '返回 str 重复 count 次组成的字符串。',
  },
  {
    name: 'SPACE',
    params: [
      {
        name: 'N',
      },
    ],
    desc: '返回包含 N 个空格的字符串。',
  },
  {
    name: 'SUBSTRING_INDEX',
    params: [
      {
        name: 'str',
      },
      {
        name: 'delim',
      },
      {
        name: 'count',
      },
    ],
    desc: '在定界符 delim 以及 count 出现前，从字符串 str 返回字符串。',
  },
  {
    name: 'LOCATE',
    params: [
      {
        name: 'substr',
      },
      {
        name: 'str',
      },
    ],
    desc: '第一个语法返回字符串 str 中子字符串 substr 的第一个出现位置。',
  },
  {
    name: 'POSITION',
    params: [
      {
        name: 'substr',
      },
      {
        name: 'str',
      },
    ],
    desc: '第一个语法返回字符串 str 中子字符串 substr 的第一个出现位置。',
  },
  {
    name: 'INSTR',
    params: [
      {
        name: 'str',
      },
      {
        name: 'substr',
      },
    ],
    desc: '返回字符串 str 中子字符串的第一个出现位置。',
  },
  {
    name: 'REPLACE',
    params: [
      {
        name: 'str',
      },
      {
        name: 'from_str',
      },
      {
        name: 'to_str',
      },
    ],
    desc: '返回字符串 str 以及所有被字符 to_str 替代的字符串 from_str。',
  },
  {
    name: 'FIELD',
    params: [
      {
        name: 'str',
      },
    ],
    desc:
      '返回参数 str 在 str1, str2, str3,… 列表中的索引位置（从 1 开始的位置）。',
  },
  {
    name: 'ELT',
    params: [
      {
        name: 'N',
      },
      {
        name: 'str',
      },
    ],
    desc: '若 N=1，则返回值为 str1；若 N=2，则返回值为 str2；以此类推。',
  },
  {
    name: 'INSERT',
    params: [
      {
        name: 'str1',
      },
      {
        name: 'pos',
      },
      {
        name: 'len',
      },
      {
        name: 'str2',
      },
    ],
    desc:
      '返回字符串 str1，字符串中起始于 pos 位置，长度为 len 的子字符串将被 str2 取代。',
  },
  {
    name: 'LPAD',
    params: [
      {
        name: 'str',
      },
      {
        name: 'len',
      },
      {
        name: 'padstr',
      },
    ],
    desc: '用指定字符串 padstr，在左侧填充字符串 str 到指定长度 len。',
  },
  {
    name: 'RPAD',
    params: [
      {
        name: 'str',
      },
      {
        name: 'len',
      },
      {
        name: 'padstr',
      },
    ],
    desc: '用指定字符串 padstr，在右侧填充字符串 str 到指定长度 len。',
  },
  {
    name: 'UUID',
    params: [],
    desc: '生成一个全局唯一 ID。',
  },
  {
    name: 'BIN',
    params: [
      {
        name: 'N',
      },
    ],
    desc: '返回数字 N 的二进制形式。',
  },
  {
    name: 'QUOTE',
    params: [
      {
        name: 'str',
      },
    ],
    desc: '引用一个字符串以产生一个结果可以作为 SQL 语句中正确地转义数据值。',
  },
  {
    name: 'REGEXP_SUBSTR',
    params: [
      {
        name: 'str',
      },
      {
        name: 'pattern',
      },
    ],
    desc: '在 str 中搜索匹配正则表达式 pattern 的子串，子串不存在返回 NULL。',
  },
  // 转换函数
  {
    name: 'CAST',
    body: 'CAST(${1:expr} AS ${2:type})',
    desc: '将某种数据类型的表达式显式转换为另一种数据类型。',
  },
  // 数学函数
  {
    name: 'ROUND',
    params: [
      {
        name: 'X',
      },
    ],
    desc: '返回一个数值，四舍五入到指定的长度或精度。',
  },
  {
    name: 'CEIL',
    params: [
      {
        name: 'expr',
      },
    ],
    desc: '返回大于或者等于指定表达式的最小整数。',
  },
  {
    name: 'FLOOR',
    params: [
      {
        name: 'expr',
      },
    ],
    desc: '返回小于或者等于指定表达式的最大整数。',
  },
  {
    name: 'ABS',
    params: [
      {
        name: 'expr',
      },
    ],
    desc:
      '绝对值函数，求表达式绝对值，函数返回值类型与数值表达式的数据类型相同。',
  },
  {
    name: 'NEG',
    params: [
      {
        name: 'expr',
      },
    ],
    desc:
      '求补函数，对操作数执行求补运算：用零减去操作数，然后结果返回操作数。',
  },
  {
    name: 'SIGN',
    params: [
      {
        name: 'X',
      },
    ],
    desc:
      'SIGN(X) 返回参数作为 -1、 0 或 1 的符号，该符号取决于 X 的值为负、零或正。',
  },
  {
    name: 'CONV',
    params: [
      {
        name: 'N',
      },
      {
        name: 'from_base',
      },
      {
        name: 'to_base',
      },
    ],
    desc: '不同数基间转换数字。',
  },
  {
    name: 'MOD',
    params: [
      {
        name: 'N',
      },
      {
        name: 'M',
      },
    ],
    desc: '取余函数。',
  },
  {
    name: 'POW',
    params: [
      {
        name: 'X',
      },
      {
        name: 'Y',
      },
    ],
    desc: '返回 X 的 Y 次方。',
  },
  {
    name: 'POWER',
    params: [
      {
        name: 'X',
      },
      {
        name: 'Y',
      },
    ],
    desc: '返回 X 的 Y 次方。',
  },
  {
    name: 'RAND',
    params: [
      {
        name: 'value1',
      },
    ],
    desc:
      'RAND([N]) 函数接受 0 个或者 1 个参数（N 被称为随机数种子），返回一个范围是 [0,1.0) 的随机浮点数。',
  },
  // 比较函数
  {
    name: 'GREATEST',
    params: [
      {
        name: 'value1',
      },
    ],
    desc: '返回参数的最大值，和函数 LEAST() 相对。',
  },
  {
    name: 'LEAST',
    params: [
      {
        name: 'value1',
      },
    ],
    desc: '返回参数的最小值，和函数 GREATEST() 相对。',
  },
  {
    name: 'ISNULL',
    params: [
      {
        name: 'expr',
      },
    ],
    desc: '如果参数 expr 为 NULL，那么 ISNULL() 的返回值为 1，否则返回值为 0。',
  },
  // 流程控制函数
  {
    name: 'IF',
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
    desc:
      '如果 expr1 的值为 TRUE（即：expr1<>0 且 expr1<>NULL），返回结果为 expr2；否则返回结果为 expr3。',
  },
  {
    name: 'IFNULL',
    params: [
      {
        name: 'expr1',
      },
      {
        name: 'expr2',
      },
    ],
    desc:
      '假设 expr1 不为 NULL，则 IFNULL() 的返回值为 expr1；否则其返回值为 expr2。',
  },
  {
    name: 'NULLIF',
    params: [
      {
        name: 'expr1',
      },
      {
        name: 'expr2',
      },
    ],
    desc: '如果 expr1 = expr2 成立，那么返回值为 NULL，否则返回值为 expr1。',
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
    desc: '该函数返回 SELECT 语句检索到的行中非 NULL 值的数目。',
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
    name: 'GROUP_CONCAT',
    params: [
      {
        name: 'expr',
      },
    ],
    desc: '返回带有来自一个组的连接的非 NULL 值的字符串结果。',
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
];

/**
 * 分析函数
 */
const analyticFunctions: IFunction[] = [];

/**
 * 信息函数
 */

const informationFunctions: IFunction[] = [
  {
    name: 'FOUND_ROWS',
    params: [],
    desc:
      '一个 SELECT 语句可能包含一个 LIMIT 子句，用来限制数据库服务器端返回客户端的行数。在某些情况下，我们需要不再次运行该语句而得知在没有 LIMIT 时到底该语句返回了多少行。我们可以在 SELECT 语句中选择使用 SQL_CALC_FOUND_ROWS，然后调用 FOUND_ROWS() 函数，获取该语句在没有 LIMIT 时返回的行数。',
  },
  {
    name: 'LAST_INSERT_ID',
    params: [],
    desc:
      '返回本 SESSION 最后一次插入的自增字段值，如最近一条 INSERT 插入多条记录，LAST_INSERT_ID() 返回第一条记录的自增字段值。',
  },
];

/**
 * 其他函数
 */

const otherFunctions: IFunction[] = [
  {
    name: 'COALESCE',
    params: [
      {
        name: 'expr',
      },
    ],
    desc: '依次参考各参数表达式，遇到非 NULL 值即停止并返回该值。',
  },
  {
    name: 'NVL',
    params: [
      {
        name: 'str1',
      },
      {
        name: 'replace_with',
      },
    ],
    desc: '如果 str1 为 NULL，则替换成 replace_with。',
  },
  {
    name: 'MATCH',
    body: 'MATCH (${1:cols}) AGAINST (${2:expr})',
    desc: '全文查找函数',
  },
];

const functions: IFunction[] = singleRowFunctions
  .concat(aggregateFunctions)
  .concat(analyticFunctions)
  .concat(informationFunctions)
  .concat(otherFunctions);

export default functions;
