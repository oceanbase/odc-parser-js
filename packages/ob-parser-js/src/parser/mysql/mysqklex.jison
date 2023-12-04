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
'*=' { return "MULT_ASSIGN"; }
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

%start root

%%