
import { query } from '../src/db';

async function check() {
    try {
        const res = await query('SELECT id, id_proyecto, descripcion, cantidad, id_actividad FROM costo_proyecto WHERE id_proyecto = 19');
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (e) {
        console.error(e);
    }
}

check();
