import { query } from '../db';

export const evidenciasService = {
  async getEvidenciasByActividad(actividadId: number) {
    const result = await query(
      `SELECT e.*, u.nombre as subido_por_nombre 
       FROM evidencia_actividad e
       LEFT JOIN usuario u ON e.id_subido_por = u.id_usuario
       WHERE e.id_actividad = $1
       ORDER BY e.fecha_subida DESC`,
      [actividadId]
    );
    return result.rows;
  },

  async crearEvidencia(actividadId: number, data: any, userId: number) {
    const result = await query(
      `INSERT INTO evidencia_actividad (id_actividad, tipo_evidencia, descripcion, ruta_archivo, id_subido_por)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [actividadId, data.tipo_evidencia, data.descripcion, data.ruta_archivo, userId]
    );
    return result.rows[0];
  },

  async deleteEvidencia(evidenciaId: number) {
    await query('DELETE FROM evidencia_actividad WHERE id_evidencia = $1', [evidenciaId]);
    return { success: true };
  },
};
