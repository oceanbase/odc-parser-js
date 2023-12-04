// Generated from PLParser.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by PLParser.
function PLParserListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

PLParserListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
PLParserListener.prototype.constructor = PLParserListener;

// Enter a parse tree produced by PLParser#stmt_block.
PLParserListener.prototype.enterStmt_block = function(ctx) {
};

// Exit a parse tree produced by PLParser#stmt_block.
PLParserListener.prototype.exitStmt_block = function(ctx) {
};


// Enter a parse tree produced by PLParser#stmt_list.
PLParserListener.prototype.enterStmt_list = function(ctx) {
};

// Exit a parse tree produced by PLParser#stmt_list.
PLParserListener.prototype.exitStmt_list = function(ctx) {
};


// Enter a parse tree produced by PLParser#stmt.
PLParserListener.prototype.enterStmt = function(ctx) {
};

// Exit a parse tree produced by PLParser#stmt.
PLParserListener.prototype.exitStmt = function(ctx) {
};


// Enter a parse tree produced by PLParser#outer_stmt.
PLParserListener.prototype.enterOuter_stmt = function(ctx) {
};

// Exit a parse tree produced by PLParser#outer_stmt.
PLParserListener.prototype.exitOuter_stmt = function(ctx) {
};


// Enter a parse tree produced by PLParser#sql_keyword.
PLParserListener.prototype.enterSql_keyword = function(ctx) {
};

// Exit a parse tree produced by PLParser#sql_keyword.
PLParserListener.prototype.exitSql_keyword = function(ctx) {
};


// Enter a parse tree produced by PLParser#sql_stmt.
PLParserListener.prototype.enterSql_stmt = function(ctx) {
};

// Exit a parse tree produced by PLParser#sql_stmt.
PLParserListener.prototype.exitSql_stmt = function(ctx) {
};


// Enter a parse tree produced by PLParser#do_sp_stmt.
PLParserListener.prototype.enterDo_sp_stmt = function(ctx) {
};

// Exit a parse tree produced by PLParser#do_sp_stmt.
PLParserListener.prototype.exitDo_sp_stmt = function(ctx) {
};


// Enter a parse tree produced by PLParser#call_sp_stmt.
PLParserListener.prototype.enterCall_sp_stmt = function(ctx) {
};

// Exit a parse tree produced by PLParser#call_sp_stmt.
PLParserListener.prototype.exitCall_sp_stmt = function(ctx) {
};


// Enter a parse tree produced by PLParser#opt_sp_cparams.
PLParserListener.prototype.enterOpt_sp_cparams = function(ctx) {
};

// Exit a parse tree produced by PLParser#opt_sp_cparams.
PLParserListener.prototype.exitOpt_sp_cparams = function(ctx) {
};


// Enter a parse tree produced by PLParser#opt_cexpr.
PLParserListener.prototype.enterOpt_cexpr = function(ctx) {
};

// Exit a parse tree produced by PLParser#opt_cexpr.
PLParserListener.prototype.exitOpt_cexpr = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_name.
PLParserListener.prototype.enterSp_name = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_name.
PLParserListener.prototype.exitSp_name = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_call_name.
PLParserListener.prototype.enterSp_call_name = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_call_name.
PLParserListener.prototype.exitSp_call_name = function(ctx) {
};


// Enter a parse tree produced by PLParser#ident.
PLParserListener.prototype.enterIdent = function(ctx) {
};

// Exit a parse tree produced by PLParser#ident.
PLParserListener.prototype.exitIdent = function(ctx) {
};


// Enter a parse tree produced by PLParser#create_procedure_stmt.
PLParserListener.prototype.enterCreate_procedure_stmt = function(ctx) {
};

// Exit a parse tree produced by PLParser#create_procedure_stmt.
PLParserListener.prototype.exitCreate_procedure_stmt = function(ctx) {
};


// Enter a parse tree produced by PLParser#create_function_stmt.
PLParserListener.prototype.enterCreate_function_stmt = function(ctx) {
};

