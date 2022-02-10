const express = require('express');
const router = express.Router();

router.route('/')
    .get((req, res) => {})
    .post(async (req, res) => {
        // Input must be named file.
        const file = req.files.file;
        await file.mv(`./uploads/${file.name}`);
        res.json({
            success: true,
            message: 'File is uploaded',
            data: {
                name: file.name,
                mimetype: file.mimetype,
                size: file.size,
                link: `uploads/${file.name}`
            }
        });
    });

module.exports = router;
