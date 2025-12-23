const { Pool } = require('pg');
require('dotenv').config({ path: 'c:\\Users\\lenovo 2025\\Documents\\Proyecto POA\\Difinitiva\\sistema-poa-uso\\backend\\.env' });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function checkProyectos() {
    try {
        const res = await pool.query('SELECT id, nombre, anio FROM proyecto ORDER BY anio DESC, id DESC');
        console.log('Proyectos encontrados:', res.rows.length);
        console.table(res.rows);
    } catch (err) {
        console.error('Error querying database:', err);
    } finally {
        pool.end();
    }
}

checkProyectos();
