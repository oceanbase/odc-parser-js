DECLARE
  -- Local variables here
  i NUMBER;
BEGIN
  -- Test statements here
  dbms_output.put_line('Hello World!');
END;/
select * from a;
create or replace PROCEDURE ab1 as
begin 
select * from b;
end;/
CREATE TYPE data_typ1 AS OBJECT
  ( year NUMBER,
  MEMBER FUNCTION prod(invent NUMBER) RETURN NUMBER
  );/
CREATE TYPE BODY data_typ1 IS
  MEMBER FUNCTION prod (invent NUMBER) RETURN NUMBER IS
  BEGIN
    RETURN (year + invent);
  END;
END;/
create or replace function adder(n1 in number, n2 in number)
  return number
  is
  n3 number(8);
  begin
  n3 :=n1+n2;
  return n3;
  end;/
create or replace package Test_Package_Func_Proc
  as
   function  test_func  (in_val in number) return number;
   procedure test_proc (in_val in number);
  end;/
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
  end;/
   -- 特点是以 create <or replace>  <EDITIONABLE|NONEDITIONABLE> trigger 开始
  -- 程序块 begin 开始，end 结束
  CREATE OR REPLACE trigger tri_dept
  before insert or update or delete
  on dept --创建触发器，当dept 表发生插入，修改，删除操作时引起该触发器执行
  declare
  var_tag varchar2(10);  --声明一个变量，存储对dept表执行的操作类
  begin
  if inserting then  --当触发事件是insert时
  var_tag:='插入';   --标识插入操作
  elsif updating then  --当触发事件是update时
  var_tag:='修改';  --标识修改操作
  elsif deleting then  --当触发事件是delete时
  var_tag:='删除';  --标识删除操作
  end if;
  INSERT INTO dept_log VALUES (var_tag,sysdate); --向日志表中插入对dept表的操作信息
  end tri_dept;/
CREATE OR REPLACE trigger tri_dept
  before insert or update or delete
  on dept --创建触发器，当dept 表发生插入，修改，删除操作时引起该触发器执行
  declare
  var_tag varchar2(10);  --声明一个变量，存储对dept表执行的操作类
  begin
  if inserting then  --当触发事件是insert时
  var_tag:='插入';   --标识插入操作
  elsif updating then  --当触发事件是update时
  var_tag:='修改';  --标识修改操作
  elsif deleting then  --当触发事件是delete时
  var_tag:='删除';  --标识删除操作
  end if;
  INSERT INTO dept_log VALUES (var_tag,sysdate); --向日志表中插入对dept表的操作信息
  end;/