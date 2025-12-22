
import { query } from '../src/db';

async function inspectSchema() {
    try {
        const result = await query(
            `SELECT column_name, data_type 
       FROM information_schema.columns 
       WHERE table_name = 'usuario';`
        );
        console.log('COLUMNS:', result.rows.map(r => r.column_name).join(', '));
    } catch (err) {
        console.error('Error inspecting schema:', err);
    }
}

inspectSchema();
