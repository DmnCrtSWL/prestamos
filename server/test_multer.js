const express = require('express');
const multer = require('multer');

const app = express();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 4 * 1024 * 1024 }
});

app.post('/api/test', upload.any(), (req, res) => {
    res.json({
        success: true,
        files: req.files ? req.files.length : 0,
        bodyFields: Object.keys(req.body).length,
        message: 'Endpoint hit successfully.'
    });
});

app.use((err, req, res, next) => {
    console.log('EXPRESS ERROR:', err.message);
    res.status(500).json({ error: err.message || err.toString() });
});

app.listen(3006, () => {
    const { exec } = require('child_process');
    console.log('Testing upload...');
    exec('curl -s -X POST -F "test=@valid_test.jpg" http://localhost:3006/api/test', (err, stdout, stderr) => {
        console.log('Response:', stdout);
        if (err) console.error('Error:', err);
        process.exit();
    });
});
