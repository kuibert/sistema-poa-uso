import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db';
import { config } from '../config';

export const authService = {
  async login(email: string, password: string) {
    const result = await query(
      'SELECT id, nombre_completo, email, rol, contrasena, unidad FROM usuario WHERE email = $1 AND activo = true',
      [email]
    );

    if (result.rows.length === 0) {
      throw { statusCode: 401, message: 'Credenciales inválidas' };
    }

    const user = result.rows[0];

    // Verify Password
    const validPassword = await bcrypt.compare(password, user.contrasena || '');
    if (!validPassword) {
      throw { statusCode: 401, message: 'Credenciales inválidas' };
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        rol: user.rol, // Include role in token
        unidad: user.unidad
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as any }
    );

    return {
      token,
      user: {
        id: user.id,
        nombre: user.nombre_completo,
        email: user.email,
        rol: user.rol, // Return role to frontend
        unidad: user.unidad
      },
    };
  },

  async register(nombre: string, email: string, rol: string, password?: string, cargo?: string, unidad?: string) {
    // Check if user exists
    const check = await query('SELECT id FROM usuario WHERE email = $1', [email]);
    if (check.rows.length > 0) {
      throw { statusCode: 400, message: 'El correo ya está registrado' };
    }

    // Insert new user

    // Hash password
    const salt = await bcrypt.genSalt(10);
    // Use provided password or default '123456'
    const passwordToHash = password || '123456';
    const hashedPassword = await bcrypt.hash(passwordToHash, salt);

    const result = await query(
      `INSERT INTO usuario (nombre_completo, email, rol, activo, contrasena, cargo, unidad) 
       VALUES ($1, $2, $3, true, $4, $5, $6) 
       RETURNING id, nombre_completo, email, rol, cargo, unidad`,
      [nombre, email, rol, hashedPassword, cargo || null, unidad || null]
    );

    return result.rows[0];
  },

  async listUsers() {
    const result = await query(
      'SELECT id, nombre_completo, email, rol, activo FROM usuario WHERE activo = true ORDER BY id ASC'
    );
    return result.rows;
  },

  async updateUserRole(id: number, rol: string) {
    const result = await query(
      'UPDATE usuario SET rol = $1 WHERE id = $2 RETURNING id, nombre_completo, rol',
      [rol, id]
    );
    if (result.rows.length === 0) {
      throw { statusCode: 404, message: 'Usuario no encontrado' };
    }
    return result.rows[0];
  },

  async getUserById(id: number) {
    const result = await query(
      'SELECT id, nombre_completo, email, rol FROM usuario WHERE id = $1 AND activo = true',
      [id]
    );

    if (result.rows.length === 0) {
      throw { statusCode: 404, message: 'Usuario no encontrado' };
    }

    return result.rows[0];
  },
  async deleteUser(id: number) {
    const result = await query(
      'UPDATE usuario SET activo = false WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      throw { statusCode: 404, message: 'Usuario no encontrado' };
    }
    return { message: 'Usuario desactivado correctamente' };
  },
};
