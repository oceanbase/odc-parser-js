select 1 from dual;
create or replace procedure test_proc_1 (id NUMBER, agein number)
  IS
  name varchar2(100);
  age number:=agein;
  begin
  name:='xxxxxxx';
  dbms_output.put_line('id='||id||',name='||name||',age='||age);
  end;/
select 1 from dual;create or replace function adder(n1 in number, n2 in number)
  return number
  is
  n3 number(8);
  begin
  n3 :=n1+n2;
  return n3;
  end;/
create function get_score(indata int, basedata int)
  return int as
      gap int;
      score int;
  BEGIN
      gap := indata - basedata;
      case gap
      when 0 then
          score := 100;
      when 1 then
          score := 90;
      when 2 then
          score := 70;
      when 3 then
          score := 50;
      when 4 then
          score := 30;
      when 5 then
          score := 10;
      else
          score := 0;
      end case;i
      return score;
  END;/