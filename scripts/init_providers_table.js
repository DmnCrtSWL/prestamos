import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS providers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    contact_name VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
  );
`;

const seedQuery = `
  INSERT INTO providers (name, email, phone, contact_name, address)
  VALUES 
    ('Proveedor Estándar', 'contacto@proveedor.com', '5512345678', 'Juan Pérez', 'Av. Siempre Viva 123'),
    ('Distribuidora del Norte', 'ventas@distnorte.com', '8187654321', 'Maria Garcia', 'Calle 10, Monterrey')
  ON CONFLICT (email) DO NOTHING;
`;

async function createTable() {
    try {
        const client = await pool.connect();
        console.log('Connected to database...');

        await client.query(createTableQuery);
        console.log('Providers table created successfully.');

        await client.query(seedQuery);
        console.log('Seed data inserted.');

        client.release();
    } catch (err) {
        console.error('Error creating table:', err);
    } finally {
        pool.end();
    }
}

createTable();
