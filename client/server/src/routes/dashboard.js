import express from 'express';
import pool from '../config/database.js';

const router = express.Router();
const CDMX_TZ = 'America/Mexico_City';

// GET /api/dashboard
// Query param: user=USERNAME  →  filtra por ese usuario (Sucursal/Empleado)
// Sin user param              →  muestra todos (Administrador)
router.get('/', async (req, res) => {
    try {
        const { user } = req.query;
        const params = user ? [user] : [];
        // Condición de usuario sobre la tabla de créditos (alias "c")
        const uc = user ? `AND c."user" = $1` : '';

        // ── Stats en una sola query ───────────────────────────────────────────
        const statsResult = await pool.query(`
            SELECT
                -- Créditos activos (sin liquidar)
                (
                    SELECT COUNT(*)
                    FROM credits c
                    WHERE c.deleted_at IS NULL AND c.status IN ('active', 'approved') ${uc}
                      AND (
                        c.loan_type = '10% Semanal'
                        OR c.total_to_pay::numeric > COALESCE((SELECT SUM(amount) FROM incomes WHERE credit_id = c.id AND deleted_at IS NULL), 0)
                      )
                ) AS creditos_activos,

                -- Montos cobrados TOTALES (histórico)
                (
                    SELECT COALESCE(SUM(i.amount), 0)
                    FROM incomes i
                    JOIN credits c ON i.credit_id = c.id AND c.deleted_at IS NULL
                    WHERE i.deleted_at IS NULL ${uc}
                ) AS montos_cobrados_mes,

                -- Ganancias netas (Lo cobrado - Lo prestado)
                (
                    (
                        SELECT COALESCE(SUM(i.amount), 0)
                        FROM incomes i
                        JOIN credits c ON i.credit_id = c.id AND c.deleted_at IS NULL
                        WHERE i.deleted_at IS NULL ${uc}
                    )
                    -
                    (
                        SELECT COALESCE(SUM(c.loan_amount), 0)
                        FROM credits c
                        WHERE c.deleted_at IS NULL AND c.status NOT IN ('rejected', 'completed') ${uc}
                        -- wait, if completed it shouldn't be subtracted? "lo que se ha prestado" usually includes all.
                    )
                ) AS ganancias_netas_mes_temp,

                -- Ganancia neta real (Total Incomes - Total Loaned)
                (
                    (SELECT COALESCE(SUM(i.amount), 0) FROM incomes i JOIN credits c ON i.credit_id = c.id WHERE i.deleted_at IS NULL AND c.deleted_at IS NULL ${uc})
                    -
                    (SELECT COALESCE(SUM(c.loan_amount), 0) FROM credits c WHERE c.deleted_at IS NULL AND c.status IN ('active', 'approved', 'completed') ${uc})
                ) AS ganancias_netas_mes,

                -- Monto en circulación (deuda pendiente de créditos activos)
                (
                    SELECT COALESCE(SUM(c.total_to_pay - COALESCE(paid.amt, 0)), 0)
                    FROM credits c
                    LEFT JOIN (
                        SELECT credit_id, SUM(amount) AS amt
                        FROM incomes WHERE deleted_at IS NULL
                        GROUP BY credit_id
                    ) paid ON paid.credit_id = c.id
                    WHERE c.deleted_at IS NULL AND c.status = 'active' ${uc}
                ) AS monto_circulacion,

                -- Clientes con crédito activo
                (
                    SELECT COUNT(DISTINCT c.client_id)
                    FROM credits c
                    WHERE c.deleted_at IS NULL AND c.status = 'active' ${uc}
                ) AS clientes_por_cobrar
        `, params);

        const s = statsResult.rows[0];

        // ── Monto Disponible (capital de proveedores) ─────────────────────────
        let provParams = [];
        let provUserCondition = '';

        if (user) {
            const userRow = await pool.query(
                `SELECT id FROM users WHERE nombre = $1 AND deleted_at IS NULL LIMIT 1`,
                [user]
            );
            if (userRow.rows.length > 0) {
                provParams = [userRow.rows[0].id];
                provUserCondition = `AND p.created_by = $1`;
            }
        }

        const provResult = await pool.query(`
            SELECT COALESCE(SUM(
                p.initial_contribution
                + COALESCE(pc_sum.total, 0)
                - COALESCE(cf_sum.total, 0)
            ), 0) AS disponible
            FROM providers p
            LEFT JOIN (
                SELECT provider_id, SUM(amount) AS total
                FROM provider_contributions WHERE deleted_at IS NULL
                GROUP BY provider_id
            ) pc_sum ON pc_sum.provider_id = p.id
            LEFT JOIN (
                SELECT provider_id, SUM(amount) AS total
                FROM credit_fundings
                GROUP BY provider_id
            ) cf_sum ON cf_sum.provider_id = p.id
            WHERE p.deleted_at IS NULL ${provUserCondition}
        `, provParams);

        const montoDisponible = parseFloat(provResult.rows[0].disponible) || 0;

        // ── Clientes Morosos (pagos vencidos en payment_schedule) ─────────────
        const morosResult = await pool.query(`
            SELECT
                cl.name,
                c."user" AS username,
                GREATEST(c.total_to_pay - COALESCE(paid.amt, 0), 0) AS amount_owed,
                (
                    SELECT COALESCE(SUM((elem->>'amount')::numeric), 0)
                    FROM jsonb_array_elements(c.payment_schedule) AS elem
                    WHERE (elem->>'date')::date < CURRENT_DATE
                      AND elem->>'status' = 'pending'
                ) AS overdue_payment
            FROM credits c
            JOIN clients cl ON c.client_id = cl.id AND cl.deleted_at IS NULL
            LEFT JOIN (
                SELECT credit_id, SUM(amount) AS amt
                FROM incomes WHERE deleted_at IS NULL
                GROUP BY credit_id
            ) paid ON paid.credit_id = c.id
            WHERE c.deleted_at IS NULL AND c.status = 'active' ${uc}
              AND EXISTS (
                  SELECT 1 FROM jsonb_array_elements(c.payment_schedule) AS elem
                  WHERE (elem->>'date')::date < CURRENT_DATE
                    AND elem->>'status' = 'pending'
              )
            ORDER BY overdue_payment DESC
        `, params);

        // ── Próximos Ingresos (pagos pendientes en los próximos 7 días) ───────
        const ingresosResult = await pool.query(`
            SELECT
                cl.name,
                (elem->>'date') AS payment_date,
                (elem->>'amount')::numeric AS amount,
                'Pendiente' AS status
            FROM credits c
            JOIN clients cl ON c.client_id = cl.id AND cl.deleted_at IS NULL
            CROSS JOIN LATERAL jsonb_array_elements(c.payment_schedule) AS elem
            WHERE c.deleted_at IS NULL AND c.status = 'active' ${uc}
              AND (elem->>'date')::date >= CURRENT_DATE
              AND (elem->>'date')::date <= CURRENT_DATE + INTERVAL '7 days'
              AND elem->>'status' = 'pending'
            ORDER BY (elem->>'date')::date ASC
        `, params);

        res.json({
            creditosActivos: parseInt(s.creditos_activos) || 0,
            montosCobradosMes: parseFloat(s.montos_cobrados_mes) || 0,
            gananciasNetasMes: parseFloat(s.ganancias_netas_mes) || 0,
            montoCirculacion: parseFloat(s.monto_circulacion) || 0,
            montoDisponible,
            clientesPorCobrar: parseInt(s.clientes_por_cobrar) || 0,
            morosos: morosResult.rows.map(r => ({
                name: r.name,
                username: r.username,
                amountOwed: parseFloat(r.amount_owed) || 0,
                overduePayment: parseFloat(r.overdue_payment) || 0
            })),
            proximosIngresos: ingresosResult.rows.map(r => ({
                name: r.name,
                paymentDate: r.payment_date,
                amount: parseFloat(r.amount) || 0,
                status: r.status
            }))
        });
    } catch (error) {
        console.error('Error fetching dashboard:', error);
        res.status(500).json({ error: `Error al obtener dashboard: ${error.message}` });
    }
});

export default router;
