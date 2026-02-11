import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/database.js';

const router = express.Router();

// GET all users (excluding deleted)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, nombre, usuario, rol, created_at, updated_at FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// GET user by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT id, nombre, usuario, rol, created_at, updated_at FROM users WHERE id = $1 AND deleted_at IS NULL',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
});

// POST create new user
router.post('/', async (req, res) => {
    try {
        const { nombre, usuario, password, rol } = req.body;

        // Validate required fields
        if (!nombre || !usuario || !password || !rol) {
            return res.status(400).json({
                error: 'Todos los campos son requeridos: nombre, usuario, password, rol'
            });
        }

        // Validate rol
        if (!['Administrador', 'Sucursal'].includes(rol)) {
            return res.status(400).json({
                error: 'Rol debe ser "Administrador" o "Sucursal"'
            });
        }

        // Check if usuario already exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE usuario = $1 AND deleted_at IS NULL',
            [usuario]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'El usuario ya existe' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user
        const result = await pool.query(
            'INSERT INTO users (nombre, usuario, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, usuario, rol, created_at',
            [nombre, usuario, hashedPassword, rol]
        );

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

// PUT update user
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, usuario, password, rol } = req.body;

        // Check if user exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE id = $1 AND deleted_at IS NULL',
            [id]
        );

        if (existingUser.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Build update query dynamically
        const updates = [];
        const values = [];
        let paramCount = 1;

        if (nombre) {
            updates.push(`nombre = $${paramCount++}`);
            values.push(nombre);
        }

        if (usuario) {
            // Check if new usuario already exists
            const duplicateCheck = await pool.query(
                'SELECT id FROM users WHERE usuario = $1 AND id != $2 AND deleted_at IS NULL',
                [usuario, id]
            );

            if (duplicateCheck.rows.length > 0) {
                return res.status(409).json({ error: 'El usuario ya existe' });
            }

            updates.push(`usuario = $${paramCount++}`);
            values.push(usuario);
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push(`password = $${paramCount++}`);
            values.push(hashedPassword);
        }

        if (rol) {
            if (!['Administrador', 'Sucursal'].includes(rol)) {
                return res.status(400).json({
                    error: 'Rol debe ser "Administrador" o "Sucursal"'
                });
            }
            updates.push(`rol = $${paramCount++}`);
            values.push(rol);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No hay campos para actualizar' });
        }

        values.push(id);
        const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, nombre, usuario, rol, updated_at`;

        const result = await pool.query(query, values);

        res.json({
            message: 'Usuario actualizado exitosamente',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

// DELETE soft delete user
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL RETURNING id',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

export default router;
