
import { query, pool } from '../src/db';

async function main() {
    try {
        const res = await query("SELECT column_name FROM information_schema.columns WHERE table_name = 'usuario'");
        console.log('Columns in usuario table:');
        console.log(res.rows.map(r => r.column_name));
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

main();
