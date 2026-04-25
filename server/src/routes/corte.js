import express from 'express';
import pool from '../config/database.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
router.use(verifyToken);

const COMMISSION_RATE = 0.09;
const WEEKLY_SALARY = 3000;

function getSaturdaysInRange(startDate, endDate) {
    const saturdays = [];
    const end = new Date(endDate + 'T23:59:59');
    const d = new Date(startDate + 'T00:00:00');

    // Advance to first Saturday (day 6)
    while (d.getDay() !== 6) {
        d.setDate(d.getDate() + 1);
    }

    while (d <= end) {
        saturdays.push(d.toISOString().split('T')[0]);
        d.setDate(d.getDate() + 7);
    }

    return saturdays;
}

// GET /api/corte?provider_id=X&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
router.get('/', async (req, res) => {
    try {
        const { provider_id, start_date, end_date } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({ error: 'Se requieren start_date y end_date' });
        }

        // Get providers
        let providersQuery = 'SELECT id, name FROM providers WHERE deleted_at IS NULL';
        const providersParams = [];
        if (provider_id) {
            providersQuery += ' AND id = $1';
            providersParams.push(provider_id);
        }
        providersQuery += ' ORDER BY name';

        const providersResult = await pool.query(providersQuery, providersParams);
        const saturdays = getSaturdaysInRange(start_date, end_date);

        const providerReports = [];

        for (const provider of providersResult.rows) {
            // Contributions in date range (including initial contribution from registration)
            const contribResult = await pool.query(`
                SELECT id, amount, payment_date, note, created_at,
                       COALESCE(payment_date, created_at::date) AS effective_date
                FROM provider_contributions
                WHERE provider_id = $1
                  AND deleted_at IS NULL
                  AND COALESCE(payment_date, created_at::date) >= $2::date
                  AND COALESCE(payment_date, created_at::date) <= $3::date

                UNION ALL

                SELECT NULL AS id, initial_contribution AS amount, NULL AS payment_date,
                       'Aportación Inicial (Registro)' AS note, created_at,
                       created_at::date AS effective_date
                FROM providers
                WHERE id = $1
                  AND deleted_at IS NULL
                  AND initial_contribution > 0
                  AND created_at::date >= $2::date
                  AND created_at::date <= $3::date

                ORDER BY effective_date DESC
            `, [provider.id, start_date, end_date]);

            const contributions = contribResult.rows;
            const total_contributions = contributions.reduce((sum, c) => sum + Number(c.amount), 0);
            const commission = total_contributions * COMMISSION_RATE;

            // Salary weeks for this provider
            const salary_weeks = saturdays.map(date => ({ date, amount: WEEKLY_SALARY }));
            const total_salary = salary_weeks.length * WEEKLY_SALARY;

            // All credits funded by this provider (not date-filtered — full portfolio)
            const creditsResult = await pool.query(`
                SELECT
                    c.id,
                    c.loan_amount,
                    c.total_to_pay,
                    c.retention_amount,
                    c.status,
                    c.loan_type,
                    c.created_at,
                    c.weeks,
                    cf.amount AS funded_amount,
                    cl.name AS client_name,
                    COALESCE(inc.total_paid, 0) AS total_paid
                FROM credit_fundings cf
                JOIN credits c ON cf.credit_id = c.id
                JOIN clients cl ON c.client_id = cl.id
                LEFT JOIN (
                    SELECT credit_id, SUM(amount) AS total_paid
                    FROM incomes
                    WHERE deleted_at IS NULL
                    GROUP BY credit_id
                ) inc ON c.id = inc.credit_id
                WHERE cf.provider_id = $1
                  AND c.deleted_at IS NULL
                ORDER BY c.created_at DESC
            `, [provider.id]);

            const credits = creditsResult.rows.map(c => {
                const loan_amount = Number(c.loan_amount);
                const funded_amount = Number(c.funded_amount);
                const total_to_pay = Number(c.total_to_pay);
                const retention_amount = Number(c.retention_amount);
                const total_paid = Number(c.total_paid);
                const funded_share = loan_amount > 0 ? funded_amount / loan_amount : 1;

                return {
                    credit_id: c.id,
                    client_name: c.client_name,
                    status: c.status,
                    loan_type: c.loan_type,
                    created_at: c.created_at,
                    weeks: c.weeks,
                    funded_amount,
                    loan_amount,
                    funded_share,
                    expected_return: funded_share * total_to_pay,
                    retention_share: funded_share * retention_amount,
                    paid_amount: funded_share * total_paid,
                };
            });

            const total_funded = credits.reduce((sum, c) => sum + c.funded_amount, 0);
            const total_expected_return = credits.reduce((sum, c) => sum + c.expected_return, 0);
            const total_retention = credits.reduce((sum, c) => sum + c.retention_share, 0);
            const total_collected = credits.reduce((sum, c) => sum + c.paid_amount, 0);
            const net_yield = total_expected_return - commission - total_salary;

            providerReports.push({
                provider,
                contributions,
                total_contributions,
                commission,
                salary_weeks,
                total_salary,
                credits,
                total_funded,
                total_expected_return,
                total_retention,
                total_collected,
                net_yield,
            });
        }

        const summary = {
            total_contributions: providerReports.reduce((s, p) => s + p.total_contributions, 0),
            total_commission: providerReports.reduce((s, p) => s + p.commission, 0),
            total_salary: providerReports.reduce((s, p) => s + p.total_salary, 0),
            total_funded: providerReports.reduce((s, p) => s + p.total_funded, 0),
            total_expected_return: providerReports.reduce((s, p) => s + p.total_expected_return, 0),
            total_retention: providerReports.reduce((s, p) => s + p.total_retention, 0),
            total_collected: providerReports.reduce((s, p) => s + p.total_collected, 0),
        };
        summary.net_yield = summary.total_expected_return - summary.total_commission - summary.total_salary;

        res.json({ providers: providerReports, summary });
    } catch (error) {
        console.error('Error fetching corte:', error);
        res.status(500).json({ error: 'Error al obtener corte: ' + error.message });
    }
});

export default router;
