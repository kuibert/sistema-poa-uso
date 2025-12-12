const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'poa_system',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD
});

const sqlFile = path.join(__dirname, '..', 'database', 'test_data_extra.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

console.log('📊 Insertando datos adicionales de prueba...');

pool.query(sql)
    .then(() => {
        console.log('✅ Datos adicionales insertados correctamente');
        console.log('\n📈 Resumen de datos en la base de datos:');
        return pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM usuario) as usuarios,
        (SELECT COUNT(*) FROM proyecto) as proyectos,
        (SELECT COUNT(*) FROM actividad) as actividades,
        (SELECT COUNT(*) FROM gasto_actividad) as gastos,
        (SELECT COUNT(*) FROM evidencia_actividad) as evidencias
    `);
    })
    .then((result) => {
        const stats = result.rows[0];
        console.log(`   • Usuarios: ${stats.usuarios}`);
        console.log(`   • Proyectos: ${stats.proyectos}`);
        console.log(`   • Actividades: ${stats.actividades}`);
        console.log(`   • Gastos: ${stats.gastos}`);
        console.log(`   • Evidencias: ${stats.evidencias}`);
        pool.end();
    })
    .catch((err) => {
        console.error('❌ Error:', err.message);
        console.error('\n💡 Detalles:', err);
        pool.end();
        process.exit(1);
    });
