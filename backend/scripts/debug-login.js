const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'poa_system',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD
});

async function check() {
    try {
        const res = await pool.query("SELECT * FROM usuario WHERE correo = 'admin@uso.edu.sv'");
        if (res.rows.length === 0) {
            console.log('User not found');
            return;
        }
        const user = res.rows[0];
        console.log('User found:', user.email);
        console.log('Stored Hash:', user.contrasena);
        console.log('Hash length:', user.contrasena.length);

        console.log('Testing "123456"...');
        const match = await bcrypt.compare('123456', user.contrasena);
        console.log('Match Result:', match);

        const newHash = bcrypt.hashSync('123456', 10);
        console.log('New Generated Hash:', newHash);
        require('fs').writeFileSync('temp_hash.txt', newHash);

    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}

check();
