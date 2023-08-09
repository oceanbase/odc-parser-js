create or replace TRIGGER TRIGGER1
  BEFORE UPDATE OF "NAME" OR INSERT OR DELETE
  ON "TABLE_FOR_TRIGGER"
  REFERENCING NEW AS NEW OLD AS OLD
  FOR EACH ROW ENABLE
  declare var_tag varchar2(20);  --声明一个变量，存储对dept表执行的操作类
  begin
  if inserting then  --当触发事件是insert时
  var_tag:='插入';   --标识插入操作
  INSERT INTO TRIGGER_LOG(operation,new_id,new_name) VALUES (var_tag,:NEW.ID,:NEW.NAME);
  elsif updating then  --当触发事件是update时
  var_tag:='修改';  --标识修改操作
  INSERT INTO TRIGGER_LOG VALUES (var_tag,:OLD.ID,:NEW.ID,:OLD.NAME,:NEW.NAME);
  elsif deleting then  --当触发事件是delete时
  var_tag:='删除';  --标识删除操作
  INSERT INTO TRIGGER_LOG(operation,old_id,old_name) VALUES (var_tag,:OLD.ID,:OLD.NAME);
  end if;
  END;/
CREATE OR REPLACE PROCEDURE "RISKCONFIG"."P_ABN_STOCK_E"
  (
   "I_MARKET_NO" IN CHAR, "I_STOCK_CODE" IN VARCHAR2, "I_BEGIN_DATE" IN CHAR, "I_END_DATE" IN CHAR, "I_ABN_BEGIN_DATE" IN CHAR, "I_ABN_END_DATE" IN CHAR, "I_SS_TYPE" IN VARCHAR2, "I_USER_CODE" IN CHAR, "I_REMARK" IN CHAR, "I_OP_FLAG" IN VARCHAR2, "I_PK_ID" IN VARCHAR2, "O_RETURN_MSG" OUT VARCHAR2, "O_RETURN_CODE" OUT INTEGER
  ) IS
  V_OP_OBJECT  VARCHAR2(50) DEFAULT 'P_ABN_STOCK_E'; -- '操作对象';
    V_ERROR_MSG  VARCHAR2(200); --返回信息
    V_ERROR_CODE INTEGER;
    --===================================================================================
    -------------------------------------------------------------------------------------
    --业务变量
    V_IF_EXIST INTEGER;
    --===================================================================================
    -- 业务处理过程
    --=====================================================================================

    --------------------------业务逻辑开始-----------------------------
  BEGIN
    O_RETURN_CODE := 0;
    O_RETURN_MSG  := '执行成功';
    --新增
    IF I_OP_FLAG = '1' THEN
      SELECT COUNT(1)
        INTO V_IF_EXIST
        FROM RISKCONFIG.T_SPECIALSTOCK A
       WHERE A.SS_TYPE = I_SS_TYPE
         AND NOT (I_ABN_BEGIN_DATE > A.ABN_END_DATE OR
              I_ABN_END_DATE < A.ABN_BEGIN_DATE)
         AND A.MARKET_NO = I_MARKET_NO
         AND A.STOCK_CODE = I_STOCK_CODE;

       IF V_IF_EXIST > 0 THEN O_RETURN_CODE := -1;
      O_RETURN_MSG := '该证券的异常波动信息已存在！';
      RETURN;
    END IF;

    INSERT INTO RISKCONFIG.T_SPECIALSTOCK
      (SS_TYPE,
       MARKET_NO,
       STOCK_CODE,
       BEGIN_DATE,
       END_DATE,
       SET_OPER,
       SET_TIME,
       REMARK,
       ABN_BEGIN_DATE,
       ABN_END_DATE)
      SELECT I_SS_TYPE,
             I_MARKET_NO,
             I_STOCK_CODE,
             I_BEGIN_DATE,
             I_END_DATE,
             I_USER_CODE,
             SYSDATE,
             I_REMARK,
             I_ABN_BEGIN_DATE,
             I_ABN_END_DATE
        FROM DUAL;

     --插入流水表数据
    INSERT INTO RISKCONFIG.T_SPECIALSTOCKJOUR(SERIAL_NO,
                                              OCCUR_DATE,
                                              OCCUR_TIME,
                                              OPER_TYPE,
                                              OPER_CODE,
                                              MARKET_NO,
                                              STOCK_CODE,
                                              BEGIN_DATE,
                                              END_DATE,
                                              REMARK,
                                              SS_TYPE,
                                              ABN_BEGIN_DATE,
                                              ABN_END_DATE)
      SELECT RISKCONFIG.SEQ_SPECIALSTOCKJOUR.NEXTVAL,
             TO_CHAR(SYSDATE, 'YYYYMMDD'),
             SUBSTR(TO_CHAR(SYSDATE, 'YYYYMMDD hh24:mi;ss'), 10, 8),
             '1', --新增
             I_USER_CODE,
             I_MARKET_NO,
             I_STOCK_CODE,
             I_BEGIN_DATE,
             I_END_DATE,
             I_REMARK,
             I_SS_TYPE,
             I_ABN_BEGIN_DATE,
             I_ABN_END_DATE
        FROM DUAL;
  END IF;

    --修改
  IF I_OP_FLAG = '2' THEN
    UPDATE RISKCONFIG.T_SPECIALSTOCK T
    SET
        T.BEGIN_DATE = I_BEGIN_DATE,
        T.END_DATE = I_END_DATE,
        T.ABN_BEGIN_DATE = I_ABN_BEGIN_DATE,
        T.ABN_END_DATE = I_ABN_END_DATE,
        T.REMARK = I_REMARK
        WHERE T.PK_ID = I_PK_ID;


    --插入流水表数据
    INSERT INTO RISKCONFIG.T_SPECIALSTOCKJOUR(SERIAL_NO,
                                              OCCUR_DATE,
                                              OCCUR_TIME,
                                              OPER_TYPE,
                                              OPER_CODE,
                                              MARKET_NO,
                                              STOCK_CODE,
                                              BEGIN_DATE,
                                              END_DATE,
                                              REMARK,
                                              SS_TYPE,
                                              ABN_BEGIN_DATE,
                                              ABN_END_DATE)
      SELECT RISKCONFIG.SEQ_SPECIALSTOCKJOUR.NEXTVAL,
             TO_CHAR(SYSDATE, 'YYYYMMDD'),
             SUBSTR(TO_CHAR(SYSDATE, 'YYYYMMDD hh24:mi;ss'), 10, 8),
             '2', --修改
             I_USER_CODE,
             I_MARKET_NO,
             I_STOCK_CODE,
             I_BEGIN_DATE,
             I_END_DATE,
             I_REMARK,
             I_SS_TYPE,
             I_ABN_BEGIN_DATE,
             I_ABN_END_DATE
        FROM DUAL;

  END IF;
  ---删除
  IF I_OP_FLAG = '3' THEN
      DELETE FROM RISKCONFIG.T_SPECIALSTOCK T
     WHERE T.PK_ID = I_PK_ID;


    INSERT INTO RISKCONFIG.T_SPECIALSTOCKJOUR(SERIAL_NO,
                                              OCCUR_DATE,
                                              OCCUR_TIME,
                                              OPER_TYPE,
                                              OPER_CODE,
                                              MARKET_NO,
                                              STOCK_CODE,
                                              BEGIN_DATE,
                                              END_DATE,
                                              REMARK,
                                              SS_TYPE,
                                              ABN_BEGIN_DATE,
                                              ABN_END_DATE)
      SELECT RISKCONFIG.SEQ_SPECIALSTOCKJOUR.NEXTVAL,
             TO_CHAR(SYSDATE, 'YYYYMMDD'),
             SUBSTR(TO_CHAR(SYSDATE, 'YYYYMMDD hh24:mi;ss'), 10, 8),
             '3', --删除
             I_USER_CODE,
             T.MARKET_NO,
             T.STOCK_CODE,
             T.BEGIN_DATE,
             T.END_DATE,
             T.REMARK,
             T.SS_TYPE,
             T.ABN_BEGIN_DATE,
             T.ABN_END_DATE
        FROM  RISKCONFIG.T_SPECIALSTOCK T
        WHERE T.PK_ID = I_PK_ID;
  END IF;

  COMMIT;

    -------------------------------------------------------------
  O_RETURN_CODE := 0; O_RETURN_MSG := '执行成功';
  -- ============================================================================
    -- 错误处理部分
    -- ============================================================================

  EXCEPTION
  WHEN OTHERS THEN O_RETURN_CODE := SQLCODE; O_RETURN_MSG := O_RETURN_MSG || SQLERRM; ROLLBACK; V_ERROR_MSG := O_RETURN_MSG; V_ERROR_CODE := O_RETURN_CODE; WOLF.P_ERROR_LOG('admin', -- '操作人';
  V_OP_OBJECT, -- '操作对象';
  V_ERROR_CODE, --'错误代码';
  V_ERROR_MSG, -- '错误信息';
   '', '', O_RETURN_MSG, --返回信息
  O_RETURN_CODE --返回值 0 成功必须返回；-1 失败
  );
  END;/
