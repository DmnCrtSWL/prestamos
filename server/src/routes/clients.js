import express from "express";
import pool from "../config/database.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

import { storage, uploadToCloudinary } from "../config/cloudinary.js";

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 4 * 1024 * 1024, // 4MB limit (Vercel limit is 4.5MB)
  },
  fileFilter: function (req, file, cb) {
    // Accept images and PDFs
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|pdf)$/i)) {
      return cb(new Error("Solo se permiten archivos de imagen o PDF"), false);
    }
    cb(null, true);
  },
});

// GET all clients (non-deleted)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, phone, curp, address, ine_front, ine_back, comprobant, "user", created_at, updated_at FROM clients WHERE deleted_at IS NULL ORDER BY created_at DESC',
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ error: "Error al obtener clientes" });
  }
});

// GET single client by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, name, phone, curp, address, ine_front, ine_back, comprobant, "user", created_at, updated_at FROM clients WHERE id = $1 AND deleted_at IS NULL',
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({ error: "Error al obtener cliente" });
  }
});

// Provide Vercel specific configuration to ensure multipart requests are handled correctly
export const config = {
  api: {
    bodyParser: false,
  },
};

// POST create new client with image uploads
router.post(
  "/",
  upload.fields([
    { name: "ine_front", maxCount: 1 },
    { name: "ine_back", maxCount: 1 },
    { name: "comprobant", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, phone, curp, address, user } = req.body;

      // Validate required fields
      if (!name || !phone || !curp || !address) {
        return res.status(400).json({
          error: "Todos los campos son requeridos: name, phone, curp, address",
        });
      }

      // Validate CURP format (18 characters)
      if (curp.length !== 18) {
        return res.status(400).json({
          error: "El CURP debe tener 18 caracteres",
        });
      }

      // Check if CURP already exists
      const existingClient = await pool.query(
        "SELECT id FROM clients WHERE curp = $1 AND deleted_at IS NULL",
        [curp],
      );

      if (existingClient.rows.length > 0) {
        return res.status(409).json({ error: "El CURP ya está registrado" });
      }

      // Get uploaded file paths
      let ine_front = null;
      let ine_back = null;
      let comprobant = null;

      if (req.files?.ine_front) {
        const result = await uploadToCloudinary(
          req.files.ine_front[0].buffer,
          req.files.ine_front[0].mimetype,
        );
        ine_front = result.secure_url;
      }
      if (req.files?.ine_back) {
        const result = await uploadToCloudinary(
          req.files.ine_back[0].buffer,
          req.files.ine_back[0].mimetype,
        );
        ine_back = result.secure_url;
      }
      if (req.files?.comprobant) {
        const result = await uploadToCloudinary(
          req.files.comprobant[0].buffer,
          req.files.comprobant[0].mimetype,
        );
        comprobant = result.secure_url;
      }

      // Insert client
      const result = await pool.query(
        'INSERT INTO clients (name, phone, curp, address, ine_front, ine_back, comprobant, "user") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, name, phone, curp, address, ine_front, ine_back, comprobant, "user", created_at',
        [
          name,
          phone,
          curp,
          address,
          ine_front,
          ine_back,
          comprobant,
          user || null,
        ],
      );

      res.status(201).json({
        message: "Cliente creado exitosamente",
        client: result.rows[0],
      });
    } catch (error) {
      console.error("Error creating client:", error);
      res
        .status(500)
        .json({
          error:
            "Error al crear cliente: " + (error.message || error.toString()),
        });
    }
  },
);

// PUT update client
router.put(
  "/:id",
  upload.fields([
    { name: "ine_front", maxCount: 1 },
    { name: "ine_back", maxCount: 1 },
    { name: "comprobant", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, phone, curp, address } = req.body;

      // Check if client exists
      const existingClient = await pool.query(
        "SELECT * FROM clients WHERE id = $1 AND deleted_at IS NULL",
        [id],
      );

      if (existingClient.rows.length === 0) {
        return res.status(404).json({ error: "Cliente no encontrado" });
      }

      // Check if CURP is being changed and if it already exists
      if (curp && curp !== existingClient.rows[0].curp) {
        const curpExists = await pool.query(
          "SELECT id FROM clients WHERE curp = $1 AND id != $2 AND deleted_at IS NULL",
          [curp, id],
        );

        if (curpExists.rows.length > 0) {
          return res.status(409).json({ error: "El CURP ya está registrado" });
        }
      }

      // Get uploaded file paths or keep existing ones
      let ine_front = existingClient.rows[0].ine_front;
      let ine_back = existingClient.rows[0].ine_back;
      let comprobant = existingClient.rows[0].comprobant;

      if (req.files?.ine_front) {
        const result = await uploadToCloudinary(
          req.files.ine_front[0].buffer,
          req.files.ine_front[0].mimetype,
        );
        ine_front = result.secure_url;
      }
      if (req.files?.ine_back) {
        const result = await uploadToCloudinary(
          req.files.ine_back[0].buffer,
          req.files.ine_back[0].mimetype,
        );
        ine_back = result.secure_url;
      }
      if (req.files?.comprobant) {
        const result = await uploadToCloudinary(
          req.files.comprobant[0].buffer,
          req.files.comprobant[0].mimetype,
        );
        comprobant = result.secure_url;
      }

      // Update client
      const result = await pool.query(
        "UPDATE clients SET name = $1, phone = $2, curp = $3, address = $4, ine_front = $5, ine_back = $6, comprobant = $7 WHERE id = $8 RETURNING id, name, phone, curp, address, ine_front, ine_back, comprobant, updated_at",
        [
          name || existingClient.rows[0].name,
          phone || existingClient.rows[0].phone,
          curp || existingClient.rows[0].curp,
          address || existingClient.rows[0].address,
          ine_front,
          ine_back,
          comprobant,
          id,
        ],
      );

      res.json({
        message: "Cliente actualizado exitosamente",
        client: result.rows[0],
      });
    } catch (error) {
      console.error("Error updating client:", error);
      res
        .status(500)
        .json({
          error:
            "Error al actualizar cliente: " +
            (error.message || error.toString()),
        });
    }
  },
);