// Exit a parse tree produced by PLParser#create_function_stmt.
PLParserListener.prototype.exitCreate_function_stmt = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_param_list.
PLParserListener.prototype.enterSp_param_list = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_param_list.
PLParserListener.prototype.exitSp_param_list = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_param.
PLParserListener.prototype.enterSp_param = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_param.
PLParserListener.prototype.exitSp_param = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_fparam_list.
PLParserListener.prototype.enterSp_fparam_list = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_fparam_list.
PLParserListener.prototype.exitSp_fparam_list = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_fparam.
PLParserListener.prototype.enterSp_fparam = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_fparam.
PLParserListener.prototype.exitSp_fparam = function(ctx) {
};


// Enter a parse tree produced by PLParser#param_type.
PLParserListener.prototype.enterParam_type = function(ctx) {
};

// Exit a parse tree produced by PLParser#param_type.
PLParserListener.prototype.exitParam_type = function(ctx) {
};


// Enter a parse tree produced by PLParser#simple_ident.
PLParserListener.prototype.enterSimple_ident = function(ctx) {
};

// Exit a parse tree produced by PLParser#simple_ident.
PLParserListener.prototype.exitSimple_ident = function(ctx) {
};


// Enter a parse tree produced by PLParser#opt_sp_create_chistics.
PLParserListener.prototype.enterOpt_sp_create_chistics = function(ctx) {
};

// Exit a parse tree produced by PLParser#opt_sp_create_chistics.
PLParserListener.prototype.exitOpt_sp_create_chistics = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_create_chistic.
PLParserListener.prototype.enterSp_create_chistic = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_create_chistic.
PLParserListener.prototype.exitSp_create_chistic = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_chistic.
PLParserListener.prototype.enterSp_chistic = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_chistic.
PLParserListener.prototype.exitSp_chistic = function(ctx) {
};


// Enter a parse tree produced by PLParser#procedure_body.
PLParserListener.prototype.enterProcedure_body = function(ctx) {
};

// Exit a parse tree produced by PLParser#procedure_body.
PLParserListener.prototype.exitProcedure_body = function(ctx) {
};


// Enter a parse tree produced by PLParser#function_body.
PLParserListener.prototype.enterFunction_body = function(ctx) {
};

// Exit a parse tree produced by PLParser#function_body.
PLParserListener.prototype.exitFunction_body = function(ctx) {
};


// Enter a parse tree produced by PLParser#alter_procedure_stmt.
PLParserListener.prototype.enterAlter_procedure_stmt = function(ctx) {
};

// Exit a parse tree produced by PLParser#alter_procedure_stmt.
PLParserListener.prototype.exitAlter_procedure_stmt = function(ctx) {
};


// Enter a parse tree produced by PLParser#alter_function_stmt.
PLParserListener.prototype.enterAlter_function_stmt = function(ctx) {
};

// Exit a parse tree produced by PLParser#alter_function_stmt.
PLParserListener.prototype.exitAlter_function_stmt = function(ctx) {
};


// Enter a parse tree produced by PLParser#opt_sp_alter_chistics.
PLParserListener.prototype.enterOpt_sp_alter_chistics = function(ctx) {
};

// Exit a parse tree produced by PLParser#opt_sp_alter_chistics.
PLParserListener.prototype.exitOpt_sp_alter_chistics = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_proc_stmt.
PLParserListener.prototype.enterSp_proc_stmt = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_proc_stmt.
PLParserListener.prototype.exitSp_proc_stmt = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_proc_outer_statement.
PLParserListener.prototype.enterSp_proc_outer_statement = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_proc_outer_statement.
PLParserListener.prototype.exitSp_proc_outer_statement = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_proc_inner_statement.
PLParserListener.prototype.enterSp_proc_inner_statement = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_proc_inner_statement.
PLParserListener.prototype.exitSp_proc_inner_statement = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_proc_independent_statement.
PLParserListener.prototype.enterSp_proc_independent_statement = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_proc_independent_statement.
PLParserListener.prototype.exitSp_proc_independent_statement = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_proc_stmt_if.
PLParserListener.prototype.enterSp_proc_stmt_if = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_proc_stmt_if.
PLParserListener.prototype.exitSp_proc_stmt_if = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_if.
PLParserListener.prototype.enterSp_if = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_if.
PLParserListener.prototype.exitSp_if = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_proc_stmt_case.
PLParserListener.prototype.enterSp_proc_stmt_case = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_proc_stmt_case.
PLParserListener.prototype.exitSp_proc_stmt_case = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_when_list.
PLParserListener.prototype.enterSp_when_list = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_when_list.
PLParserListener.prototype.exitSp_when_list = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_when.
PLParserListener.prototype.enterSp_when = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_when.
PLParserListener.prototype.exitSp_when = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_unlabeled_block.
PLParserListener.prototype.enterSp_unlabeled_block = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_unlabeled_block.
PLParserListener.prototype.exitSp_unlabeled_block = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_block_content.
PLParserListener.prototype.enterSp_block_content = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_block_content.
PLParserListener.prototype.exitSp_block_content = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_labeled_block.
PLParserListener.prototype.enterSp_labeled_block = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_labeled_block.
PLParserListener.prototype.exitSp_labeled_block = function(ctx) {
};


