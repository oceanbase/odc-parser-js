CREATE OR REPLACE PACKAGE my_pack IS
    FUNCTION get_id RETURN NUMBER;
  END my_pack;
  /
CREATE OR REPLACE PACKAGE BODY my_pack
  IS
    id NUMBER := 1;
    len NUMBER := 10;
    FUNCTION get_id RETURN NUMBER AS
    BEGIN
      RETURN id;
    END;
  BEGIN
    len := 20;
    id := 10;
    INSERT INTO result VALUES('call init package');
    update OC_USER_OPERATION_EXECUTE set status = 2, exec_status = 2, response_time = sysdate, request_time = sysdate + 2/24/60/60, error_code = 10035;
  END my_pack;
  /
create or replace package Test_Package_Func_Proc
  as
   function  test_func  (in_val in number) return number;
   procedure test_proc (in_val in number);
  end;
  /
create or replace package body Test_Package_Func_Proc
  as
  function test_func (in_val in number) return number
  is
  begin
  return in_val;
  exception
  when others then
  RAISE;
  end;
  procedure test_proc  (in_val in number)
  is
  begin
  dbms_output.put_line (in_val);
  exception
  when others then
  RAISE;
  end;
  end;