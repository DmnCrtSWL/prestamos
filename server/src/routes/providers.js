import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// GET /api/providers - List all active providers with total capital
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                p.*,
                (COALESCE(p.initial_contribution, 0) + COALESCE(
                    (SELECT SUM(amount) 
                     FROM provider_contributions 
                     WHERE provider_id = p.id AND deleted_at IS NULL), 0)
                ) as total_capital
            FROM providers p
            WHERE p.deleted_at IS NULL 
            ORDER BY p.created_at DESC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching providers:', error);
        res.status(500).json({ error: 'Error al obtener proveedores' });
    }
});

// GET /api/providers/:id/contributions - List contributions
router.get('/:id/contributions', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT * FROM provider_contributions 
            WHERE provider_id = $1 AND deleted_at IS NULL
            ORDER BY payment_date DESC, created_at DESC
        `;
        const result = await pool.query(query, [id]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching contributions:', error);
        res.status(500).json({ error: 'Error al obtener aportaciones' });
    }
});

// POST /api/providers/:id/contributions - Add contribution
router.post('/:id/contributions', async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, payment_date, note } = req.body;

        if (!amount) {
            return res.status(400).json({ error: 'El monto es obligatorio' });
        }

        const query = `
            INSERT INTO provider_contributions (provider_id, amount, payment_date, note)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [id, amount, payment_date || new Date(), note];
        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating contribution:', error);
        res.status(500).json({ error: 'Error al crear aportación' });
    }
});

// DELETE /api/providers/:id/contributions/:contributionId
router.delete('/:id/contributions/:contributionId', async (req, res) => {
    try {
        const { id, contributionId } = req.params;
        const query = `
            UPDATE provider_contributions
            SET deleted_at = CURRENT_TIMESTAMP
            WHERE id = $1 AND provider_id = $2 AND deleted_at IS NULL
            RETURNING id
        `;
        const result = await pool.query(query, [contributionId, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Aportación no encontrada' });
        }

        res.json({ message: 'Aportación eliminada' });
    } catch (error) {
        console.error('Error deleting contribution:', error);
        res.status(500).json({ error: 'Error al eliminar aportación' });
    }
});

// GET /api/providers/:id - Get specific provider
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT * FROM providers 
            WHERE id = $1 AND deleted_at IS NULL
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching provider:', error);
        res.status(500).json({ error: 'Error al obtener proveedor' });
    }
});

// POST /api/providers - Create new provider
router.post('/', async (req, res) => {
    try {
        const { name, phone, initial_contribution } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'El nombre es obligatorio' });
        }

        const query = `
            INSERT INTO providers (name, phone, initial_contribution)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

        const values = [name, phone, initial_contribution || 0];
        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating provider:', error);
        res.status(500).json({ error: 'Error al crear proveedor' });
    }
});

// PUT /api/providers/:id - Update provider
router.update = router.put; // Alias for consistency if needed, though standard is use PUT
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, initial_contribution } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'El nombre es obligatorio' });
        }

        const query = `
            UPDATE providers 
            SET name = $1, phone = $2, initial_contribution = $3, updated_at = CURRENT_TIMESTAMP
            WHERE id = $4 AND deleted_at IS NULL
            RETURNING *
        `;

        const values = [name, phone, initial_contribution || 0, id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating provider:', error);
        res.status(500).json({ error: 'Error al actualizar proveedor' });
    }
});

// DELETE /api/providers/:id - Soft delete provider
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            UPDATE providers 
            SET deleted_at = CURRENT_TIMESTAMP 
            WHERE id = $1 AND deleted_at IS NULL
            RETURNING id
        `;

        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        res.json({ message: 'Proveedor eliminado correctamente' });
    } catch (error) {
        console.error('Error deleting provider:', error);
        res.status(500).json({ error: 'Error al eliminar proveedor' });
    }
});

export default router;
