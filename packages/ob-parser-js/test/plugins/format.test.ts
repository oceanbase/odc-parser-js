import { SQLType } from '../../src/parser/type';
import format from '../../src/plugins/format';

describe('format plugin', () => {
    it('empty params', () => {
        const res = format(null);
        expect(res).toBeNull();
    });
    it('format sql', () => {
        const res = format({
            sql: 'select * from a;select * from a;',
            type: SQLType.MySQL,
        });
        expect(res).not.toBeNull();

        expect(format({
            sql: 'select * from a;select * from a;',
            type: SQLType.Oracle,
        })).not.toBeNull();
    });
})