const SQLDocument = require("../lib/index").SQLDocument;

const sql = `
select * from 中文a98812 => a;
`

const doc = new SQLDocument(
    {
        text: sql
    }
);
console.log(doc.getFormatText())
