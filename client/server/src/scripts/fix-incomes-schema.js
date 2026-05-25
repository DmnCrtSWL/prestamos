import pool from '../config/database.js';

async function fixIncomesSchema() {
    try {
        console.log('🔄 Verificando y corrigiendo tabla incomes...');

        // 1. Asegurar columna client_id
        await pool.query(`
            ALTER TABLE incomes
            ADD COLUMN IF NOT EXISTS client_id INTEGER REFERENCES clients(id)
        `);
        console.log('✅ client_id OK');

        // 2. Asegurar columna deleted_at
        await pool.query(`
            ALTER TABLE incomes
            ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
        `);
        console.log('✅ deleted_at OK');

        // 3. Asegurar columna "user"
        await pool.query(`
            ALTER TABLE incomes
            ADD COLUMN IF NOT EXISTS "user" VARCHAR(255)
        `);
        console.log('✅ "user" OK');

        // 4. Convertir created_at a TIMESTAMP WITH TIME ZONE para manejar timezone correctamente
        //    Interpretamos los valores existentes como UTC (timezone del servidor)
        const colCheck = await pool.query(`
            SELECT data_type FROM information_schema.columns
            WHERE table_name = 'incomes' AND column_name = 'created_at'
        `);

        if (colCheck.rows[0]?.data_type === 'timestamp without time zone') {
            await pool.query(`
                ALTER TABLE incomes
                ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE
                USING created_at AT TIME ZONE 'UTC'
            `);
            console.log('✅ created_at convertido a TIMESTAMP WITH TIME ZONE (UTC)');
        } else {
            console.log('ℹ️  created_at ya es TIMESTAMP WITH TIME ZONE');
        }

        // Mismo para updated_at
        const updColCheck = await pool.query(`
            SELECT data_type FROM information_schema.columns
            WHERE table_name = 'incomes' AND column_name = 'updated_at'
        `);

        if (updColCheck.rows[0]?.data_type === 'timestamp without time zone') {
            await pool.query(`
                ALTER TABLE incomes
                ALTER COLUMN updated_at TYPE TIMESTAMP WITH TIME ZONE
                USING updated_at AT TIME ZONE 'UTC'
            `);
            console.log('✅ updated_at convertido a TIMESTAMP WITH TIME ZONE');
        }

        console.log('\n🎉 Schema de incomes corregido exitosamente.');
        console.log('ℹ️  Los registros existentes fueron marcados como UTC.');
        console.log('ℹ️  Los filtros de fecha ahora usan timezone America/Mexico_City (UTC-6).');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixIncomesSchema();
