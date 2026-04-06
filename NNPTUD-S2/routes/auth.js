const express = require('express');
const router = express.Router();
const User = require('../schemas/user');
const jwt = require('jsonwebtoken');


router.post('/register', async (req, res) => {
    try {
        const { username, password, email, role } = req.body;
        
        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: "Tài khoản đã tồn tại" });

        const newUser = new User({ username, password, email, role });
        await newUser.save();
        
        res.status(201).json({ message: "Đăng ký thành công", user: newUser });
    } catch (err) {
        res.status(400).json({ message: "Lỗi hệ thống", error: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username, password }); 
    
    if (user) {
        const token = jwt.sign({ id: user._id, role: user.role }, 'SECRET_KEY', { expiresIn: '1h' });
        
        return res.json({ 
            message: "Login thành công", 
            token,
            user: {
                _id: user._id,    
                username: user.username,
                role: user.role 
            }
        });
    }
    res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
});

module.exports = router;