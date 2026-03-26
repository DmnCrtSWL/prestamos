import pool from '../config/database.js';

async function addCreatedByToProviders() {
    try {
        console.log('🔄 Adding created_by column to providers table...');

        await pool.query(`
            ALTER TABLE providers
            ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id)
        `);

        console.log('✅ Column created_by added to providers table successfully.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding created_by column:', error);
        process.exit(1);
    }
}

addCreatedByToProviders();
