import SQLDocument from '../src/core/SQLDocument';
import { SQLType } from '../src/parser/type';

describe('SQLDocument', () => {
    it('sql and pl statements', () => {
        [SQLType.Oracle, SQLType.MySQL].forEach((sqlType) => {
            const sqls = [
                'select * from a;',
                'select * from b;'
            ];
            const doc = new SQLDocument({
                text: sqls.join('\n'),
                type: sqlType,
                delimiter: ';'
            });
            expect(doc.statements).toHaveLength(2);
        });
        const doc = new SQLDocument({
            text: [
                `DECLARE
                -- Local variables here
                i NUMBER;
              BEGIN
                -- Test statements here
                dbms_output.put_line('Hello World!');
              END//`,
                'select * from b;'
            ].join('\n'),
            type: SQLType.Oracle,
            delimiter: '//'
        });
        expect(doc.statements).toHaveLength(2);
        const doc2 = new SQLDocument({
            text: [
                `create function my_func ( \`param\` int(11)) returns int(11) begin 
                return 1;
                end//`,
                'select * from b;'
            ].join('\n'),
            type: SQLType.MySQL,
            delimiter: '//'
        });
        expect(doc2.statements).toHaveLength(2);
    });
    it ('single sql', () => {
        const doc = new SQLDocument({
            text: [
                `create function my_func ( \`param\` int(11)) returns int(11) begin 
                return 1;
                end;`
            ].join('\n'),
            type: SQLType.MySQL,
            delimiter: ';'
        });
        expect(doc.statements).toHaveLength(1);
        const doc2 = new SQLDocument({
            text: [
                `DECLARE
                -- Local variables here
                i NUMBER;
              BEGIN
                -- Test statements here
                dbms_output.put_line('Hello World!');
              END;`
            ].join('\n'),
            type: SQLType.Oracle,
            delimiter: ';'
        });
        expect(doc2.statements).toHaveLength(1);
    })
    it('format sql', () => {
        [SQLType.Oracle, SQLType.MySQL].forEach((sqlType) => {
            const sql = 'select * from a;select * from a;';
            const doc = new SQLDocument({
                text: sql,
                type: sqlType,
                delimiter: ';'
            });
            expect(doc.getFormatText()).not.toEqual(sql);
            expect(doc.getFormatText()).not.toBe('');
            expect(doc.getFormatText()).not.toBeNull();
        });
    })
})