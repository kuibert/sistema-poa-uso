
import { query, pool } from '../src/db';

async function main() {
    const currentYear = new Date().getFullYear();
    console.log('Verificando cálculo de KPI para el año:', currentYear);

    try {
        // Simulamos la lógica del servicio
        const actividadesResult = await query(
            `
      SELECT 
       a.id,
       COALESCE(ams.estado, 'P') AS estado,
       ia.porcentaje_cumplimiento AS "logroKpiActividad",
       CASE ams.estado
        WHEN 'P' THEN 0
        WHEN 'I' THEN 50
        WHEN 'F' THEN 100
        ELSE 0
       END AS "avanceActividad"
      FROM actividad a
      LEFT JOIN actividad_mes_seguimiento ams ON ams.id_actividad = a.id
      LEFT JOIN indicador_actividad ia ON ia.id_actividad = a.id
      WHERE EXTRACT(YEAR FROM a.created_at) = $1
      `,
            [currentYear]
        );

        const actividades = actividadesResult.rows;
        console.log(`Actividades recuperadas: ${actividades.length}`);

        // Cálculo CORREGIDO
        const logroKpi = actividades.length
            ? Math.round(
                actividades.reduce(
                    (sum: number, a: any) => sum + (Number(a.logroKpiActividad) || 0),
                    0
                ) / actividades.length
            )
            : 0;

        console.log(`Logro Promedio KPI Calculado: ${logroKpi}%`);

        if (logroKpi > 0) {
            console.log("✅ ÉXITO: El cálculo ya no devuelve 0%.");
        } else {
            console.log("⚠️ ADVERTENCIA: El cálculo sigue siendo 0% (puede ser correcto si los datos son realmente 0).");
            // Check raw sum
            const rawSum = actividades.reduce((s: any, a: any) => s + (Number(a.logroKpiActividad) || 0), 0);
            console.log("Suma cruda de valores:", rawSum);
        }

    } catch (err) {
        console.error(err);
    }

    pool.end();
}

main();
