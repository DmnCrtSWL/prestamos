import pool from '../config/database.js';

async function migrateProviderContributions() {
    try {
        console.log('🔍 Checking/Creating provider_contributions table...');

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS provider_contributions (
                id SERIAL PRIMARY KEY,
                provider_id INTEGER REFERENCES providers(id) ON DELETE CASCADE,
                amount DECIMAL(12, 2) NOT NULL,
                payment_date DATE DEFAULT CURRENT_DATE,
                note TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP WITH TIME ZONE NULL
            );
        `;

        await pool.query(createTableQuery);

        console.log('born📊 Creating indexes...');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_provider_contributions_provider_id ON provider_contributions(provider_id)');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_provider_contributions_deleted_at ON provider_contributions(deleted_at)');

        await pool.query(`
            DROP TRIGGER IF EXISTS update_provider_contributions_updated_at ON provider_contributions;
            CREATE TRIGGER update_provider_contributions_updated_at 
            BEFORE UPDATE ON provider_contributions
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
        `);

        console.log('✅ Provider contributions table setup complete!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error migrating provider_contributions:', error);
        process.exit(1);
    }
}

migrateProviderContributions();
