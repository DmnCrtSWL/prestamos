import pool from '../config/database.js';

async function debugProviders() {
    try {
        console.log('🔍 Checking providers table...');
        const res = await pool.query("SELECT to_regclass('public.providers')");
        console.log('Table check result:', res.rows[0]);

        if (!res.rows[0].to_regclass) {
            console.error('❌ Table providers does NOT exist!');
        } else {
            console.log('✅ Table providers exists.');
            // Check columns
            const cols = await pool.query("SELECT * FROM information_schema.columns WHERE table_name = 'providers'");
            console.log('Columns:', cols.rows.map(c => c.column_name));
        }

        process.exit(0);
    } catch (e) {
        console.error('❌ Error connecting to DB:', e);
        process.exit(1);
    }
}

debugProviders();
