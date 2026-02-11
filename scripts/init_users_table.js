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
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'Usuario',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
  );
`;

const seedQuery = `
  INSERT INTO users (name, email, phone, role)
  VALUES 
    ('Administrador General', 'admin@prestamos.com', '555-000-0000', 'Administrador'),
    ('Sucursal 1', 'sucursal1@prestamos.com', '555-000-0001', 'Sucursal')
  ON CONFLICT (email) DO NOTHING;
`;

async function createTable() {
    try {
        const client = await pool.connect();
        console.log('Connected to database...');

        await client.query(createTableQuery);
        console.log('Users table created successfully.');

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
