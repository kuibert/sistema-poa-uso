
import { query, pool } from '../src/db';

async function main() {
    const currentYear = new Date().getFullYear();
    console.log('Querying for Year:', currentYear);

    try {
        // Check columns of indicador_actividad
        const cols = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'indicador_actividad'
    `);
        console.log('Columns in indicador_actividad:', cols.rows.map(r => r.column_name));

        // 3. Check Indicators using 'id' (assuming 'id' exists based on getSeguimientoProyecto)
        // If 'id' is not in the list above, we will fail again, but let's try based on common sense.
        const indicatorsInfo = await query(`
        SELECT 
        a.id as act_id,
        a.nombre as act_nombre,
        ia.porcentaje_cumplimiento,
        ia.valor_logrado,
        ia.meta_valor
        FROM actividad a
        LEFT JOIN indicador_actividad ia ON ia.id_actividad = a.id
        WHERE EXTRACT(YEAR FROM a.created_at) = $1
        LIMIT 10
    `, [currentYear]);

        console.log('Sample Activities and Indicators:', indicatorsInfo.rows);

        const stats = await query(`
        SELECT 
            count(a.id) as total_activ,
            count(ia.id) as with_indicator,
            sum(ia.porcentaje_cumplimiento) as sum_pct,
            avg(ia.porcentaje_cumplimiento) as avg_pct
        FROM actividad a
        LEFT JOIN indicador_actividad ia ON ia.id_actividad = a.id
        WHERE EXTRACT(YEAR FROM a.created_at) = $1
    `, [currentYear]);

        console.log('Aggregated Stats for Year:', stats.rows[0]);

    } catch (err) {
        console.error(err);
    }

    pool.end();
}

main();
