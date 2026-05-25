import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
    try {
        console.log('🔄 Running database migrations...');

        // Get migration file from command line arguments
        const migrationFile = process.argv[2];

        if (!migrationFile) {
            console.error('❌ Please provide a migration file path');
            console.log('Usage: node migrate.js migrations/xxx_migration_name.sql');
            process.exit(1);
        }

        const migrationPath = path.join(__dirname, '../..', migrationFile);

        if (!fs.existsSync(migrationPath)) {
            console.error(`❌ Migration file not found: ${migrationPath}`);
            process.exit(1);
        }

        const sql = fs.readFileSync(migrationPath, 'utf8');

        await pool.query(sql);

        console.log('✅ Migrations completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

runMigrations();
