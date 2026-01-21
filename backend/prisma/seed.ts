import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function main() {
    console.log('🌱 Iniciando el proceso de siembra (seeding) con pg...');

    const sqlPath = path.join(__dirname, '../../database/semilla_datos.sql');

    if (!fs.existsSync(sqlPath)) {
        console.error('❌ Error: No se encontró el archivo de semilla en:', sqlPath);
        return;
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');

    try {
        // El driver 'pg' permite ejecutar múltiples sentencias si se pasan como un solo string
        // y no se usan parámetros ($1, $2, etc.)
        await pool.query(sql);
        console.log('✅ Datos de semilla cargados exitosamente.');
    } catch (error) {
        console.error('❌ Error al cargar los datos de semilla:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

main();
