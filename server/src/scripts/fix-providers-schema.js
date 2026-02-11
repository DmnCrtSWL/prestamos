import pool from '../config/database.js';

async function fixProvidersSchema() {
    try {
        console.log('🔄 Dropping old providers table...');
        await pool.query('DROP TABLE IF EXISTS providers CASCADE');

        console.log('📝 Creating new providers table...');
        const createTableQuery = `
            CREATE TABLE providers (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                initial_contribution DECIMAL(12, 2) DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP WITH TIME ZONE NULL
            );
        `;
        await pool.query(createTableQuery);

        console.log('📊 Creating indexes...');
        await pool.query('CREATE INDEX idx_providers_deleted_at ON providers(deleted_at)');
        await pool.query('CREATE INDEX idx_providers_name ON providers(name)');

        console.log('⚙️  Creating trigger...');
        await pool.query(`
            DROP TRIGGER IF EXISTS update_providers_updated_at ON providers;
            CREATE TRIGGER update_providers_updated_at 
            BEFORE UPDATE ON providers
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
        `);

        console.log('✅ Providers table schema fixed!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error fixing schema:', error);
        process.exit(1);
    }
}

fixProvidersSchema();
