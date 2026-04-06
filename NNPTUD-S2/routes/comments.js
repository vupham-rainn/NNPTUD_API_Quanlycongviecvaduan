const express = require('express');
const router = express.Router();
const Comment = require('../schemas/comment');


router.post('/', async (req, res) => {
    try {
        const { content, user, task } = req.body;
        const newComment = new Comment({ content, user, task });
        await newComment.save();
        res.status(201).json({ message: "Gửi bình luận thành công!", data: newComment });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.get('/task/:taskId', async (req, res) => {
    try {
        const comments = await Comment.find({ task: req.params.taskId }).populate('user', 'username');
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;