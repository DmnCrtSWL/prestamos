import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// GET /api/providers - List all active providers with total capital
router.get('/', async (req, res) => {
    try {
        const { rol } = req.query;
        const onlyVisible = rol === 'Empleado';

        const query = `
            SELECT 
                p.*,
                (COALESCE(p.initial_contribution, 0) + COALESCE(contributions.total, 0)) as total_invested,
                (COALESCE(p.initial_contribution, 0) + COALESCE(contributions.total, 0) - COALESCE(fundings.total, 0)) as total_capital
            FROM providers p
            LEFT JOIN (
                SELECT provider_id, SUM(amount) as total
                FROM provider_contributions
                WHERE deleted_at IS NULL
                GROUP BY provider_id
            ) contributions ON p.id = contributions.provider_id
            LEFT JOIN (
                SELECT cf.provider_id, SUM(cf.amount) as total
                FROM credit_fundings cf
                JOIN credits c ON cf.credit_id = c.id
                WHERE c.deleted_at IS NULL
                GROUP BY cf.provider_id
            ) fundings ON p.id = fundings.provider_id
            WHERE p.deleted_at IS NULL 
            ${onlyVisible ? 'AND p.visible_empleados = TRUE' : ''}
            ORDER BY p.created_at DESC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching providers:', error);
        res.status(500).json({ error: 'Error al obtener proveedores' });
    }
});

// GET /api/providers/:id/contributions - List contributions and fundings
router.get('/:id/contributions', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT 
                id,
                amount, 
                payment_date, 
                note,
                created_at,
                'contribution' as type
            FROM provider_contributions 
            WHERE provider_id = $1 AND deleted_at IS NULL
            
            UNION ALL
            
            SELECT 
                cf.id,
                -cf.amount as amount, -- Negative amount for deduction
                cf.created_at::date as payment_date,
                CONCAT('Fondeo Crédito #', c.id, ' - ', cl.name) as note,
                cf.created_at,
                'funding' as type
            FROM credit_fundings cf
            JOIN credits c ON cf.credit_id = c.id
            JOIN clients cl ON c.client_id = cl.id
            WHERE cf.provider_id = $1 AND c.deleted_at IS NULL

            ORDER BY created_at DESC
        `;
        const result = await pool.query(query, [id]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching contributions:', error);
        res.status(500).json({ error: 'Error al obtener historial' });
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

// PATCH /api/providers/:id/visible-empleados - Toggle visibility for Empleados
router.patch('/:id/visible-empleados', async (req, res) => {
    try {
        const { id } = req.params;
        const { visible } = req.body;

        if (typeof visible !== 'boolean') {
            return res.status(400).json({ error: 'El campo visible debe ser booleano' });
        }

        const query = `
            UPDATE providers
            SET visible_empleados = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2 AND deleted_at IS NULL
            RETURNING id, visible_empleados
        `;
        const result = await pool.query(query, [visible, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating visible_empleados:', error);
        res.status(500).json({ error: 'Error al actualizar visibilidad' });
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
