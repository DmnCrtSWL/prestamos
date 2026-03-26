import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// CDMX es UTC-6 permanente (México abolió el horario de verano en 2023)
const CDMX_TZ = 'America/Mexico_City';

// Helper to generate random alphanumeric folio XXXX-XXXX-XXXX
const generateFolio = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let folio = '';
    for (let i = 0; i < 12; i++) {
        if (i > 0 && i % 4 === 0) folio += '-';
        folio += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return folio;
};

// GET /api/incomes - List all incomes
router.get('/', async (req, res) => {
    try {
        const { credit_id, startDate, endDate } = req.query;

        // Convertimos created_at a timezone CDMX para que el filtro de fechas
        // sea correcto independientemente del timezone del servidor
        let query = `
            SELECT
                i.*,
                (i.created_at AT TIME ZONE '${CDMX_TZ}') as created_at_cdmx,
                c.loan_amount as credit_amount,
                cl.name as client_name
            FROM incomes i
            LEFT JOIN credits c ON i.credit_id = c.id
            LEFT JOIN clients cl ON i.client_id = cl.id
            WHERE i.deleted_at IS NULL
        `;

        const params = [];
        let paramCount = 1;

        if (credit_id) {
            query += ` AND i.credit_id = $${paramCount}`;
            params.push(credit_id);
            paramCount++;
        }

        if (startDate) {
            // Comparar contra la fecha en CDMX, no en UTC del servidor
            query += ` AND (i.created_at AT TIME ZONE '${CDMX_TZ}')::date >= $${paramCount}::date`;
            params.push(startDate);
            paramCount++;
        }

        if (endDate) {
            query += ` AND (i.created_at AT TIME ZONE '${CDMX_TZ}')::date <= $${paramCount}::date`;
            params.push(endDate);
            paramCount++;
        }

        query += ` ORDER BY i.created_at DESC`;

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching incomes:', error);
        res.status(500).json({ error: `Error al obtener ingresos: ${error.message}` });
    }
});

// POST /api/incomes - Create new income
router.post('/', async (req, res) => {
    try {
        const { credit_id, client_id, payment_method, amount, user } = req.body;

        if (!credit_id || !client_id || !payment_method || !amount) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        let folio = generateFolio();
        let folioExists = true;
        while (folioExists) {
            const check = await pool.query('SELECT id FROM incomes WHERE folio = $1', [folio]);
            if (check.rows.length === 0) {
                folioExists = false;
            } else {
                folio = generateFolio();
            }
        }

        const query = `
            INSERT INTO incomes (folio, credit_id, client_id, payment_method, amount, "user")
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const values = [folio, credit_id, client_id, payment_method, amount, user || null];
        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating income:', error);
        res.status(500).json({ error: `Error al registrar ingreso: ${error.message}` });
    }
});

export default router;
