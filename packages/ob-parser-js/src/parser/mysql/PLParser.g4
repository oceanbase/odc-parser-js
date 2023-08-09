parser grammar PLParser;


options { tokenVocab=PLLexer; }


// start rule: null
@parser::header {
const OBLexer = require('./OBLexer')     // You may modify this to import your OBLexer
const OBParser = require('./OBParser')   // You may modify this to import your OBParser
}
@parser::members {
PLParser.prototype.expr2endTokens = {
    "sql_stmt": new Set([PLParser.DELIMITER]),
    "opt_cexpr": new Set([PLParser.Comma, PLParser.RightParen]),
    "expr": new Set([PLParser.INTO, PLParser.USING, PLParser.WHEN, PLParser.THEN, PLParser.DELIMITER,
        PLParser.LIMIT, PLParser.Comma, PLParser.END_KEY, PLParser.DO]),

}
class PLErrorListener extends antlr4.error.ErrorListener {
    syntaxError(recognizer, offendingSymbol, line, column, msg, err) {
        // console.error("line " + line + ":" + column + " " + msg);
        if (err != null) {
            throw err;
        }
    }
}

PLParser.prototype.addMoreLAT = function(text, exprName) {
    let leftParenCount = 0;
    let rightParenCount = 0;
    let inSingleQuote = false;
    let inDoubleQuote = false;
	let inEscape = false;
    for (let i = 0; i < text.length; i++) {
    	const c = text[i];
        if (inEscape) {
            inEscape = false;
            continue;
        }
        if (c === '\\' && (inDoubleQuote || inSingleQuote)) {
            inEscape = true;
            continue;
        }
        if (c === '\'' && !inDoubleQuote) {
            inSingleQuote = !inSingleQuote;
        }
        if (c === '"' && !inSingleQuote) {
            inDoubleQuote = !inDoubleQuote;
        }
        if (!inSingleQuote && !inDoubleQuote && c === '(') {
            leftParenCount++;
        } else if (!inSingleQuote && !inDoubleQuote && c === ')') {
            rightParenCount++;
        }
    }
    // Refer from obpl_oracle_read_sql_construct in pl_parser_oracle_mode.y
    const endTokens = this.expr2endTokens[exprName]
    let isBreak = leftParenCount === rightParenCount;
    while (!isBreak) {
        // get the next lookahead token
        const _la = this._input.LA(1);
        if (_la === PLParser.EOF) {
            isBreak = true;
            break;
        }
        if (leftParenCount === rightParenCount && endTokens.has(_la)) {
            isBreak = true;
            break;
        } else if (_la === PLParser.LeftParen) {
            leftParenCount++;
        } else if (_la === PLParser.RightParen) {
            rightParenCount++;
        }
        text += this._input.LT(1).text;
        // match and consume the current lookahead token
        this._errHandler.reportMatch(this);
        this.consume();
    }
    return text;
}

function PLReportError(recognizer, e) {
    this.beginErrorCondition(recognizer);
    if (e instanceof antlr4.error.NoViableAltException) {
        this.reportNoViableAlternative(recognizer, e);
    } else if (e instanceof antlr4.error.InputMismatchException) {
        this.reportInputMismatch(recognizer, e);
    } else if (e instanceof antlr4.error.FailedPredicateException) {
        this.reportFailedPredicate(recognizer, e);
    } else {
        console.log("unknown recognition error type: " + e.constructor.name);
        console.log(e.stack);
        recognizer.notifyErrorListeners(e.getOffendingToken(), e.getMessage(), e);
    }
}

function PLRecoverInline(recognizer) {
    throw new antlr4.error.InputMismatchException(recognizer);
}

PLParser.prototype.ForwardSQL = function(ctx, exprName) {
    if (this._skipSQLParser) {
		return;
	}
    let text = this._input.getText(new antlr4.Interval(ctx.start, this._input.LT(-1)));
    text = this.addMoreLAT(text, exprName);
    const chars = new antlr4.InputStream(text);
    const lexer = new OBLexer.OBLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new OBParser.OBParser(tokens);
    parser.removeErrorListeners();
    parser.addErrorListener(new PLErrorListener());
    parser._errHandler.reportError = PLReportError;
    parser._errHandler.recoverInline = PLRecoverInline;
    parser.is_pl_parse_ = true;
    parser.is_pl_parse_expr_ = false;
    while(ctx.getChildCount() !== 0) {
        ctx.removeLastChild();
    }
    ctx.addChild(parser.forward_sql_stmt());
}


PLParser.prototype.ForwardExpr = function(ctx, exprName) {
    if (this._skipSQLParser) {
		return;
	}
    let text = this._input.getText(new antlr4.Interval(ctx.start, this._input.LT(-1)));
    if (text.length === 0) {
        return;
    }
    text = this.addMoreLAT(text, exprName);
    const chars = new antlr4.InputStream(text);
    const lexer = new OBLexer.OBLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new OBParser.OBParser(tokens);
    parser.removeErrorListeners();
    parser.addErrorListener(new PLErrorListener());
    parser._errHandler.reportError = PLReportError;
    parser._errHandler.recoverInline = PLRecoverInline;
    parser.is_pl_parse_ = true;
    parser.is_pl_parse_expr_ = true;
    while(ctx.getChildCount() !== 0) {
        ctx.removeLastChild();
    }
    ctx.addChild(parser.forward_expr());
}
}

