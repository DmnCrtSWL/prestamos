import pool from '../config/database.js';

const clientIds = [14, 15, 16];

async function deleteData() {
    const client = await pool.connect();
    try {
        console.log(`Starting deletion for clients: ${clientIds.join(', ')}...`);
        await client.query('BEGIN');

        // 1. Get credit_ids for these clients
        const creditsResult = await client.query('SELECT id FROM credits WHERE client_id = ANY($1)', [clientIds]);
        const creditIds = creditsResult.rows.map(r => r.id);

        if (creditIds.length > 0) {
            console.log(`Found ${creditIds.length} credits to delete.`);

            // 2. Delete from credit_fundings
            const fundingsDel = await client.query('DELETE FROM credit_fundings WHERE credit_id = ANY($1)', [creditIds]);
            console.log(`- Deleted ${fundingsDel.rowCount} credit fundings.`);

            // 3. Delete from incomes where credit_id is one of these
            const incomesCreditDel = await client.query('DELETE FROM incomes WHERE credit_id = ANY($1)', [creditIds]);
            console.log(`- Deleted ${incomesCreditDel.rowCount} incomes related to these credits.`);
        }

        // 4. Delete from incomes where client_id is one of these (just in case)
        const incomesClientDel = await client.query('DELETE FROM incomes WHERE client_id = ANY($1)', [clientIds]);
        console.log(`- Deleted ${incomesClientDel.rowCount} incomes directly related to these clients.`);

        // 5. Delete from credits
        const creditsDel = await client.query('DELETE FROM credits WHERE client_id = ANY($1)', [clientIds]);
        console.log(`- Deleted ${creditsDel.rowCount} credits.`);

        // 6. Delete from clients
        const clientsDel = await client.query('DELETE FROM clients WHERE id = ANY($1)', [clientIds]);
        console.log(`- Deleted ${clientsDel.rowCount} clients.`);

        await client.query('COMMIT');
        console.log('✅ All data deleted successfully.');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error deleting data:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

deleteData();
