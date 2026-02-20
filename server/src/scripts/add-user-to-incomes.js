import pool from '../config/database.js';

async function migrate() {
    try {
        console.log('Adding "user" column to incomes table...');
        await pool.query('ALTER TABLE incomes ADD COLUMN IF NOT EXISTS "user" VARCHAR(255);');
        console.log('Successfully added "user" column.');
    } catch (error) {
        console.error('Error during migration:', error);
    } finally {
        await pool.end();
    }
}

migrate();
