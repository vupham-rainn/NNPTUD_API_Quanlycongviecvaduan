import React, { useState } from 'react';
import axios from 'axios';
import '../style.css';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '', fullName: '' });
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:3000/api/auth/register', formData);
            alert("✨ Đăng ký thành công! Hãy đăng nhập.");
            window.location.href = '/login';
        } catch (err) {
            alert("❌ Lỗi: " + (err.response?.data?.message || "Không thể đăng ký"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <h1 className="login-title">ĐĂNG KÝ</h1>
                    <p className="login-subtitle">Tạo tài khoản mới cho hệ thống</p>
                </div>
                <form onSubmit={handleRegister}>
                    <div className="input-group">
                        <label>Họ và Tên</label>
                        <input type="text" className="login-input" required 
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                    </div>
                    <div className="input-group">
                        <label>Tên đăng nhập</label>
                        <input type="text" className="login-input" required 
                            onChange={(e) => setFormData({...formData, username: e.target.value})} />
                    </div>
                    <div className="input-group">
                        <label>Mật khẩu</label>
                        <input type="password" className="login-input" required 
                            onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </div>
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "ĐANG XỬ LÝ..." : "TẠO TÀI KHOẢN"}
                    </button>
                </form>
                <p style={{marginTop: '15px', fontSize: '14px'}}>
                    Đã có tài khoản? <a href="/login">Đăng nhập</a>
                </p>
            </div>
        </div>
    );
};

export default Register;