stmt_block
    : stmt_list EOF
    ;

stmt_list
    : stmt (DELIMITER stmt)*
    ;

stmt
    : outer_stmt?
    ;

outer_stmt
    : create_procedure_stmt
    | create_function_stmt
    | drop_procedure_stmt
    | drop_function_stmt
    | alter_procedure_stmt
    | alter_function_stmt
    | sql_stmt
    | call_sp_stmt
    | do_sp_stmt
    | signal_stmt
    | resignal_stmt
    ;

sql_keyword
    : SQL_KEYWORD
    | TABLE
    ;

sql_stmt
    : sql_keyword (~(DELIMITER))*?{this.ForwardSQL($ctx, "sql_stmt");}
    | CREATE sql_keyword (~(DELIMITER))*?{this.ForwardSQL($ctx, "sql_stmt");}
    | DROP sql_keyword (~(DELIMITER))*?{this.ForwardSQL($ctx, "sql_stmt");}
    | ALTER sql_keyword (~(DELIMITER))*?{this.ForwardSQL($ctx, "sql_stmt");}
    | SET (~(DELIMITER))*?{this.ForwardSQL($ctx, "sql_stmt");}
    | COMMIT
    | ROLLBACK
    | SELECT (~(DELIMITER))*?{this.ForwardSQL($ctx, "sql_stmt");}
    | LeftParen SELECT (~(DELIMITER))*?{this.ForwardSQL($ctx, "sql_stmt");}
    ;

do_sp_stmt
    : DO expr_list
    | DO sp_unlabeled_block
    | DD sp_unlabeled_block
    | DO sp_proc_stmt_open
    | DO sp_proc_stmt_fetch
    | DO sp_proc_stmt_close
    ;

call_sp_stmt
    : CALL sp_call_name (LeftParen opt_sp_cparams RightParen)?
    | CALL sp_proc_stmt
    ;

opt_sp_cparams
    : opt_cexpr (Comma opt_cexpr)*
    ;

opt_cexpr
    : (~(DELIMITER))*?{this.ForwardExpr($ctx, "opt_cexpr");}
    ;

sp_name
    : ident (Dot ident)?
    ;

sp_call_name
    : ident Dot ident (Dot ident)?
    | ident
    ;

ident
    : IDENT
    ;

create_procedure_stmt
    : CREATE ((DEFINER Equal STRING) | (DEFINER Equal IDENT) | (DEFINER Equal CURRENT_USER))? PROCEDURE sp_name LeftParen sp_param_list? RightParen (opt_sp_create_chistics sp_create_chistic)? procedure_body
    ;

create_function_stmt
    : CREATE ((DEFINER Equal STRING) | (DEFINER Equal IDENT) | (DEFINER Equal CURRENT_USER))? FUNCTION sp_name LeftParen sp_fparam_list? RightParen RETURNS sp_data_type (opt_sp_create_chistics sp_create_chistic)? function_body
    ;

sp_param_list
    : sp_param (Comma sp_param)*
    ;

sp_param
    : (IN | OUT | INOUT)? ident param_type
    ;