// GET single client's rating
router.get("/:id/rating", async (req, res) => {
  try {
    const { id } = req.params;

    // Verify client exists
    const clientCheck = await pool.query(
      "SELECT id FROM clients WHERE id = $1 AND deleted_at IS NULL",
      [id],
    );
    if (clientCheck.rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    // Fetch all credits for client
    const creditsResult = await pool.query(
      "SELECT id, payment_schedule, status, loan_type, created_at, total_to_pay, loan_amount FROM credits WHERE client_id = $1 AND deleted_at IS NULL",
      [id],
    );

    if (creditsResult.rows.length === 0) {
      return res.json({ rating: "nuevo", maxDelayDays: 0 });
    }

    let maxDelayDays = 0;
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // Fetch all incomes for these credits
    const creditIds = creditsResult.rows.map((c) => c.id);
    const incomesResult =
      creditIds.length > 0
        ? await pool.query(
            "SELECT credit_id, amount, created_at FROM incomes WHERE credit_id = ANY($1) AND deleted_at IS NULL ORDER BY created_at ASC",
            [creditIds],
          )
        : { rows: [] };

    const incomesByCredit = {};
    for (const inc of incomesResult.rows) {
      if (!incomesByCredit[inc.credit_id]) incomesByCredit[inc.credit_id] = [];
      incomesByCredit[inc.credit_id].push(inc);
    }

    for (const credit of creditsResult.rows) {
      const incomes = incomesByCredit[credit.id] || [];

      if (credit.loan_type === "10% Semanal") {
        let prevDate = new Date(credit.created_at);
        for (let i = 0; i < incomes.length; i++) {
          let incDate = new Date(incomes[i].created_at);
          let gap = Math.floor((incDate - prevDate) / (1000 * 60 * 60 * 24));
          if (gap - 7 > maxDelayDays) {
            maxDelayDays = gap - 7;
          }
          prevDate = incDate;
        }
        if (credit.status !== "completed" && credit.status !== "liquidated") {
          let currentGap = Math.floor(
            (today - prevDate) / (1000 * 60 * 60 * 24),
          );
          if (currentGap - 7 > maxDelayDays) {
            maxDelayDays = currentGap - 7;
          }
        }
      } else {
        let schedule =
          typeof credit.payment_schedule === "string"
            ? JSON.parse(credit.payment_schedule || "[]")
            : credit.payment_schedule;
        if (!schedule || !Array.isArray(schedule)) continue;

        let cumulativeExpected = 0;
        let cumulativePaid = 0;
        let currentIncomeIndex = 0;

        for (let i = 0; i < schedule.length; i++) {
          const payment = schedule[i];
          cumulativeExpected += Number(payment.amount);

          const [py, pm, pd] = payment.date.split("-").map(Number);
          const dueDate = new Date(py, pm - 1, pd, 23, 59, 59, 999);

          let paymentCompletedDate = null;

          while (
            currentIncomeIndex < incomes.length &&
            cumulativePaid < cumulativeExpected
          ) {
            cumulativePaid += Number(incomes[currentIncomeIndex].amount);
            if (cumulativePaid >= cumulativeExpected) {
              paymentCompletedDate = new Date(
                incomes[currentIncomeIndex].created_at,
              );
            }
            currentIncomeIndex++;
          }

          if (cumulativePaid >= cumulativeExpected) {
            if (paymentCompletedDate && paymentCompletedDate > dueDate) {
              let delay = Math.floor(
                (paymentCompletedDate - dueDate) / (1000 * 60 * 60 * 24),
              );
              if (delay > maxDelayDays) maxDelayDays = delay;
            }
          } else {
            if (
              today > dueDate &&
              credit.status !== "completed" &&
              credit.status !== "liquidated"
            ) {
              let delay = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
              if (delay > maxDelayDays) maxDelayDays = delay;
            }
          }
        }
      }
    }

    let rating = "bueno";
    if (maxDelayDays > 21) {
      rating = "moroso";
    } else if (maxDelayDays > 0) {
      rating = "riesgo";
    }

    res.json({ rating, maxDelayDays });
  } catch (error) {
    console.error("Error calculating client rating:", error);
    res.status(500).json({ error: "Error al calcular calificación" });
  }
});

export default router;
