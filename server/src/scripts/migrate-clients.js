import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
    try {
        console.log('🔄 Running clients table migration...\n');

        const sqlPath = path.join(__dirname, '../../migrations/002_create_clients_table.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        await pool.query(sql);

        console.log('✅ Clients table migration completed successfully\n');

        // Verify table was created
        const result = await pool.query(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clients'"
        );

        if (result.rows.length > 0) {
            console.log('✅ Clients table verified in database');
        } else {
            console.log('❌ Clients table not found after migration');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

runMigration();
