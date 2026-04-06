const express = require('express');
const router = express.Router();
const Role = require('../schemas/role');

router.get('/', async (req, res) => {
    const roles = await Role.find();
    res.json(roles);
});
router.put('/users/:id/role', async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body; 

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role: role },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "Không tìm thấy người dùng" });

        res.json({ message: "Cập nhật quyền thành công!", updatedUser });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.post('/', async (req, res) => {
    const newRole = new Role(req.body);
    await newRole.save();
    res.status(201).json(newRole);
});

module.exports = router;