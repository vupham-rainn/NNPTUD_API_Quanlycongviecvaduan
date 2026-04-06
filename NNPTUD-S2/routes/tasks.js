const express = require('express');
const router = express.Router();
const Task = require('../schemas/task');

router.get('/', async (req, res) => {
    const tasks = await Task.find().populate('assignee status');
    res.json(tasks);
});

router.post('/', async (req, res) => {
    const task = new Task(req.body);
    await task.save();
    res.json(task);
});

router.delete('/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Xóa thành công" });
});


router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; 

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        ).populate('status');

        if (!updatedTask) return res.status(404).json({ message: "Không tìm thấy công việc" });

        res.json({ message: "Cập nhật tiến độ thành công!", updatedTask });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;