// Enter a parse tree produced by PLParser#label_ident.
PLParserListener.prototype.enterLabel_ident = function(ctx) {
};

// Exit a parse tree produced by PLParser#label_ident.
PLParserListener.prototype.exitLabel_ident = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_proc_stmts.
PLParserListener.prototype.enterSp_proc_stmts = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_proc_stmts.
PLParserListener.prototype.exitSp_proc_stmts = function(ctx) {
};


// Enter a parse tree produced by PLParser#opt_sp_decls.
PLParserListener.prototype.enterOpt_sp_decls = function(ctx) {
};

// Exit a parse tree produced by PLParser#opt_sp_decls.
PLParserListener.prototype.exitOpt_sp_decls = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_decl.
PLParserListener.prototype.enterSp_decl = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_decl.
PLParserListener.prototype.exitSp_decl = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_handler_type.
PLParserListener.prototype.enterSp_handler_type = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_handler_type.
PLParserListener.prototype.exitSp_handler_type = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_hcond_list.
PLParserListener.prototype.enterSp_hcond_list = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_hcond_list.
PLParserListener.prototype.exitSp_hcond_list = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_hcond.
PLParserListener.prototype.enterSp_hcond = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_hcond.
PLParserListener.prototype.exitSp_hcond = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_cond.
PLParserListener.prototype.enterSp_cond = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_cond.
PLParserListener.prototype.exitSp_cond = function(ctx) {
};


// Enter a parse tree produced by PLParser#sqlstate.
PLParserListener.prototype.enterSqlstate = function(ctx) {
};

// Exit a parse tree produced by PLParser#sqlstate.
PLParserListener.prototype.exitSqlstate = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_proc_stmt_open.
PLParserListener.prototype.enterSp_proc_stmt_open = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_proc_stmt_open.
PLParserListener.prototype.exitSp_proc_stmt_open = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_proc_stmt_close.
PLParserListener.prototype.enterSp_proc_stmt_close = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_proc_stmt_close.
PLParserListener.prototype.exitSp_proc_stmt_close = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_proc_stmt_fetch.
PLParserListener.prototype.enterSp_proc_stmt_fetch = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_proc_stmt_fetch.
PLParserListener.prototype.exitSp_proc_stmt_fetch = function(ctx) {
};


// Enter a parse tree produced by PLParser#into_clause.
PLParserListener.prototype.enterInto_clause = function(ctx) {
};

// Exit a parse tree produced by PLParser#into_clause.
PLParserListener.prototype.exitInto_clause = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_decl_idents.
PLParserListener.prototype.enterSp_decl_idents = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_decl_idents.
PLParserListener.prototype.exitSp_decl_idents = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_data_type.
PLParserListener.prototype.enterSp_data_type = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_data_type.
PLParserListener.prototype.exitSp_data_type = function(ctx) {
};


// Enter a parse tree produced by PLParser#expr_list.
PLParserListener.prototype.enterExpr_list = function(ctx) {
};

// Exit a parse tree produced by PLParser#expr_list.
PLParserListener.prototype.exitExpr_list = function(ctx) {
};


