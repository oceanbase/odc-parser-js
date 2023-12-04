// Generated from PLParser.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by PLParser.

function PLParserVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

PLParserVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
PLParserVisitor.prototype.constructor = PLParserVisitor;

// Visit a parse tree produced by PLParser#stmt_block.
PLParserVisitor.prototype.visitStmt_block = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#stmt_list.
PLParserVisitor.prototype.visitStmt_list = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#stmt.
PLParserVisitor.prototype.visitStmt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#outer_stmt.
PLParserVisitor.prototype.visitOuter_stmt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sql_keyword.
PLParserVisitor.prototype.visitSql_keyword = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sql_stmt.
PLParserVisitor.prototype.visitSql_stmt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#do_sp_stmt.
PLParserVisitor.prototype.visitDo_sp_stmt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#call_sp_stmt.
PLParserVisitor.prototype.visitCall_sp_stmt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#opt_sp_cparams.
PLParserVisitor.prototype.visitOpt_sp_cparams = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#opt_cexpr.
PLParserVisitor.prototype.visitOpt_cexpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_name.
PLParserVisitor.prototype.visitSp_name = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_call_name.
PLParserVisitor.prototype.visitSp_call_name = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#ident.
PLParserVisitor.prototype.visitIdent = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#create_procedure_stmt.
PLParserVisitor.prototype.visitCreate_procedure_stmt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#create_function_stmt.
PLParserVisitor.prototype.visitCreate_function_stmt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_param_list.
PLParserVisitor.prototype.visitSp_param_list = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_param.
PLParserVisitor.prototype.visitSp_param = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_fparam_list.
PLParserVisitor.prototype.visitSp_fparam_list = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_fparam.
PLParserVisitor.prototype.visitSp_fparam = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#param_type.
PLParserVisitor.prototype.visitParam_type = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#simple_ident.
PLParserVisitor.prototype.visitSimple_ident = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#opt_sp_create_chistics.
PLParserVisitor.prototype.visitOpt_sp_create_chistics = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_create_chistic.
PLParserVisitor.prototype.visitSp_create_chistic = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_chistic.
PLParserVisitor.prototype.visitSp_chistic = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#procedure_body.
PLParserVisitor.prototype.visitProcedure_body = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#function_body.
PLParserVisitor.prototype.visitFunction_body = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#alter_procedure_stmt.
PLParserVisitor.prototype.visitAlter_procedure_stmt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#alter_function_stmt.
PLParserVisitor.prototype.visitAlter_function_stmt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#opt_sp_alter_chistics.
PLParserVisitor.prototype.visitOpt_sp_alter_chistics = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_proc_stmt.
PLParserVisitor.prototype.visitSp_proc_stmt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_proc_outer_statement.
PLParserVisitor.prototype.visitSp_proc_outer_statement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_proc_inner_statement.
PLParserVisitor.prototype.visitSp_proc_inner_statement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_proc_independent_statement.
PLParserVisitor.prototype.visitSp_proc_independent_statement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_proc_stmt_if.
PLParserVisitor.prototype.visitSp_proc_stmt_if = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_if.
PLParserVisitor.prototype.visitSp_if = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_proc_stmt_case.
PLParserVisitor.prototype.visitSp_proc_stmt_case = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_when_list.
PLParserVisitor.prototype.visitSp_when_list = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_when.
PLParserVisitor.prototype.visitSp_when = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_unlabeled_block.
PLParserVisitor.prototype.visitSp_unlabeled_block = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_block_content.
PLParserVisitor.prototype.visitSp_block_content = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_labeled_block.
PLParserVisitor.prototype.visitSp_labeled_block = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#label_ident.
PLParserVisitor.prototype.visitLabel_ident = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_proc_stmts.
PLParserVisitor.prototype.visitSp_proc_stmts = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#opt_sp_decls.
PLParserVisitor.prototype.visitOpt_sp_decls = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_decl.
PLParserVisitor.prototype.visitSp_decl = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_handler_type.
PLParserVisitor.prototype.visitSp_handler_type = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_hcond_list.
PLParserVisitor.prototype.visitSp_hcond_list = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_hcond.
PLParserVisitor.prototype.visitSp_hcond = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_cond.
PLParserVisitor.prototype.visitSp_cond = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sqlstate.
PLParserVisitor.prototype.visitSqlstate = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_proc_stmt_open.
PLParserVisitor.prototype.visitSp_proc_stmt_open = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_proc_stmt_close.
PLParserVisitor.prototype.visitSp_proc_stmt_close = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_proc_stmt_fetch.
PLParserVisitor.prototype.visitSp_proc_stmt_fetch = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#into_clause.
PLParserVisitor.prototype.visitInto_clause = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_decl_idents.
PLParserVisitor.prototype.visitSp_decl_idents = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_data_type.
PLParserVisitor.prototype.visitSp_data_type = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#expr_list.
PLParserVisitor.prototype.visitExpr_list = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#expr.
PLParserVisitor.prototype.visitExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_unlabeled_control.
PLParserVisitor.prototype.visitSp_unlabeled_control = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_labeled_control.
PLParserVisitor.prototype.visitSp_labeled_control = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_proc_stmt_return.
PLParserVisitor.prototype.visitSp_proc_stmt_return = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_proc_stmt_iterate.
PLParserVisitor.prototype.visitSp_proc_stmt_iterate = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#sp_proc_stmt_leave.
PLParserVisitor.prototype.visitSp_proc_stmt_leave = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#drop_procedure_stmt.
PLParserVisitor.prototype.visitDrop_procedure_stmt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#drop_function_stmt.
PLParserVisitor.prototype.visitDrop_function_stmt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#scalar_data_type.
PLParserVisitor.prototype.visitScalar_data_type = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#int_type_i.
PLParserVisitor.prototype.visitInt_type_i = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#float_type_i.
PLParserVisitor.prototype.visitFloat_type_i = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#datetime_type_i.
PLParserVisitor.prototype.visitDatetime_type_i = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#date_year_type_i.
PLParserVisitor.prototype.visitDate_year_type_i = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#number_literal.
PLParserVisitor.prototype.visitNumber_literal = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#literal.
PLParserVisitor.prototype.visitLiteral = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#string_length_i.
PLParserVisitor.prototype.visitString_length_i = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#string_list.
PLParserVisitor.prototype.visitString_list = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#text_string.
PLParserVisitor.prototype.visitText_string = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#collation_name.
PLParserVisitor.prototype.visitCollation_name = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#charset_name.
PLParserVisitor.prototype.visitCharset_name = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#charset_key.
PLParserVisitor.prototype.visitCharset_key = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#collation.
PLParserVisitor.prototype.visitCollation = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#signal_stmt.
PLParserVisitor.prototype.visitSignal_stmt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#resignal_stmt.
PLParserVisitor.prototype.visitResignal_stmt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#signal_value.
PLParserVisitor.prototype.visitSignal_value = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#signal_information_item_list.
PLParserVisitor.prototype.visitSignal_information_item_list = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#signal_information_item.
PLParserVisitor.prototype.visitSignal_information_item = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#signal_allowed_expr.
PLParserVisitor.prototype.visitSignal_allowed_expr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#variable.
PLParserVisitor.prototype.visitVariable = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#scond_info_item_name.
PLParserVisitor.prototype.visitScond_info_item_name = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PLParser#empty.
PLParserVisitor.prototype.visitEmpty = function(ctx) {
  return this.visitChildren(ctx);
};



exports.PLParserVisitor = PLParserVisitor;