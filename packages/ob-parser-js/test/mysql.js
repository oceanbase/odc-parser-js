const { SQLType } = require('../lib/parser/type');

const format = require('../lib/plugins/format').default;

const sql = `
create function ${'`fun1112`'} (${'`aa`'}  varchar(45)) returns int(11)
begin
  -- Enter your function code
  return 1;
end;
`

const doc = format({
    sql: sql,
    type: SQLType.OBMySQL,
    delimiter: ";"
});
console.log(doc)
