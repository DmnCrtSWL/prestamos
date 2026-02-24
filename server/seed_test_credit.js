import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'prestamos',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function main() {
  try {
    // 1. Create a dummy client
    const clientRes = await pool.query(`
      INSERT INTO clients (name, phone, address, created_at)
      VALUES ('Moroso prueba 1', '5555555555', 'Calle Falsa 123', NOW() - INTERVAL '15 days')
      RETURNING id;
    `);
    const clientId = clientRes.rows[0].id;

    // 2. Generate a payment schedule for 12 weeks, starting 2 weeks ago
    const schedule = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 14); // 2 weeks strictly in the past

    for (let i = 1; i <= 12; i++) {
      const paymentDate = new Date(startDate);
      paymentDate.setDate(paymentDate.getDate() + (i * 7)); // Next week
      const pad = (n) => n.toString().padStart(2, '0');
      const dateStr = `${paymentDate.getFullYear()}-${pad(paymentDate.getMonth() + 1)}-${pad(paymentDate.getDate())}`;
      
      schedule.push({
        week: i,
        date: dateStr,
        amount: 1000 // $1000 weekly payment => total $12000
      });
    }

    // 3. Create the credit
    // $12000 total, 12 weeks, $1000 weekly. Requested $10000.
    const creationDateStr = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')} 12:00:00`;
    
    const creditRes = await pool.query(`
      INSERT INTO credits (
        client_id, 
        loan_amount, 
        interest_rate, 
        weeks, 
        weekly_payment, 
        total_to_pay, 
        status, 
        payment_schedule, 
        "user",
        created_at
      )
      VALUES ($1, 10000, 20, 12, 1000, 12000, 'approved', $2, 'admin', $3)
      RETURNING id;
    `, [clientId, JSON.stringify(schedule), creationDateStr]);

    const creditId = creditRes.rows[0].id;
    
    // 4. Also add it to credit_fundings so it shows up as funded properly
    const folio = 'FUND-' + Math.floor(Math.random() * 1000000);
    await pool.query(`
      INSERT INTO credit_fundings (folio, credit_id, provider_id, amount, "user", created_at)
      VALUES ($1, $2, 1, 10000, 'admin', $3)
    `, [folio, creditId, creationDateStr]);

    console.log(`Credit created successfully with ID: ${creditId}`);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

main();
