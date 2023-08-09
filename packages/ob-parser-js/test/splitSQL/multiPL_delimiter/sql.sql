delimiter //
DECLARE
  -- Local variables here
  i NUMBER;
BEGIN
  -- Test statements here
  dbms_output.put_line('Hello World!');
END;
select * from a;//
create or replace PROCEDURE ab1 as
begin 
select * from b;
end;