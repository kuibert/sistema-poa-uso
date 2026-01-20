import { Pool, PoolClient } from 'pg';
import { pool } from '../config/db';

interface Migration {
    name: string;
    up: (client: PoolClient) => Promise<void>;
}

const migrations: Migration[] = [
    {
        name: '001_add_incluir_en_avance',
        up: async (client: PoolClient) => {
            // Verificar si la columna existe en costo_proyecto
            const checkQuery = `
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'costo_proyecto' AND column_name = 'incluir_en_avance';
            `;
            const { rows } = await client.query(checkQuery);

            if (rows.length === 0) {
                console.log('🔄 Ejecutando migración: Agregando columna incluir_en_avance a costo_proyecto...');
                await client.query(`
                    ALTER TABLE costo_proyecto 
                    ADD COLUMN incluir_en_avance BOOLEAN DEFAULT TRUE;
                `);
                console.log('✅ Columna incluir_en_avance agregada correctamente.');
            } else {
                console.log('ℹ️ La columna incluir_en_avance ya existe. Saltando migración.');
            }
        }
    }
    // Aquí se pueden agregar más migraciones futuras
];

export const runMigrations = async () => {
    const client = await pool.connect();
    try {
        console.log('🚀 Iniciando sistema de migraciones...');

        // Crear tabla de control de migraciones si no existe (opcional, por ahora lo hacemos simple verificando la columna)
        // Para este caso específico, verificaremos directamente la condición como se definió en la migración.

        // En un sistema más robusto usaríamos una tabla 'migrations_history', 
        // pero dado el requerimiento de "facilidad" y el estado actual, haremos la verificación idempotente dentro de cada migración.

        for (const migration of migrations) {
            try {
                await migration.up(client);
            } catch (error) {
                console.error(`❌ Error en la migración ${migration.name}:`, error);
                throw error; // Detener el servidor si una migración crítica falla
            }
        }

        console.log('✅ Todas las migraciones se ejecutaron correctamente o ya estaban aplicadas.');
    } catch (error) {
        console.error('❌ Error fatal en el sistema de migraciones:', error);
        process.exit(1); // Salir si hay error en migraciones para evitar inconsistencias
    } finally {
        client.release();
    }
};
