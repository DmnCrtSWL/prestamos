import pool from '../config/database.js';

async function checkClients() {
    try {
        console.log('📋 Checking clients in database...\n');

        const result = await pool.query(
            'SELECT id, name, phone, curp, address, ine_front, ine_back, comprobant, created_at FROM clients WHERE deleted_at IS NULL ORDER BY created_at DESC'
        );

        console.log(`Found ${result.rows.length} client(s):\n`);

        result.rows.forEach((client, index) => {
            console.log(`${index + 1}. Client ID: ${client.id}`);
            console.log(`   Name: ${client.name}`);
            console.log(`   Phone: ${client.phone}`);
            console.log(`   CURP: ${client.curp}`);
            console.log(`   Address: ${client.address}`);
            console.log(`   INE Front: ${client.ine_front || 'N/A'}`);
            console.log(`   INE Back: ${client.ine_back || 'N/A'}`);
            console.log(`   Comprobant: ${client.comprobant || 'N/A'}`);
            console.log(`   Created: ${client.created_at}`);
            console.log('');
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkClients();
