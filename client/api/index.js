import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

console.log('--- STARTING APP ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB URL Defined?', !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
  console.log('DB URL Start:', process.env.DATABASE_URL.substring(0, 10) + '...');
} else {
  console.error('CRITICAL: DATABASE_URL is missing! pg will default to localhost.');
}

app.use(cors());
app.use(express.json());

// Configuración Pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')
    ? { rejectUnauthorized: false }
    : undefined
});

// Health Check
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      message: 'Conectado a la BD',
      time: result.rows[0].now
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error de conexión' });
  }
});

/**
 * USERS CRUD
 */

// GET ALL USERS (Active)
app.get('/api/users', async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM users WHERE deleted_at IS NULL';
    const params = [];

    if (search) {
      query += ` AND (name ILIKE $1 OR email ILIKE $1)`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('DATABASE ERROR:', err);
    console.log('DB URL exists?', !!process.env.DATABASE_URL); // Debug info without exposing secret
    res.status(500).json({
      error: 'Error al obtener usuarios',
      details: process.env.NODE_ENV === 'development' ? err.message : 'Check server logs'
    });
  }
});

// GET USER BY ID
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// CREATE USER
app.post('/api/users', async (req, res) => {
  const { name, email, phone, role } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, phone, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, phone, role || 'Usuario']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') { // Unique violation
      return res.status(400).json({ error: 'El correo electrónico ya existe' });
    }
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// UPDATE USER
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, role } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, phone = $3, role = $4, updated_at = NOW() WHERE id = $5 AND deleted_at IS NULL RETURNING *',
      [name, email, phone, role, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// DELETE USER (Soft Delete)
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE users SET deleted_at = NOW() WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});


/**
 * PROVIDERS CRUD
 */

// GET ALL PROVIDERS
app.get('/api/providers', async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM providers WHERE deleted_at IS NULL';
    const params = [];

    if (search) {
      query += ` AND (name ILIKE $1 OR email ILIKE $1)`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener proveedores' });
  }
});

// GET PROVIDER BY ID
app.get('/api/providers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM providers WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener proveedor' });
  }
});

// CREATE PROVIDER
app.post('/api/providers', async (req, res) => {
  const { name, email, phone, contact_name, address } = req.body;

  // Validations
  if (!name) return res.status(400).json({ error: 'El nombre es obligatorio' });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Email inválido' });
  if (phone && !/^\d{10}$/.test(phone)) return res.status(400).json({ error: 'El teléfono debe tener 10 dígitos' });

  try {
    const result = await pool.query(
      'INSERT INTO providers (name, email, phone, contact_name, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, phone || null, contact_name || null, address || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'El correo electrónico ya existe' });
    }
    res.status(500).json({ error: 'Error al crear proveedor' });
  }
});

// UPDATE PROVIDER
app.put('/api/providers/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, contact_name, address } = req.body;

  // Validations
  if (!name) return res.status(400).json({ error: 'El nombre es obligatorio' });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Email inválido' });
  if (phone && !/^\d{10}$/.test(phone)) return res.status(400).json({ error: 'El teléfono debe tener 10 dígitos' });

  try {
    const result = await pool.query(
      'UPDATE providers SET name = $1, email = $2, phone = $3, contact_name = $4, address = $5, updated_at = NOW() WHERE id = $6 AND deleted_at IS NULL RETURNING *',
      [name, email, phone || null, contact_name || null, address || null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'El correo electrónico ya existe' });
    }
    res.status(500).json({ error: 'Error al actualizar proveedor' });
  }
});

// DELETE PROVIDER
app.delete('/api/providers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE providers SET deleted_at = NOW() WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    res.json({ message: 'Proveedor eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar proveedor' });
  }
});


// Local server
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Servidor API escuchando en http://localhost:${port}`);
  });
}

export default app;