create or replace package debug_utils is
    runtime dbms_debug.runtime_info;
    function to_error(code binary_integer) return varchar2;
    function to_reason(code binary_integer) return varchar2;
    function to_namespace(code binary_integer) return varchar2;
    procedure print_program(program dbms_debug.program_info);
    procedure print_runtime(runtime dbms_debug.runtime_info);

    procedure initialize;
    procedure synchronize;
    procedure brean_any_return;
    procedure set_breakpoint(line# binary_integer);
    procedure disable_breakpoint(num binary_integer);
    procedure show_breakpoints;
    procedure print_backtrace;
    procedure delete_breakpoint(num binary_integer);
    procedure step_over;
    procedure step_into;
    procedure step_any_return;
    procedure step_abort;
    procedure get_value(variable_name varchar2, frame# binary_integer);
    procedure get_runtime_info;
    procedure get_values;

    procedure get_line_map;

    procedure get_timeout;
    procedure get_timeout_behaviour;
    procedure set_timeout(timeout binary_integer);
  end;/
  create or replace package body debug_utils is
    function to_error(code binary_integer) return varchar2 is
    begin
      case code
        when dbms_debug.success then return 'success';
        when dbms_debug.error_bogus_frame then return 'error_bogus_frame';
        when dbms_debug.error_no_debug_info then return 'error_no_debug_info';
        when dbms_debug.error_no_such_object then return 'error_no_such_object';
        when dbms_debug.error_unknown_type then return 'error_unknown_type';
        when dbms_debug.error_indexed_table then return 'error_indexed_table';
        when dbms_debug.error_illegal_index then return 'error_illegal_index';
        when dbms_debug.error_nullcollection then return 'error_nullcollection';
        when dbms_debug.error_nullvalue then return 'error_nullvalue';
        when dbms_debug.error_illegal_value then return 'error_illegal_value';
        when dbms_debug.error_illegal_null then return 'error_illegal_null';
        when dbms_debug.error_value_malformed then return 'error_value_malformed';
        when dbms_debug.error_other then return 'error_other';
        when dbms_debug.error_name_incomplete then return 'error_name_incomplete';
        when dbms_debug.error_illegal_line then return 'error_illegal_line';
        when dbms_debug.error_no_such_breakpt then return 'error_no_such_breakpt';
        when dbms_debug.error_idle_breakpt then return 'error_idle_breakpt';
        when dbms_debug.error_stale_breakpt then return 'error_stale_breakpt';
        when dbms_debug.error_bad_handle then return 'error_bad_handle';
        when dbms_debug.error_unimplemented then return 'error_unimplemented';
        when dbms_debug.error_deferred then return 'error_deferred';
        when dbms_debug.error_exception then return 'error_exception';
        when dbms_debug.error_communication then return 'error_communication';
        when dbms_debug.error_timeout then return 'error_timeout';
        when dbms_debug.error_pbrun_mismatch then return 'error_pbrun_mismatch';
        when dbms_debug.error_no_rph then return 'error_no_rph';
        when dbms_debug.error_probe_invalid then return 'error_probe_invalid';
        when dbms_debug.error_upierr then return 'error_upierr';
        when dbms_debug.error_noasync then return 'error_noasync';
        when dbms_debug.error_nologon then return 'error_nologon';
        when dbms_debug.error_reinit then return 'error_reinit';
        when dbms_debug.error_unrecognized then return 'error_unrecognized';
        when dbms_debug.error_synch then return 'error_synch';
        when dbms_debug.error_incompatible then return 'error_incompatible';
        else return 'error_unknown';
      end case;
      return 'error_unknown';
    end;
    function to_reason(code binary_integer) return varchar2 is
    begin
      case code
        when dbms_debug.reason_none then return 'reason_none';
        when dbms_debug.reason_interpreter_starting then return 'reason_interpreter_starting';
        when dbms_debug.reason_breakpoint then return 'reason_breakpoint';
        when dbms_debug .reason_enter then return 'reason_enter';
        when dbms_debug.reason_return then return 'reason_return';
        when dbms_debug.reason_finish then return 'reason_finish';
        when dbms_debug.reason_line then return 'reason_line';
        when dbms_debug.reason_interrupt then return 'reason_interrupt';
        when dbms_debug.reason_exception then return 'reason_exception';
        when dbms_debug.reason_exit then return 'reason_exit';
        when dbms_debug.reason_handler then return 'reason_handler';
        when dbms_debug.reason_timeout then return 'reason_timeout';
        when dbms_debug.reason_instantiate then return 'reason_instantiate';
        when dbms_debug.reason_abort then return 'reason_abort';
        when dbms_debug.reason_knl_exit then return 'reason_knl_exit';
        else return 'reason_unknown';
      end case;
      return 'reason_unknown';
    end;
    function to_namespace(code binary_integer) return varchar2 is
    begin
      case code
        when dbms_debug.namespace_cursor then return 'namespace_cursor';
        when dbms_debug.namespace_pkgspec_or_toplevel then return 'namespace_pkgspec_or_toplevel';
        when dbms_debug.namespace_pkg_body then return 'namespace_pkg_body';
        when dbms_debug.namespace_trigger then return 'namespace_trigger';
        when dbms_debug.namespace_none then return 'namespace_none';
        else return 'namespace_unknown';
      end case;
      return 'namespace_unknown';
    end;
    procedure print_program(program dbms_debug.program_info) is
    begin
      dbms_output.put_line('program_info:');
      dbms_output.put_line('  namespace = ' || program.namespace || ' ' || to_namespace(program.namespace));
      dbms_output.put_line('  name = ' || program.name);
      dbms_output.put_line('  owner = ' || program.owner);
    end;
    procedure print_runtime(runtime dbms_debug.runtime_info) is
    begin
      dbms_output.put_line('runtime_info:');
      dbms_output.put_line('  line# = ' || runtime.line#);
      dbms_output.put_line('  Terminated = ' || runtime.Terminated);
      dbms_output.put_line('  Breakpoint = ' || runtime.Breakpoint);
      dbms_output.put_line('  StackDepth = ' || runtime.StackDepth);
      dbms_output.put_line('  Reason = ' || runtime.Reason || ' ' || to_reason(runtime.Reason));
      print_program(runtime.program);
    end;
    procedure initialize is
      result varchar2(200);
    begin
      result := dbms_debug.initialize();
      dbms_output.put_line(result);
    end;
    procedure synchronize is
      result binary_integer;
    begin
      result := dbms_debug.synchronize(runtime);
      print_runtime(runtime);
      dbms_output.put_line('result = ' || result || ' ' || to_error(result));
    end;
    procedure brean_any_return is
      result binary_integer;
    begin
      result := dbms_debug.continue(runtime, dbms_debug.break_any_return);
      dbms_output.put_line('result = ' || result || ' ' || to_error(result));
    end;
    procedure set_breakpoint(line# binary_integer) is
      result binary_integer;
      bp_num binary_integer;
    begin
      result := dbms_debug.set_breakpoint(runtime.program, line#, bp_num);
      dbms_output.put_line('result = ' || result || ' ' || to_error(result));
      dbms_output.put_line('bp_num = ' || bp_num);
    end;
    procedure disable_breakpoint(num binary_integer) is
      result binary_integer;
    begin
      result := dbms_debug.disable_breakpoint(num);
      dbms_output.put_line('result = ' || result || ' ' || to_error(result));
    end;
    procedure show_breakpoints is
      listing varchar2(4000);
    begin
      dbms_debug.show_breakpoints(listing);
      dbms_output.put_line('breakpoints = ' || listing);
    end;
    procedure print_backtrace is
      listing varchar2(4000);
    begin
      dbms_debug.print_backtrace(listing);
      dbms_output.put_line('backtrace = ' || listing);
    end;
    procedure delete_breakpoint(num binary_integer) is
      result binary_integer;
    begin
      result := dbms_debug.delete_breakpoint(num);
      dbms_output.put_line('result = ' || result || ' ' || to_error(result));
    end;
    procedure step_over is
      result binary_integer;
    begin
      result := dbms_debug.continue(runtime, dbms_debug.break_next_line);
      dbms_output.put_line('result = ' || result || ' ' || to_error(result));
      print_runtime(runtime);
    end;
    procedure step_into is
      result binary_integer;
    begin
      result := dbms_debug.continue(runtime, dbms_debug.break_any_call);
      dbms_output.put_line('result = ' || result || ' ' || to_error(result));
      print_runtime(runtime);
    end;
    procedure step_any_return is
      result binary_integer;
    begin
      result := dbms_debug.continue(runtime, dbms_debug.break_any_return);
      dbms_output.put_line('result = ' || result || ' ' || to_error(result));
      print_runtime(runtime);
    end;
    procedure step_abort is
      result binary_integer;
    begin
      result := dbms_debug.continue(runtime, dbms_debug.abort_execution);
      dbms_output.put_line('result = ' || result || to_error(result));
      print_runtime(runtime);
    end;
    procedure get_value(variable_name varchar2, frame# binary_integer) is
      scalar_value varchar2(2000);
      result binary_integer;
    begin
      result := dbms_debug.get_value(variable_name, frame#, scalar_value);
      dbms_output.put_line('result = ' || result);
      dbms_output.put_line('scalar_value = ' || scalar_value);
    end;
    procedure get_runtime_info is
      result binary_integer;
    begin
      result := dbms_debug.get_runtime_info(null, runtime);
      print_runtime(runtime);
      dbms_output.put_line('result = ' || result || ' ' || to_error(result));
    end;
    procedure get_values is
      result binary_integer;
      scalar_values varchar2(4000);
    begin
      -- result := dbms_debug.get_values(scalar_values);
      dbms_output.put_line('result = ' || result || ' ' || to_error(result));
      dbms_output.put_line('scalar_values = ' || scalar_values);
    end;

    procedure get_line_map is
      result binary_integer;
      maxline binary_integer;
      number_of_entry_points binary_integer;
      linemap raw(2000);
    begin
      result := dbms_debug.get_line_map(runtime.program, maxline, number_of_entry_points, linemap);
      dbms_output.put_line('result = ' || result || ' ' || to_error(result));
      dbms_output.put_line('maxline = ' || maxline);
      dbms_output.put_line('number_of_entry_points = ' || number_of_entry_points);
      dbms_output.put_line('linemap = ' || utl_raw.cast_to_varchar2(linemap));
    end;

    procedure get_timeout is
    begin
      dbms_output.put_line(dbms_debug.default_timeout);
    end;

    procedure get_timeout_behaviour is
      result binary_integer;
    begin
      result := dbms_debug.get_timeout_behaviour();
      case result
      when dbms_debug.retry_on_timeout then dbms_output.put_line('retry_on_timeout');
      when dbms_debug.continue_on_timeout then dbms_output.put_line('continue_on_timeout');
      when dbms_debug.nodebug_on_timeout then dbms_output.put_line('nodebug_on_timeout');
      when dbms_debug.abort_on_timeout then dbms_output.put_line('abort_on_timeout');
      else dbms_output.put_line('unknown timeout behaviour !' || result);
      end case;
    end;

    procedure set_timeout(timeout binary_integer) is
      result binary_integer;
    begin
      result := dbms_debug.set_timeout(timeout);
      dbms_output.put_line('new timeout is ' || result);
    end;
  end;/
declare
      v_pkcount integer;
      v_pkname varchar2(30);
      v_tablename varchar2(30);
  begin
      v_tablename := 'tbfundliqassetchgfile';
      select count(1) into v_pkcount from (
      select au.constraint_name from user_cons_columns cu,user_constraints au
       where au.table_name = cu.table_name
         and au.constraint_type = 'P'
         and au.table_name = upper(v_tablename)
         and au.constraint_name = cu.constraint_name
       group by au.constraint_name);
      if v_pkcount > 0 then
          select au.constraint_name into v_pkname from user_cons_columns cu,user_constraints au
           where au.table_name = cu.table_name
             and au.constraint_type = 'P'
             and au.table_name = upper(v_tablename)
             and au.constraint_name = cu.constraint_name
           group by au.constraint_name;
          execute immediate 'alter table '||v_tablename||' drop constraint '||v_pkname||' cascade drop index';
      end if;
  end;/
call proc_droptable('tbfundcustschemaexp');
create table tbfundcustschemaexp(
      ta_code                   VARCHAR2(18)         default ' ' not null,
      prd_code                  VARCHAR2(32)         default ' ' not null,
      reg_date                  INTEGER              default 0 not null,
      div_date                  INTEGER              default 0 not null,
      reinvest_date             INTEGER              default 0 not null,
      unit_profit               NUMBER(18,8)         default 0.0 not null,
      project_desc              VARCHAR2(2000)       default ' ' not null,
      deal_flag                 VARCHAR2(1)          default ' ' not null,
      tax                       NUMBER(18,2)         default 0.0 not null,
      manager_code              VARCHAR2(6)          default ' ' not null,
      remark                    VARCHAR2(1000)       default ' ' not null,
      constraint pk_fundcustschemaexp primary key (ta_code, prd_code, reg_date, deal_flag)
  );