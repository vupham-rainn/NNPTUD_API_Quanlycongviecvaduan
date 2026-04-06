const express = require('express');
const router = express.Router();
const Status = require('../schemas/status');

router.get('/', async (req, res) => {
    try {
        const statuses = await Status.find();
        res.json(statuses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const status = new Status(req.body);
        await status.save();
        res.status(201).json(status);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;