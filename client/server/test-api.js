import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/test', (req, res, next) => {
    upload.fields([{ name: 'ine_front', maxCount: 1 }])(req, res, (err) => {
        if (err) {
            console.error('MULTER ERROR:', err);
            return res.status(500).json({ error: 'Multer error: ' + err.message });
        }
        next();
    });
}, (req, res) => {
    try {
        res.json({ success: true, files: req.files ? Object.keys(req.files) : [] });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(3007, () => {
    console.log('Listening on 3007');
});
