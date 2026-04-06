const jwt = require('jsonwebtoken');

const isAdmin = (req, res, next) => {
    
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Bạn chưa đăng nhập!" });

    
    const decoded = jwt.verify(token, 'SECRET_KEY');
    if (decoded.role !== 'Admin') {
        return res.status(403).json({ message: "Lỗi: Chỉ Admin mới có quyền này!" });
    }
    next(); 
};

module.exports = { isAdmin };