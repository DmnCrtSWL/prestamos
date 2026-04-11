import express from "express";
import multer from "multer";
import pool from "../config/database.js";
import { storage, uploadToCloudinary } from "../config/cloudinary.js";

const router = express.Router();

// ── Accepted MIME types ──────────────────────────────────────────────────────
const ACCEPTED_MIME = [
  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/heif",
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

// ── Multer (memory storage, same as clients.js) ──────────────────────────────
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
  fileFilter: (_req, file, cb) => {
    if (ACCEPTED_MIME.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Tipo de archivo no permitido: ${file.mimetype}. Se aceptan imágenes, PDF, Word y Excel.`
        ),
        false
      );
    }
  },
});

// ── Helper: generate a non-duplicate 9-digit ID ──────────────────────────────
async function generateUniqueId() {
  let id;
  let exists = true;
  while (exists) {
    id = String(Math.floor(100_000_000 + Math.random() * 900_000_000));
    const check = await pool.query(
      "SELECT 1 FROM personal_assets WHERE id = $1",
      [id]
    );
    exists = check.rows.length > 0;
  }
  return id;
}

// ── Helper: upload a single file buffer to Cloudinary with compression ────────
async function uploadFile(buffer, mimetype, originalname) {
  const isImage = mimetype.startsWith("image/");
  const isPdf = mimetype === "application/pdf";

  // Upload options – for images we apply Cloudinary eager transformations
  // to compress before storing (same philosophy as client INE photos).
  const options = {
    folder: "prestamos-personal",
    resource_type: "auto",
    ...(isPdf && { format: "pdf" }),
    // Eager compression for images: quality auto, max width 1400px
    ...(isImage && {
      eager: [
        {
          quality: "auto:good",
          fetch_format: "auto",
          width: 1400,
          crop: "limit",
        },
      ],
      eager_async: false,
    }),
  };

  const result = await uploadToCloudinary(buffer, mimetype, options);

  return {
    name: originalname,
    url: isImage && result.eager?.[0]?.secure_url
      ? result.eager[0].secure_url   // Use compressed version for images
      : result.secure_url,
    resource_type: result.resource_type,
    format: result.format,
  };
}

// ── GET /api/personal – list all (non-deleted) ───────────────────────────────
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, object, files, created_at, updated_at FROM personal_assets WHERE deleted_at IS NULL ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching personal assets:", err);
    res.status(500).json({ error: "Error al obtener bienes personales" });
  }
});

// ── GET /api/personal/:id ────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT id, object, files, created_at, updated_at FROM personal_assets WHERE id = $1 AND deleted_at IS NULL",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Bien no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching personal asset:", err);
    res.status(500).json({ error: "Error al obtener el bien" });
  }
});

// ── POST /api/personal – create ──────────────────────────────────────────────
router.post("/", upload.array("files", 20), async (req, res) => {
  try {
    const { object } = req.body;

    if (!object || !object.trim()) {
      return res
        .status(400)
        .json({ error: "El campo 'object' (descripción del bien) es requerido" });
    }

    // Upload all attached files concurrently
    const uploadedFiles = await Promise.all(
      (req.files || []).map((f) => uploadFile(f.buffer, f.mimetype, f.originalname))
    );

    const id = await generateUniqueId();

    const result = await pool.query(
      "INSERT INTO personal_assets (id, object, files) VALUES ($1, $2, $3) RETURNING id, object, files, created_at",
      [id, object.trim(), JSON.stringify(uploadedFiles)]
    );

    res.status(201).json({
      message: "Bien personal creado exitosamente",
      asset: result.rows[0],
    });
  } catch (err) {
    console.error("Error creating personal asset:", err);
    res.status(500).json({
      error: "Error al crear bien personal: " + (err.message || err.toString()),
    });
  }
});

// ── PUT /api/personal/:id – update ──────────────────────────────────────────
router.put("/:id", upload.array("files", 20), async (req, res) => {
  try {
    const { id } = req.params;
    const { object, existingFiles } = req.body;

    // Verify it exists
    const existing = await pool.query(
      "SELECT * FROM personal_assets WHERE id = $1 AND deleted_at IS NULL",
      [id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Bien no encontrado" });
    }

    // Keep previously saved files that the client still wants to keep
    let keptFiles = [];
    if (existingFiles) {
      try {
        keptFiles = JSON.parse(existingFiles);
      } catch {
        keptFiles = [];
      }
    }

    // Upload any newly attached files
    const newFiles = await Promise.all(
      (req.files || []).map((f) => uploadFile(f.buffer, f.mimetype, f.originalname))
    );

    const mergedFiles = [...keptFiles, ...newFiles];

    const result = await pool.query(
      "UPDATE personal_assets SET object = $1, files = $2 WHERE id = $3 RETURNING id, object, files, updated_at",
      [
        (object || existing.rows[0].object).trim(),
        JSON.stringify(mergedFiles),
        id,
      ]
    );

    res.json({
      message: "Bien personal actualizado exitosamente",
      asset: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating personal asset:", err);
    res.status(500).json({
      error: "Error al actualizar bien personal: " + (err.message || err.toString()),
    });
  }
});

// ── DELETE /api/personal/:id – soft delete ───────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE personal_assets SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Bien no encontrado o ya eliminado" });
    }
    res.json({ message: "Bien personal eliminado exitosamente" });
  } catch (err) {
    console.error("Error deleting personal asset:", err);
    res.status(500).json({ error: "Error al eliminar bien personal" });
  }
});

export default router;
