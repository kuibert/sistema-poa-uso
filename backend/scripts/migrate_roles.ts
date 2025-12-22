
import { query } from '../src/db';

async function migrateRoles() {
    console.log('🔄 Iniciando migración de roles...');
    try {
        // 1. Agregar columna rol si no existe
        await query(`
      ALTER TABLE usuario 
      ADD COLUMN IF NOT EXISTS rol VARCHAR(20) DEFAULT 'VIEWER';
    `);

        // 2. Agregar constraint de validación (drop if exists to be safe)
        await query(`
      ALTER TABLE usuario DROP CONSTRAINT IF EXISTS check_rol_valid;
    `);

        await query(`
      ALTER TABLE usuario 
      ADD CONSTRAINT check_rol_valid 
      CHECK (rol IN ('ADMIN', 'EDITOR', 'VIEWER'));
    `);

        console.log('✅ Columna rol agregada con constraint.');

        // 3. Asignar rol ADMIN al usuario Moris (id=1 usualmente, o por correo)
        // Asumiremos ID 1 para propósito de prueba rápida, o todos los usuarios actuales
        await query(`
      UPDATE usuario SET rol = 'ADMIN' WHERE id = 1;
    `);

        console.log('✅ Usuario ID 1 actualizado a ADMIN.'); // Usuario Moris

        // Listar usuarios
        const res = await query('SELECT id, nombre_completo, correo, rol FROM usuario');
        console.table(res.rows);

    } catch (err) {
        console.error('❌ Error en migración:', err);
    }
}

migrateRoles();
