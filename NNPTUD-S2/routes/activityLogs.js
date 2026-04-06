const express = require('express');
const router = express.Router();
const ActivityLog = require('../schemas/activityLog');


router.get('/', async (req, res) => {
    try {
        
        const logs = await ActivityLog.find()
            .populate('user', 'username')
            .sort({ createdAt: -1 }); 
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const log = new ActivityLog(req.body);
        await log.save();
        res.status(201).json(log);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;