import { query } from '../config/db';

export const evidenciasService = {
  async getEvidenciasByActividad(actividadId: number) {
    const result = await query(
      `SELECT e.id as id_evidencia, e.fecha as fecha_subida, e.tipo as tipo_evidencia, 
              e.descripcion, e.ruta_archivo, u.nombre_completo as subido_por_nombre 
       FROM evidencia_actividad e
       LEFT JOIN usuario u ON e.id_subido_por = u.id
       WHERE e.id_actividad = $1
       ORDER BY e.created_at DESC`,
      [actividadId]
    );
    return result.rows;
  },

  async crearEvidencia(actividadId: number, data: any, userId: number) {
    const result = await query(
      `INSERT INTO evidencia_actividad (id_actividad, fecha, tipo, descripcion, ruta_archivo, id_subido_por)
       VALUES ($1, CURRENT_DATE, $2, $3, $4, $5) RETURNING 
       id as id_evidencia, fecha as fecha_subida, tipo as tipo_evidencia, descripcion, ruta_archivo`,
      [actividadId, data.tipo_evidencia, data.descripcion, data.ruta_archivo, userId]
    );
    return result.rows[0];
  },

  async deleteEvidencia(evidenciaId: number) {
    await query('DELETE FROM evidencia_actividad WHERE id = $1', [evidenciaId]);
    return { success: true };
  },
};
