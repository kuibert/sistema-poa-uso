import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db';
import { config } from '../config';

export const authService = {
  async login(email: string, password: string) {
    const result = await query(
      'SELECT id, nombre_completo, correo FROM usuario WHERE correo = $1 AND activo = true',
      [email]
    );

    if (result.rows.length === 0) {
      throw { statusCode: 401, message: 'Credenciales inválidas' };
    }

    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.correo },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return {
      token,
      user: {
        id: user.id,
        nombre: user.nombre_completo,
        email: user.correo,
      },
    };
  },

  async getUserById(id: number) {
    const result = await query(
      'SELECT id, nombre_completo, correo FROM usuario WHERE id = $1 AND activo = true',
      [id]
    );

    if (result.rows.length === 0) {
      throw { statusCode: 404, message: 'Usuario no encontrado' };
    }

    return result.rows[0];
  },
};
