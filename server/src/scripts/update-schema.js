import pool from '../config/database.js';

async function checkAndUpdateSchema() {
    try {
        console.log('🔍 Checking database schema...');

        // Check if users table exists
        const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);

        if (tableCheck.rows[0].exists) {
            console.log('📋 Users table exists, checking columns...');

            // Get current columns
            const columnsResult = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position;
      `);

            console.log('Current columns:');
            columnsResult.rows.forEach(col => {
                console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
            });

            // Drop and recreate table
            console.log('\n🔄 Dropping and recreating users table...');
            await pool.query('DROP TABLE IF EXISTS users CASCADE');
        }

        // Create table with correct schema
        console.log('📝 Creating users table...');
        await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        usuario VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        rol VARCHAR(50) NOT NULL CHECK (rol IN ('Administrador', 'Sucursal')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL
      );
    `);

        // Create indexes
        console.log('📊 Creating indexes...');
        await pool.query('CREATE INDEX idx_users_deleted_at ON users(deleted_at)');
        await pool.query('CREATE INDEX idx_users_usuario ON users(usuario)');

        // Create function and trigger
        console.log('⚙️  Creating trigger function...');
        await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

        await pool.query(`
      CREATE TRIGGER update_users_updated_at 
      BEFORE UPDATE ON users
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
    `);

        console.log('✅ Database schema updated successfully!');

        // Show final schema
        const finalColumns = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);

        console.log('\n📋 Final schema:');
        finalColumns.rows.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'}) ${col.column_default ? `default: ${col.column_default}` : ''}`);
        });

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        await pool.end();
        process.exit(1);
    }
}

checkAndUpdateSchema();
