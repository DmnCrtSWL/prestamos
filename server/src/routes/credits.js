import express from 'express';
import pool from '../config/database.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for guarantor document uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads/guarantors');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
        }
    }
});

// POST /api/credits - Create new credit
router.post('/', upload.fields([
    { name: 'guarantor_ine_front', maxCount: 1 },
    { name: 'guarantor_ine_back', maxCount: 1 },
    { name: 'guarantor_address_proof', maxCount: 1 }
]), async (req, res) => {
    try {
        const {
            client_id,
            loan_amount,
            retention_amount,
            net_received,
            weekly_payment,
            total_to_pay,
            weeks = 12,
            user,
            guarantor_name,
            guarantor_phone,
            guarantor_address,
            payment_schedule,
            status = 'approved'
        } = req.body;

        // Validate required fields
        if (!client_id || !loan_amount || !guarantor_name || !guarantor_phone || !guarantor_address) {
            return res.status(400).json({
                error: 'Faltan campos requeridos: client_id, loan_amount, guarantor_name, guarantor_phone, guarantor_address'
            });
        }

        // Get uploaded file paths
        const guarantorIneFront = req.files['guarantor_ine_front']
            ? '/uploads/guarantors/' + req.files['guarantor_ine_front'][0].filename
            : null;
        const guarantorIneBack = req.files['guarantor_ine_back']
            ? '/uploads/guarantors/' + req.files['guarantor_ine_back'][0].filename
            : null;
        const guarantorAddressProof = req.files['guarantor_address_proof']
            ? '/uploads/guarantors/' + req.files['guarantor_address_proof'][0].filename
            : null;

        // Parse payment_schedule if it's a string
        let parsedPaymentSchedule = payment_schedule;
        if (typeof payment_schedule === 'string') {
            parsedPaymentSchedule = JSON.parse(payment_schedule);
        }

        const query = `
      INSERT INTO credits (
        client_id, loan_amount, retention_amount, net_received, 
        weekly_payment, total_to_pay, weeks, "user",
        guarantor_name, guarantor_phone, guarantor_address,
        guarantor_ine_front, guarantor_ine_back, guarantor_address_proof,
        payment_schedule, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `;

        const values = [
            client_id,
            loan_amount,
            retention_amount,
            net_received,
            weekly_payment,
            total_to_pay,
            weeks,
            user,
            guarantor_name,
            guarantor_phone,
            guarantor_address,
            guarantorIneFront,
            guarantorIneBack,
            guarantorAddressProof,
            JSON.stringify(parsedPaymentSchedule),
            status
        ];

        const result = await pool.query(query, values);

        res.status(201).json({
            message: 'Crédito creado exitosamente',
            credit: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating credit:', error);
        res.status(500).json({ error: 'Error al crear crédito: ' + error.message });
    }
});

// GET /api/credits/:id/funding-info - Get credit funding info and providers availability
router.get('/:id/funding-info', async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Get Credit Details
        const creditQuery = `
            SELECT 
                c.id, c.loan_amount, c.status, c."user",
                cl.name as client_name
            FROM credits c
            LEFT JOIN clients cl ON c.client_id = cl.id
            WHERE c.id = $1 AND c.deleted_at IS NULL
        `;
        const creditResult = await pool.query(creditQuery, [id]);

        if (creditResult.rows.length === 0) {
            return res.status(404).json({ error: 'Crédito no encontrado' });
        }
        const credit = creditResult.rows[0];

        // 2. Get Providers with Calculated Availability
        const providersQuery = `
            SELECT 
                p.id, 
                p.name, 
                p.initial_contribution,
                COALESCE(contributions.total, 0) as total_contributions,
                COALESCE(fundings.total, 0) as total_funded,
                (p.initial_contribution + COALESCE(contributions.total, 0) - COALESCE(fundings.total, 0)) as available_amount
            FROM providers p
            LEFT JOIN (
                SELECT provider_id, SUM(amount) as total
                FROM provider_contributions
                WHERE deleted_at IS NULL
                GROUP BY provider_id
            ) contributions ON p.id = contributions.provider_id
            LEFT JOIN (
                SELECT provider_id, SUM(amount) as total
                FROM credit_fundings
                GROUP BY provider_id
            ) fundings ON p.id = fundings.provider_id
            WHERE p.deleted_at IS NULL
            ORDER BY available_amount DESC
        `;
        const providersResult = await pool.query(providersQuery);

        // 3. Get Existing Fundings for this Credit
        const fundingsQuery = `
            SELECT cf.*, p.name as provider_name
            FROM credit_fundings cf
            JOIN providers p ON cf.provider_id = p.id
            WHERE cf.credit_id = $1
        `;
        const fundingsResult = await pool.query(fundingsQuery, [id]);

        res.json({
            credit,
            providers: providersResult.rows,
            fundings: fundingsResult.rows
        });
    } catch (error) {
        console.error('Error fetching funding info:', error);
        res.status(500).json({ error: 'Error al obtener información de fondeo' });
    }
});

