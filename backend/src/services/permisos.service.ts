import { query } from '../config/db';

export const permisosService = {
  async getRolUsuario(userId: number, proyectoId: number): Promise<string | null> {
    const result = await query(
      'SELECT rol FROM proyecto_usuario_rol WHERE id_usuario = $1 AND id_proyecto = $2',
      [userId, proyectoId]
    );

    return result.rows.length > 0 ? result.rows[0].rol : null;
  },

  async puedeVerProyecto(userId: number, proyectoId: number): Promise<boolean> {
    const rol = await this.getRolUsuario(userId, proyectoId);
    return rol !== null;
  },

  async puedeEditarProyecto(userId: number, proyectoId: number): Promise<boolean> {
    const rol = await this.getRolUsuario(userId, proyectoId);
    return rol === 'OWNER' || rol === 'EDITOR';
  },

  async puedeEditarSeguimiento(userId: number, proyectoId: number): Promise<boolean> {
    return this.puedeEditarProyecto(userId, proyectoId);
  },
};
