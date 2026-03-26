import pool from '../config/database.js';

async function fixCreditsTimestamps() {
    try {
        console.log('🔄 Convirtiendo timestamps de credits a TIMESTAMP WITH TIME ZONE...');

        const columns = ['created_at', 'updated_at', 'deleted_at'];

        for (const col of columns) {
            const check = await pool.query(`
                SELECT data_type FROM information_schema.columns
                WHERE table_name = 'credits' AND column_name = $1
            `, [col]);

            if (check.rows[0]?.data_type === 'timestamp without time zone') {
                await pool.query(`
                    ALTER TABLE credits
                    ALTER COLUMN ${col} TYPE TIMESTAMP WITH TIME ZONE
                    USING ${col} AT TIME ZONE 'UTC'
                `);
                console.log(`✅ credits.${col} → TIMESTAMP WITH TIME ZONE`);
            } else {
                console.log(`ℹ️  credits.${col} ya es correcto (${check.rows[0]?.data_type})`);
            }
        }

        // Mismo fix para incomes por si acaso no se corrió el script anterior
        const incomesCols = ['created_at', 'updated_at', 'deleted_at'];
        for (const col of incomesCols) {
            const check = await pool.query(`
                SELECT data_type FROM information_schema.columns
                WHERE table_name = 'incomes' AND column_name = $1
            `, [col]);

            if (check.rows[0]?.data_type === 'timestamp without time zone') {
                await pool.query(`
                    ALTER TABLE incomes
                    ALTER COLUMN ${col} TYPE TIMESTAMP WITH TIME ZONE
                    USING ${col} AT TIME ZONE 'UTC'
                `);
                console.log(`✅ incomes.${col} → TIMESTAMP WITH TIME ZONE`);
            } else {
                console.log(`ℹ️  incomes.${col} ya es correcto`);
            }
        }

        console.log('\n🎉 Timestamps corregidos. Todos los registros quedan en UTC (correcto para CDMX UTC-6).');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

fixCreditsTimestamps();