// POST /api/credits/:id/fund - Fund a credit
router.post('/:id/fund', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { id } = req.params;
        const { allocations } = req.body; // Array of { provider_id, amount }

        if (!allocations || !Array.isArray(allocations) || allocations.length === 0) {
            throw new Error('Se requieren asignaciones válidas');
        }

        // 1. Validate total amount matches credit loan amount
        const creditQuery = 'SELECT loan_amount, status FROM credits WHERE id = $1 FOR UPDATE';
        const creditResult = await client.query(creditQuery, [id]);

        if (creditResult.rows.length === 0) {
            throw new Error('Crédito no encontrado');
        }

        const credit = creditResult.rows[0];
        const totalAllocated = allocations.reduce((sum, item) => sum + Number(item.amount), 0);

        // Use a small epsilon for float comparison if needed
        if (Math.abs(totalAllocated - Number(credit.loan_amount)) > 0.01) {
            throw new Error(`El total asignado (${totalAllocated}) no coincide con el monto del préstamo (${credit.loan_amount})`);
        }

        // 2. Clear existing fundings for this credit (if re-funding or updating)
        await client.query('DELETE FROM credit_fundings WHERE credit_id = $1', [id]);

        // 3. Process each allocation
        for (const allocation of allocations) {
            const { provider_id, amount } = allocation;

            // Check provider availability (excluding the amount currently being released if we were updating, but we just deleted it from DB so it's fine)
            // But we need to be careful with concurrency. `credit_fundings` rows are gone, so the `fundings` subquery in main query won't count them.

            const providerQuery = `
                SELECT 
                    p.id, 
                    p.name,
                    (p.initial_contribution + COALESCE(c.total, 0) - COALESCE(f.total, 0)) as available
                FROM providers p
                LEFT JOIN (
                    SELECT provider_id, SUM(amount) as total
                    FROM provider_contributions
                    WHERE deleted_at IS NULL
                    GROUP BY provider_id
                ) c ON p.id = c.provider_id
                LEFT JOIN (
                    SELECT provider_id, SUM(amount) as total
                    FROM credit_fundings
                    GROUP BY provider_id
                ) f ON p.id = f.provider_id
                WHERE p.id = $1
            `;
            // Note: We are inside a transaction. The DELETE above is visible to us. 
            // So 'f.total' will NOT include the funds for *this* credit (since we deleted them).
            // So 'available' represents what is available to be taken.

            const providerResult = await client.query(providerQuery, [provider_id]);
            if (providerResult.rows.length === 0) {
                throw new Error(`Proveedor ${provider_id} no encontrado`);
            }

            const provider = providerResult.rows[0];
            if (Number(provider.available) < Number(amount)) {
                throw new Error(`El proveedor ${provider.name} no tiene fondos suficientes. Disponible: ${provider.available}, Solicitado: ${amount}`);
            }

            // Insert funding
            await client.query(
                'INSERT INTO credit_fundings (credit_id, provider_id, amount) VALUES ($1, $2, $3)',
                [id, provider_id, amount]
            );
        }

        await client.query('COMMIT');
        res.json({ message: 'Fondeo guardado exitosamente' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error funding credit:', error);
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
});

// GET /api/credits - List all credits
router.get('/', async (req, res) => {
    try {
        const { status, client_id, user } = req.query;

        let query = `
      SELECT 
        c.*,
        cl.name as client_name,
        cl.phone as client_phone,
        cl.curp as client_curp,
        COALESCE(fundings.total, 0) as funded_amount
      FROM credits c
      LEFT JOIN clients cl ON c.client_id = cl.id
      LEFT JOIN (
        SELECT credit_id, SUM(amount) as total
        FROM credit_fundings
        GROUP BY credit_id
      ) fundings ON c.id = fundings.credit_id
      WHERE c.deleted_at IS NULL
    `;

        const values = [];
        let paramCount = 1;

        if (status) {
            query += ` AND c.status = $${paramCount}`;
            values.push(status);
            paramCount++;
        }

        if (client_id) {
            query += ` AND c.client_id = $${paramCount}`;
            values.push(client_id);
            paramCount++;
        }

        if (user) {
            query += ` AND c.user = $${paramCount}`;
            values.push(user);
            paramCount++;
        }

        query += ' ORDER BY c.created_at DESC';

        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching credits:', error);
        res.status(500).json({ error: 'Error al obtener créditos' });
    }
});

// GET /api/credits/:id - Get single credit
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
      SELECT 
        c.*,
        cl.name as client_name,
        cl.phone as client_phone,
        cl.curp as client_curp,
        cl.address as client_address
      FROM credits c
      LEFT JOIN clients cl ON c.client_id = cl.id
      WHERE c.id = $1 AND c.deleted_at IS NULL
    `;

        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Crédito no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching credit:', error);
        res.status(500).json({ error: 'Error al obtener crédito' });
    }
});

// PUT /api/credits/:id - Update credit
router.put('/:id', upload.fields([
    { name: 'guarantor_ine_front', maxCount: 1 },
    { name: 'guarantor_ine_back', maxCount: 1 },
    { name: 'guarantor_address_proof', maxCount: 1 }
]), async (req, res) => {
    try {
        const { id } = req.params;
        const {
            status,
            guarantor_name,
            guarantor_phone,
            guarantor_address,
            payment_schedule
        } = req.body;

        // Build dynamic update query
        const updates = [];
        const values = [];
        let paramCount = 1;

        if (status) {
            updates.push(`status = $${paramCount}`);
            values.push(status);
            paramCount++;
        }

        if (guarantor_name) {
            updates.push(`guarantor_name = $${paramCount}`);
            values.push(guarantor_name);
            paramCount++;
        }

        if (guarantor_phone) {
            updates.push(`guarantor_phone = $${paramCount}`);
            values.push(guarantor_phone);
            paramCount++;
        }

        if (guarantor_address) {
            updates.push(`guarantor_address = $${paramCount}`);
            values.push(guarantor_address);
            paramCount++;
        }

        if (payment_schedule) {
            updates.push(`payment_schedule = $${paramCount}`);
            values.push(JSON.stringify(payment_schedule));
            paramCount++;
        }

        // Handle file uploads
        if (req.files['guarantor_ine_front']) {
            const filePath = '/uploads/guarantors/' + req.files['guarantor_ine_front'][0].filename;
            updates.push(`guarantor_ine_front = $${paramCount}`);
            values.push(filePath);
            paramCount++;
        }

        if (req.files['guarantor_ine_back']) {
            const filePath = '/uploads/guarantors/' + req.files['guarantor_ine_back'][0].filename;
            updates.push(`guarantor_ine_back = $${paramCount}`);
            values.push(filePath);
            paramCount++;
        }

        if (req.files['guarantor_address_proof']) {
            const filePath = '/uploads/guarantors/' + req.files['guarantor_address_proof'][0].filename;
            updates.push(`guarantor_address_proof = $${paramCount}`);
            values.push(filePath);
            paramCount++;
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No hay campos para actualizar' });
        }

        values.push(id);
        const query = `
      UPDATE credits 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount} AND deleted_at IS NULL
      RETURNING *
    `;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Crédito no encontrado' });
        }

        res.json({
            message: 'Crédito actualizado exitosamente',
            credit: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating credit:', error);
        res.status(500).json({ error: 'Error al actualizar crédito: ' + error.message });
    }
});

// DELETE /api/credits/:id - Soft delete credit
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
      UPDATE credits 
      SET deleted_at = CURRENT_TIMESTAMP 
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id
    `;

        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Crédito no encontrado' });
        }

        res.json({ message: 'Crédito eliminado exitosamente' });
    } catch (error) {
        console.error('Error deleting credit:', error);
        res.status(500).json({ error: 'Error al eliminar crédito' });
    }
});

export default router;
