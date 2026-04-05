import React, { useState } from 'react';
import axios from 'axios';
import '../style.css';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState(''); 
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const endpoint = isRegister 
            ? 'http://localhost:3000/api/auth/register' 
            : 'http://localhost:3000/api/auth/login';

        const payload = isRegister 
            ? { username, password, email, role: 'user' } 
            : { username, password };

        try {
            const res = await axios.post(endpoint, payload);
            
            if (isRegister) {
                alert("✨ Đăng ký thành công! Hãy đăng nhập.");
                setIsRegister(false);
                setPassword('');
                setEmail('');
            } else {
                if (res.data.token) {
                    // 1. Lưu thông tin vào localStorage
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('username', res.data.user.username);
                    
                    // Lưu ID để làm chức năng Comment
                    localStorage.setItem('userId', res.data.user._id);
                    
                    const userRole = res.data.user.role.toLowerCase();
                    localStorage.setItem('role', userRole);
                    
                    // 2. ĐIỀU HƯỚNG THÔNG MINH
                    if (userRole === 'admin') {
                        window.location.href = '/dashboard';
                    } else {
                        window.location.href = '/userdashboard';
                    }
                }
            }
        } catch (err) {
            alert("❌ Lỗi: " + (err.response?.data?.message || "Đã có lỗi xảy ra!"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <div style={boxStyle}>
                {/* --- LOGO TRƯỜNG --- */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/vi/8/81/Logo_Tr%C6%B0%E1%BB%9Dng_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_C%C3%B4ng_ngh%E1%BB%87_Th%C3%A0nh_ph%E1%BB%91_H%E1%BB%93_Ch%C3%AD_Minh.png" 
                        alt="HUTECH Logo" 
                        style={{ width: '120px', height: 'auto', objectFit: 'contain' }}
                    />
                </div>

                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ margin: '0 0 10px 0', fontSize: '24px', color: '#1e293b', fontWeight: '800' }}>TASK MANAGER</h1>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                        {isRegister ? "Tạo tài khoản mới" : "Dự án Quản lý Công việc - NNPTUD-S2"}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Địa chỉ Gmail</label>
                            <input 
                                type="email" 
                                style={inputStyle}
                                placeholder="example@gmail.com"
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                    )}

                    <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>Tên đăng nhập</label>
                        <input 
                            type="text" 
                            style={inputStyle}
                            placeholder="Nhập tài khoản..."
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={labelStyle}>Mật khẩu</label>
                        <input 
                            type="password" 
                            style={inputStyle}
                            placeholder="••••••••"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        style={{...btnStyle, opacity: loading ? 0.7 : 1}}
                    >
                        {loading ? "ĐANG XỬ LÝ..." : (isRegister ? "ĐĂNG KÝ NGAY" : "ĐĂNG NHẬP HỆ THỐNG")}
                    </button>
                </form>

                <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px', color: '#475569' }}>
                    {isRegister ? (
                        <span>Đã có tài khoản? <button type="button" onClick={() => setIsRegister(false)} style={toggleBtnStyle}>Đăng nhập</button></span>
                    ) : (
                        <span>Chưa có tài khoản? <button type="button" onClick={() => setIsRegister(true)} style={toggleBtnStyle}>Đăng ký ngay</button></span>
                    )}
                </div>

                <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: '500' }}>© 2026 - Phát triển bởi Phạm Quang Hoàng Vũ</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
                        Mã nguồn lưu trữ trên GitHub
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- CSS CHUẨN ĐẸP CHO FORM ĐĂNG NHẬP ---
const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', // Nền gradient nhẹ nhàng
    padding: '20px'
};

const boxStyle = {
    background: 'white',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)', // Đổ bóng hiện đại
    width: '100%',
    maxWidth: '420px',
    boxSizing: 'border-box'
};

const labelStyle = { 
    display: 'block', 
    marginBottom: '8px', 
    fontWeight: '600', 
    color: '#334155',
    fontSize: '14px'
};

const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.3s'
};

const btnStyle = {
    width: '100%',
    padding: '14px',
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s'
};

const toggleBtnStyle = {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: '0 5px',
    fontSize: '14px'
};

export default Login;