begin
  for idx in 1..2 loop
  insert into for_loop_t values(idx);
  end loop;
  for idx in 1..2 loop
  insert into for_loop_t values(idx);
  end loop;
  end;/
begin
    for idx in 1..2 loop
      for idx in 1..2 loop
        insert into for_loop_t values(1);
      end loop;
    end loop;
  end;/
declare
    cursor cur1 is select col from for_loop_cursor_t;
    cursor cur2 is select col from for_loop_cursor_t;
  begin
    for idx in cur1 loop
      begin
        for idx in cur2 loop
          insert into for_loop_t values(1);
          update OC_USER_OPERATION_EXECUTE set status = 2, exec_status = 2, response_time = sysdate, request_time = sysdate + 2/24/60/60, error_code = 10035;
        end loop;
      end;
    end loop;
  end;/
declare
      cursor cur1 is select col from for_loop_cursor_t;
      cursor cur2 is select col from for_loop_cursor_t;
  begin
    for idx in cur1 loop
      begin
        for idx in cur2 loop
          insert into for_loop_t values(1);
        end loop;
      end;
    end loop;
  end;/