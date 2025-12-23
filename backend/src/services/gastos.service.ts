import { query } from '../config/db';

export const gastosService = {
  async getGastosByActividad(actividadId: number) {
    const result = await query(
      `SELECT g.id as id_gasto, g.fecha as fecha_gasto, g.descripcion, g.monto,
              u.nombre_completo as registrado_por_nombre 
       FROM gasto_actividad g
       LEFT JOIN usuario u ON g.id_registrado_por = u.id
       WHERE g.id_actividad = $1
       ORDER BY g.fecha DESC`,
      [actividadId]
    );
    return result.rows;
  },

  async crearGasto(actividadId: number, data: any, userId: number) {
    const result = await query(
      `INSERT INTO gasto_actividad (id_actividad, fecha, descripcion, monto, id_registrado_por)
       VALUES ($1, $2, $3, $4, $5) RETURNING 
       id as id_gasto, fecha as fecha_gasto, descripcion, monto`,
      [actividadId, data.fecha_gasto, data.descripcion, data.monto, userId]
    );
    return result.rows[0];
  },

  async updateGasto(gastoId: number, data: any) {
    const result = await query(
      `UPDATE gasto_actividad SET fecha = $1, descripcion = $2, monto = $3 
       WHERE id = $4 RETURNING 
       id as id_gasto, fecha as fecha_gasto, descripcion, monto`,
      [data.fecha_gasto, data.descripcion, data.monto, gastoId]
    );
    return result.rows[0];
  },

  async deleteGasto(gastoId: number) {
    await query('DELETE FROM gasto_actividad WHERE id = $1', [gastoId]);
    return { success: true };
  },
};
