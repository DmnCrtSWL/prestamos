import pool from '../config/database.js';

async function migrateProviders() {
    try {
        console.log('🔍 Checking/Creating providers table...');

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS providers (
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
        console.log('✅ Providers table created/verified.');

        // Create indexes
        console.log('born📊 Creating indexes...');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_providers_deleted_at ON providers(deleted_at)');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_providers_name ON providers(name)');

        // Trigger for updated_at
        console.log('⚙️  Ensuring trigger for updated_at...');

        // Function might already exist from other migrations, but good to ensure
        await pool.query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql';
        `);

        // Check if trigger exists before creating to avoid error
        const triggerCheck = await pool.query(`
            SELECT 1 FROM pg_trigger WHERE tgname = 'update_providers_updated_at'
        `);

        if (triggerCheck.rowCount === 0) {
            await pool.query(`
                CREATE TRIGGER update_providers_updated_at 
                BEFORE UPDATE ON providers
                FOR EACH ROW 
                EXECUTE FUNCTION update_updated_at_column();
            `);
            console.log('✅ Trigger created.');
        } else {
            console.log('ℹ️  Trigger already exists.');
        }

        console.log('🚀 Providers migration completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error during providers migration:', error);
        process.exit(1);
    }
}

migrateProviders();
