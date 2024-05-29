const SQLDocument = require("../lib/index").SQLDocument;

const sql = `
SELECT
  *
FROM
  oceanbase.__all_acquired_snapshot
WHERE
  tablet_id != '1000'$
  SHOW tables $
  SELECT
  *
FROM
  oceanbase.__all_acquired_snapshot
WHERE
  tablet_id != '1000' $
`

const doc = new SQLDocument(
    {
        text: sql,
        delimiter: '$'
    }
);
console.log(doc.statements)