// Enter a parse tree produced by PLParser#expr.
PLParserListener.prototype.enterExpr = function(ctx) {
};

// Exit a parse tree produced by PLParser#expr.
PLParserListener.prototype.exitExpr = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_unlabeled_control.
PLParserListener.prototype.enterSp_unlabeled_control = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_unlabeled_control.
PLParserListener.prototype.exitSp_unlabeled_control = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_labeled_control.
PLParserListener.prototype.enterSp_labeled_control = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_labeled_control.
PLParserListener.prototype.exitSp_labeled_control = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_proc_stmt_return.
PLParserListener.prototype.enterSp_proc_stmt_return = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_proc_stmt_return.
PLParserListener.prototype.exitSp_proc_stmt_return = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_proc_stmt_iterate.
PLParserListener.prototype.enterSp_proc_stmt_iterate = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_proc_stmt_iterate.
PLParserListener.prototype.exitSp_proc_stmt_iterate = function(ctx) {
};


// Enter a parse tree produced by PLParser#sp_proc_stmt_leave.
PLParserListener.prototype.enterSp_proc_stmt_leave = function(ctx) {
};

// Exit a parse tree produced by PLParser#sp_proc_stmt_leave.
PLParserListener.prototype.exitSp_proc_stmt_leave = function(ctx) {
};


// Enter a parse tree produced by PLParser#drop_procedure_stmt.
PLParserListener.prototype.enterDrop_procedure_stmt = function(ctx) {
};

// Exit a parse tree produced by PLParser#drop_procedure_stmt.
PLParserListener.prototype.exitDrop_procedure_stmt = function(ctx) {
};


// Enter a parse tree produced by PLParser#drop_function_stmt.
PLParserListener.prototype.enterDrop_function_stmt = function(ctx) {
};

// Exit a parse tree produced by PLParser#drop_function_stmt.
PLParserListener.prototype.exitDrop_function_stmt = function(ctx) {
};


// Enter a parse tree produced by PLParser#scalar_data_type.
PLParserListener.prototype.enterScalar_data_type = function(ctx) {
};

// Exit a parse tree produced by PLParser#scalar_data_type.
PLParserListener.prototype.exitScalar_data_type = function(ctx) {
};


// Enter a parse tree produced by PLParser#int_type_i.
PLParserListener.prototype.enterInt_type_i = function(ctx) {
};

// Exit a parse tree produced by PLParser#int_type_i.
PLParserListener.prototype.exitInt_type_i = function(ctx) {
};


// Enter a parse tree produced by PLParser#float_type_i.
PLParserListener.prototype.enterFloat_type_i = function(ctx) {
};

// Exit a parse tree produced by PLParser#float_type_i.
PLParserListener.prototype.exitFloat_type_i = function(ctx) {
};


// Enter a parse tree produced by PLParser#datetime_type_i.
PLParserListener.prototype.enterDatetime_type_i = function(ctx) {
};

// Exit a parse tree produced by PLParser#datetime_type_i.
PLParserListener.prototype.exitDatetime_type_i = function(ctx) {
};


// Enter a parse tree produced by PLParser#date_year_type_i.
PLParserListener.prototype.enterDate_year_type_i = function(ctx) {
};

// Exit a parse tree produced by PLParser#date_year_type_i.
PLParserListener.prototype.exitDate_year_type_i = function(ctx) {
};


// Enter a parse tree produced by PLParser#number_literal.
PLParserListener.prototype.enterNumber_literal = function(ctx) {
};

// Exit a parse tree produced by PLParser#number_literal.
PLParserListener.prototype.exitNumber_literal = function(ctx) {
};


// Enter a parse tree produced by PLParser#literal.
PLParserListener.prototype.enterLiteral = function(ctx) {
};

// Exit a parse tree produced by PLParser#literal.
PLParserListener.prototype.exitLiteral = function(ctx) {
};


// Enter a parse tree produced by PLParser#string_length_i.
PLParserListener.prototype.enterString_length_i = function(ctx) {
};

// Exit a parse tree produced by PLParser#string_length_i.
PLParserListener.prototype.exitString_length_i = function(ctx) {
};


