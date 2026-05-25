import pool from '../config/database.js';

async function checkUsers() {
    try {
        console.log('📋 Checking users in database...\n');

        const result = await pool.query(`
      SELECT id, nombre, usuario, rol, created_at, updated_at
      FROM users
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `);

        if (result.rows.length === 0) {
            console.log('No users found in database.');
        } else {
            console.log(`Found ${result.rows.length} user(s):\n`);
            result.rows.forEach((user, index) => {
                console.log(`${index + 1}. User ID: ${user.id}`);
                console.log(`   Nombre: ${user.nombre}`);
                console.log(`   Usuario: ${user.usuario}`);
                console.log(`   Rol: ${user.rol}`);
                console.log(`   Created: ${user.created_at}`);
                console.log(`   Updated: ${user.updated_at}`);
                console.log('');
            });
        }

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        await pool.end();
        process.exit(1);
    }
}

checkUsers();
