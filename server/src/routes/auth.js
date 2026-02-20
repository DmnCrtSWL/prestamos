import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { usuario, password } = req.body;

        if (!usuario || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
        }

        // Find user by username
        const result = await pool.query(
            'SELECT id, nombre, usuario, password, rol FROM users WHERE usuario = $1 AND deleted_at IS NULL',
            [usuario]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const user = result.rows[0];

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Sign JWT
        const token = jwt.sign(
            { id: user.id, nombre: user.nombre, usuario: user.usuario, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                usuario: user.usuario,
                rol: user.rol,
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;
