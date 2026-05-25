import pool from './src/config/database.js';

const clientIds = [14, 15, 16];

async function countData() {
    try {
        console.log(`Counting data related to clients: ${clientIds.join(', ')}...`);

        // Get credits
        const credits = await pool.query('SELECT id FROM credits WHERE client_id = ANY($1)', [clientIds]);
        const creditIds = credits.rows.map(r => r.id);

        console.log(`- Clients to delete: ${clientIds.length}`);
        
        const incomesByClient = await pool.query('SELECT COUNT(*) FROM incomes WHERE client_id = ANY($1)', [clientIds]);
        console.log(`- Incomes related directly to these clients: ${incomesByClient.rows[0].count}`);

        if (creditIds.length > 0) {
            console.log(`- Credits related: ${creditIds.length}`);
            
            const incomesByCredit = await pool.query('SELECT COUNT(*) FROM incomes WHERE credit_id = ANY($1)', [creditIds]);
            console.log(`- Incomes related to these credits: ${incomesByCredit.rows[0].count}`);
            
            const fundings = await pool.query('SELECT COUNT(*) FROM credit_fundings WHERE credit_id = ANY($1)', [creditIds]);
            console.log(`- Credit fundings related: ${fundings.rows[0].count}`);
        } else {
            console.log(`- No credits found for these clients.`);
        }

    } catch (error) {
        console.error('Error counting data:', error);
    } finally {
        await pool.end();
    }
}

countData();