sp_fparam_list
    : sp_fparam (Comma sp_fparam)*
    ;

sp_fparam
    : ident param_type
    ;

param_type
    : sp_data_type
    ;

simple_ident
    : IDENT
    | (IDENT Dot|Dot?) IDENT Dot IDENT
    ;

opt_sp_create_chistics
    : empty
    | opt_sp_create_chistics sp_create_chistic
    ;

sp_create_chistic
    : sp_chistic
    | NOT? DETERMINISTIC
    ;

sp_chistic
    : COMMENT STRING
    | LANGUAGE SQL
    | NO SQL
    | CONTAINS SQL
    | (MODIFIES|READS) SQL DATA
    | SQL SECURITY (DEFINER|INVOKER)
    ;

procedure_body
    : sp_proc_stmt
    ;

function_body
    : sp_proc_independent_statement
    ;

alter_procedure_stmt
    : ALTER PROCEDURE sp_name (opt_sp_alter_chistics sp_chistic)?
    ;

alter_function_stmt
    : ALTER FUNCTION sp_name (opt_sp_alter_chistics sp_chistic)?
    ;

opt_sp_alter_chistics
    : empty
    | opt_sp_alter_chistics sp_chistic
    ;

sp_proc_stmt
    : sp_proc_outer_statement
    | sp_proc_inner_statement
    ;

sp_proc_outer_statement
    : outer_stmt
    ;

sp_proc_inner_statement
    : sp_proc_independent_statement
    | sp_proc_stmt_iterate
    | sp_proc_stmt_leave
    | sp_proc_stmt_open
    | sp_proc_stmt_fetch
    | sp_proc_stmt_close
    ;

sp_proc_independent_statement
    : sp_proc_stmt_if
    | sp_proc_stmt_case
    | sp_unlabeled_block
    | sp_labeled_block
    | sp_unlabeled_control
    | sp_labeled_control
    | sp_proc_stmt_return
    ;

sp_proc_stmt_if
    : IF sp_if END_KEY IF
    ;

sp_if
    : expr THEN sp_proc_stmts ((ELSEIF sp_if) | (ELSE sp_proc_stmts))?
    ;

sp_proc_stmt_case
    : CASE expr sp_when_list ((ELSEIF sp_if) | (ELSE sp_proc_stmts))? END_KEY CASE
    ;

sp_when_list
    : sp_when+
    ;

sp_when
    : WHEN expr THEN sp_proc_stmts
    ;

sp_unlabeled_block
    : sp_block_content
    ;

sp_block_content
    : BEGIN_KEY (opt_sp_decls sp_decl DELIMITER)? sp_proc_stmts? END_KEY
    ;

sp_labeled_block
    : label_ident Colon sp_block_content label_ident?
    ;

label_ident
    : ident
    ;

sp_proc_stmts
    : sp_proc_stmt DELIMITER
    | sp_proc_stmts sp_proc_stmt DELIMITER
    ;

opt_sp_decls
    : empty
    | opt_sp_decls sp_decl DELIMITER
    ;

sp_decl
    : DECLARE sp_decl_idents sp_data_type (DEFAULT expr)?
    | DECLARE IDENT CONDITION FOR sp_cond
    | DECLARE sp_handler_type HANDLER FOR sp_hcond_list sp_proc_stmt
    | DECLARE IDENT CURSOR FOR sql_stmt
    ;

sp_handler_type
    : EXIT
    | CONTINUE
    ;

sp_hcond_list
    : sp_hcond (Comma sp_hcond)*
    ;

sp_hcond
    : sp_cond
    | IDENT
    | SQLWARNING
    | NOT FOUND
    | SQLEXCEPTION
    ;

sp_cond
    : number_literal
    | sqlstate
    ;

sqlstate
    : SQLSTATE VALUE? STRING
    ;

sp_proc_stmt_open
    : OPEN IDENT
    ;

sp_proc_stmt_close
    : CLOSE IDENT
    ;

sp_proc_stmt_fetch
    : FETCH (FROM?|NEXT FROM) IDENT into_clause
    ;

into_clause
    : INTO expr_list
    ;

sp_decl_idents
    : ident (Comma ident)*
    ;

sp_data_type
    : scalar_data_type
    ;

