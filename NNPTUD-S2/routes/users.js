const express = require('express');
const router = express.Router();
const User = require('../schemas/user');
const jwt = require('jsonwebtoken');


const isAdmin = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "Bạn chưa đăng nhập!" });

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, 'SECRET_KEY'); 

        if (decoded.role.toLowerCase() !== 'admin') {
            return res.status(403).json({ message: "Quyền truy cập bị từ chối!" });
        }

        req.user = decoded; 
        next(); 
    } catch (err) {
        return res.status(401).json({ message: "Token không hợp lệ!" });
    }
};

router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.put('/:id/role', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role: role },
            { new: true }
        ).select('-password');

        if (!updatedUser) return res.status(404).json({ message: "Không thấy User" });
        res.json({ message: "Cập nhật thành công!", data: updatedUser });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.delete('/:id', isAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Đã xóa thành công" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;