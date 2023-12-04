const { SQLType } = require("../lib/index");

const SQLDocument = require("../lib/index").SQLDocument;

const sql = `
select * from 中文a98812;
`

const doc = new SQLDocument(
    {
        text: sql,
        type: SQLType.MySQL
    }
);
console.log(doc.statements[0].parser.parse(sql))