expr_list
    : expr (Comma expr)*
    ;

expr
    : (~(DELIMITER))*?{this.ForwardExpr($ctx, "expr");}
    ;

sp_unlabeled_control
    : LOOP sp_proc_stmts END_KEY LOOP
    | WHILE expr DO sp_proc_stmts END_KEY WHILE
    | REPEAT sp_proc_stmts UNTIL expr END_KEY REPEAT
    ;

sp_labeled_control
    : label_ident Colon sp_unlabeled_control label_ident?
    ;

sp_proc_stmt_return
    : RETURN expr
    ;

sp_proc_stmt_iterate
    : ITERATE label_ident
    ;

sp_proc_stmt_leave
    : LEAVE label_ident
    ;

drop_procedure_stmt
    : DROP PROCEDURE (IF EXISTS)? sp_name
    ;

drop_function_stmt
    : DROP FUNCTION (IF EXISTS)? sp_name
    ;

scalar_data_type
    : int_type_i (LeftParen INTNUM RightParen)? (UNSIGNED | SIGNED)? ZEROFILL?
    | float_type_i ((LeftParen INTNUM Comma INTNUM RightParen) | (LeftParen INTNUM RightParen))? (UNSIGNED | SIGNED)? ZEROFILL?
    | NUMBER ((LeftParen INTNUM Comma INTNUM RightParen) | (LeftParen INTNUM RightParen))? (UNSIGNED | SIGNED)? ZEROFILL?
    | datetime_type_i (LeftParen INTNUM RightParen)?
    | date_year_type_i
    | CHARACTER string_length_i? BINARY? (charset_key charset_name)? collation?
    | VARCHAR string_length_i BINARY? (charset_key charset_name)? collation?
    | BINARY string_length_i?
    | VARBINARY string_length_i
    | STRING
    | BIT (LeftParen INTNUM RightParen)?
    | BOOL
    | BOOLEAN
    | ENUM LeftParen string_list RightParen BINARY? (charset_key charset_name)? collation?
    | SET LeftParen string_list RightParen BINARY? (charset_key charset_name)? collation?
    ;

int_type_i
    : TINYINT
    | SMALLINT
    | MEDIUMINT
    | INTEGER
    | BIGINT
    ;

float_type_i
    : FLOAT
    | DOUBLE PRECISION?
    ;

datetime_type_i
    : DATETIME
    | TIMESTAMP
    | TIME
    ;

date_year_type_i
    : DATE
    | YEAR (LeftParen INTNUM RightParen)?
    ;

number_literal
    : INTNUM
    | DECIMAL_VAL
    ;

literal
    : number_literal
    | DATE_VALUE
    | HEX_STRING_VALUE
    | NULLX
    ;

string_length_i
    : LeftParen number_literal RightParen
    ;

string_list
    : text_string (Comma text_string)*
    ;

text_string
    : STRING
    | HEX_STRING_VALUE
    ;

collation_name
    : IDENT
    | STRING
    ;

charset_name
    : IDENT
    | STRING
    | BINARY
    ;

charset_key
    : CHARSET
    | CHARACTER SET
    ;

collation
    : COLLATE collation_name
    ;

signal_stmt
    : SIGNAL signal_value (SET signal_information_item_list)?
    ;

resignal_stmt
    : RESIGNAL signal_value? (SET signal_information_item_list)?
    ;

signal_value
    : IDENT
    | sqlstate
    ;

signal_information_item_list
    : signal_information_item (Comma signal_information_item)*
    ;

signal_information_item
    : scond_info_item_name Equal signal_allowed_expr
    ;

signal_allowed_expr
    : literal
    | variable
    | simple_ident
    ;

variable
    : SYSTEM_VARIABLE
    | USER_VARIABLE
    ;

scond_info_item_name
    : CLASS_ORIGIN
    | SUBCLASS_ORIGIN
    | CONSTRAINT_CATALOG
    | CONSTRAINT_SCHEMA
    | CONSTRAINT_NAME
    | CATALOG_NAME
    | SCHEMA_NAME
    | TABLE_NAME
    | COLUMN_NAME
    | CURSOR_NAME
    | MESSAGE_TEXT
    | MYSQL_ERRNO
    ;

empty
    : 
    ;


