
import { query } from './db';
import bcrypt from 'bcryptjs';

const runMigration = async () => {
    try {
        console.log('Starting migration: Add password column to users table...');

        // 1. Check if column exists
        const checkColumn = await query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='usuario' AND column_name='contrasena';
        `);

        if (checkColumn.rows.length > 0) {
            console.log('Column "contrasena" already exists. Skipping...');
            return;
        }

        // 2. Generate hash for default password "123456"
        const salt = await bcrypt.genSalt(10);
        const defaultHash = await bcrypt.hash('123456', salt);

        // 3. Add column with default value
        await query(`
            ALTER TABLE usuario 
            ADD COLUMN contrasena VARCHAR(255) DEFAULT '${defaultHash}';
        `);

        console.log('Migration completed successfully. "contrasena" column added with default password.');
    } catch (error) {
        console.error('Migration failed:', error);
    }
};

runMigration();
