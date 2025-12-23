import { Pool } from 'pg';
import { config } from './index';

export const pool = new Pool({
    host: config.db.host,
    port: config.db.port,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password,
});

pool.on('connect', () => {
    console.log('✅ Conectado a PostgreSQL');
});

pool.on('error', (err) => {
    console.error('❌ Error en PostgreSQL:', err);
    process.exit(-1);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
