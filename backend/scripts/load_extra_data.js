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

const sqlFileBase = path.join(__dirname, '..', '..', 'database', 'test_data.sql');
const sqlFileExtra = path.join(__dirname, '..', '..', 'database', 'test_data_extra.sql');

const sqlBase = fs.readFileSync(sqlFileBase, 'utf8');
const sqlExtra = fs.readFileSync(sqlFileExtra, 'utf8');

console.log('🧹 Limpiando base de datos (Truncate)...');

pool.query(`
    TRUNCATE TABLE 
        proyecto_usuario_rol, 
        evidencia_actividad, 
        gasto_actividad, 
        indicador_actividad, 
        actividad_mes_seguimiento, 
        actividad_mes_plan, 
        costo_proyecto,
        actividad, 
        proyecto, 
        usuario
    RESTART IDENTITY CASCADE;
`)
    .then(() => {
        console.log('✅ Base de datos limpiada.');
        console.log('📊 Insertando datos base (test_data.sql)...');
        return pool.query(sqlBase);
    })
    .then(() => {
        console.log('✅ Datos base insertados.');
        console.log('📊 Insertando datos adicionales (test_data_extra.sql)...');
        return pool.query(sqlExtra);
    })
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