// Enter a parse tree produced by PLParser#string_list.
PLParserListener.prototype.enterString_list = function(ctx) {
};

// Exit a parse tree produced by PLParser#string_list.
PLParserListener.prototype.exitString_list = function(ctx) {
};


// Enter a parse tree produced by PLParser#text_string.
PLParserListener.prototype.enterText_string = function(ctx) {
};

// Exit a parse tree produced by PLParser#text_string.
PLParserListener.prototype.exitText_string = function(ctx) {
};


// Enter a parse tree produced by PLParser#collation_name.
PLParserListener.prototype.enterCollation_name = function(ctx) {
};

// Exit a parse tree produced by PLParser#collation_name.
PLParserListener.prototype.exitCollation_name = function(ctx) {
};


// Enter a parse tree produced by PLParser#charset_name.
PLParserListener.prototype.enterCharset_name = function(ctx) {
};

// Exit a parse tree produced by PLParser#charset_name.
PLParserListener.prototype.exitCharset_name = function(ctx) {
};


// Enter a parse tree produced by PLParser#charset_key.
PLParserListener.prototype.enterCharset_key = function(ctx) {
};

// Exit a parse tree produced by PLParser#charset_key.
PLParserListener.prototype.exitCharset_key = function(ctx) {
};


// Enter a parse tree produced by PLParser#collation.
PLParserListener.prototype.enterCollation = function(ctx) {
};

// Exit a parse tree produced by PLParser#collation.
PLParserListener.prototype.exitCollation = function(ctx) {
};


// Enter a parse tree produced by PLParser#signal_stmt.
PLParserListener.prototype.enterSignal_stmt = function(ctx) {
};

// Exit a parse tree produced by PLParser#signal_stmt.
PLParserListener.prototype.exitSignal_stmt = function(ctx) {
};


// Enter a parse tree produced by PLParser#resignal_stmt.
PLParserListener.prototype.enterResignal_stmt = function(ctx) {
};

// Exit a parse tree produced by PLParser#resignal_stmt.
PLParserListener.prototype.exitResignal_stmt = function(ctx) {
};


// Enter a parse tree produced by PLParser#signal_value.
PLParserListener.prototype.enterSignal_value = function(ctx) {
};

// Exit a parse tree produced by PLParser#signal_value.
PLParserListener.prototype.exitSignal_value = function(ctx) {
};


// Enter a parse tree produced by PLParser#signal_information_item_list.
PLParserListener.prototype.enterSignal_information_item_list = function(ctx) {
};

// Exit a parse tree produced by PLParser#signal_information_item_list.
PLParserListener.prototype.exitSignal_information_item_list = function(ctx) {
};


// Enter a parse tree produced by PLParser#signal_information_item.
PLParserListener.prototype.enterSignal_information_item = function(ctx) {
};

// Exit a parse tree produced by PLParser#signal_information_item.
PLParserListener.prototype.exitSignal_information_item = function(ctx) {
};


// Enter a parse tree produced by PLParser#signal_allowed_expr.
PLParserListener.prototype.enterSignal_allowed_expr = function(ctx) {
};

// Exit a parse tree produced by PLParser#signal_allowed_expr.
PLParserListener.prototype.exitSignal_allowed_expr = function(ctx) {
};


// Enter a parse tree produced by PLParser#variable.
PLParserListener.prototype.enterVariable = function(ctx) {
};

// Exit a parse tree produced by PLParser#variable.
PLParserListener.prototype.exitVariable = function(ctx) {
};


// Enter a parse tree produced by PLParser#scond_info_item_name.
PLParserListener.prototype.enterScond_info_item_name = function(ctx) {
};

// Exit a parse tree produced by PLParser#scond_info_item_name.
PLParserListener.prototype.exitScond_info_item_name = function(ctx) {
};


// Enter a parse tree produced by PLParser#empty.
PLParserListener.prototype.enterEmpty = function(ctx) {
};

// Exit a parse tree produced by PLParser#empty.
PLParserListener.prototype.exitEmpty = function(ctx) {
};



exports.PLParserListener = PLParserListener;