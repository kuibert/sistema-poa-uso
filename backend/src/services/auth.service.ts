import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db';
import { config } from '../config';

export const authService = {
  async login(email: string, password: string) {
    const result = await query(
      'SELECT id_usuario, nombre, email, password_hash, rol_sistema FROM usuario WHERE email = $1 AND activo = true',
      [email]
    );

    if (result.rows.length === 0) {
      throw { statusCode: 401, message: 'Credenciales inválidas' };
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      throw { statusCode: 401, message: 'Credenciales inválidas' };
    }

    const token = jwt.sign(
      { id: user.id_usuario, email: user.email, rol: user.rol_sistema },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return {
      token,
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol_sistema,
      },
    };
  },

  async getUserById(id: number) {
    const result = await query(
      'SELECT id_usuario, nombre, email, rol_sistema FROM usuario WHERE id_usuario = $1 AND activo = true',
      [id]
    );

    if (result.rows.length === 0) {
      throw { statusCode: 404, message: 'Usuario no encontrado' };
    }

    return result.rows[0];
  },
};
