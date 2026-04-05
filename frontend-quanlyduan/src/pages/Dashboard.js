import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style.css';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('projects'); 

    // --- STATE DỮ LIỆU ---
    const [logs, setLogs] = useState([]); // Đã sử dụng ở Tab Lịch sử
    const [members, setMembers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [allAttachments, setAllAttachments] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // --- STATE TẠO PROJECT & CHI TIẾT ---
    const [newProjectName, setNewProjectName] = useState(''); // Đã gắn vào Input
    const [newProjectDesc, setNewProjectDesc] = useState(''); // Đã gắn vào Input
    const [viewingProject, setViewingProject] = useState(null);

    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    const adminId = localStorage.getItem('userId'); // Đã sử dụng khi tạo Project

    useEffect(() => {
        if (!username || role !== 'admin') {
            alert("⛔ Quyền truy cập bị từ chối!");
            navigate('/login'); 
        }
    }, [username, role, navigate]);

    const fetchData = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        const reqHeaders = { Authorization: `Bearer ${token}` };
        
        try {
            if (activeTab === 'logs') {
                const res = await axios.get('http://localhost:3000/api/activityLogs', { headers: reqHeaders });
                setLogs(Array.isArray(res.data) ? res.data : []);
            } else if (activeTab === 'members') {
                const res = await axios.get('http://localhost:3000/api/users', { headers: reqHeaders });
                setMembers(Array.isArray(res.data) ? res.data : []);
            } else if (activeTab === 'projects') {
                const [resP, resT, resA] = await Promise.all([
                    axios.get('http://localhost:3000/api/projects', { headers: reqHeaders }),
                    axios.get('http://localhost:3000/api/tasks', { headers: reqHeaders }).catch(() => ({data: []})),
                    axios.get('http://localhost:3000/api/uploads', { headers: reqHeaders }).catch(() => ({data: []}))
                ]);
                setProjects(resP.data);
                setAllTasks(resT.data);
                setAllAttachments(resA.data);
            }
        } catch (err) {
            console.error("Lỗi:", err);
        } finally {
            setLoading(false);
        }
    }, [activeTab, token]);

    useEffect(() => {
        if (role === 'admin') fetchData();
    }, [fetchData, role]);

    // HÀM TẠO DỰ ÁN (Sử dụng adminId, newProjectName, newProjectDesc)
    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/projects', 
                { name: newProjectName, description: newProjectDesc, owner: adminId }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("✨ Tạo dự án thành công!");
            setNewProjectName(''); 
            setNewProjectDesc(''); 
            fetchData();
        } catch (err) { alert("❌ Lỗi tạo dự án!"); }
    };

    const handleUpdateRole = async (userId, newRole) => {
        try {
            await axios.put(`http://localhost:3000/api/users/${userId}/role`, { role: newRole }, { headers: { Authorization: `Bearer ${token}` } });
            alert("✅ Đã cập nhật quyền!");
            fetchData(); 
        } catch (err) { alert("❌ Lỗi cập nhật!"); }
    };

    const handleDeleteProject = async (projectId) => {
        if (!window.confirm("⚠️ Xóa dự án này?")) return;
        try {
            await axios.delete(`http://localhost:3000/api/projects/${projectId}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchData();
        } catch (err) { alert("❌ Lỗi xóa!"); }
    };

    const handleLogout = () => { localStorage.clear(); window.location.href = '/login'; };

    if (role !== 'admin') return null;

    return (
        <div className="dashboard-container" style={{ paddingTop: '20px' }}>
            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: 'white', padding: '15px 25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src="https://file1.hutech.edu.vn/file/editor/homepage/stories/hinh34/logo%20CMYK-01.png" alt="HUTECH" style={{ height: '40px' }} />
                    <h1 style={{ color: '#1e293b', fontSize: '18px', margin: 0 }}>HỆ THỐNG QUẢN TRỊ</h1>
                </div>
                <button onClick={handleLogout} style={{ padding: '8px 15px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Đăng xuất</button>
            </div>

            {/* TABS */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button onClick={() => setActiveTab('projects')} style={{...tabStyle, background: activeTab === 'projects' ? '#2563eb' : 'white', color: activeTab === 'projects' ? 'white' : '#64748b'}}>📁 Dự án</button>
                <button onClick={() => setActiveTab('members')} style={{...tabStyle, background: activeTab === 'members' ? '#2563eb' : 'white', color: activeTab === 'members' ? 'white' : '#64748b'}}>👥 Thành viên</button>
                <button onClick={() => setActiveTab('logs')} style={{...tabStyle, background: activeTab === 'logs' ? '#2563eb' : 'white', color: activeTab === 'logs' ? 'white' : '#64748b'}}>🕒 Lịch sử</button>
            </div>

            <div className="login-box" style={{ maxWidth: '100%', textAlign: 'left', margin: 0 }}>
                {loading ? <p style={{textAlign:'center'}}>Đang tải...</p> : (
                    <>
                        {/* TAB 1: DỰ ÁN */}
                        {activeTab === 'projects' && (
                            <div>
                                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                                    <h4 style={{margin: '0 0 10px 0'}}>➕ Thêm dự án mới</h4>
                                    <form onSubmit={handleCreateProject} style={{display:'flex', gap: '10px'}}>
                                        <input type="text" className="login-input" placeholder="Tên dự án" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} required style={{margin:0}} />
                                        <input type="text" className="login-input" placeholder="Mô tả" value={newProjectDesc} onChange={(e) => setNewProjectDesc(e.target.value)} style={{margin:0}} />
                                        <button type="submit" className="login-button" style={{width:'auto', margin:0}}>TẠO</button>
                                    </form>
                                </div>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead><tr style={{ background: '#f8fafc', textAlign: 'left' }}><th style={thStyle}>Dự án</th><th style={thStyle}>Owner</th><th style={{...thStyle, textAlign:'center'}}>Thao tác</th></tr></thead>
                                    <tbody>
                                        {projects.map(p => (
                                            <tr key={p._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={tdStyle}><strong>{p.name}</strong></td>
                                                <td style={tdStyle}>{p.owner?.username || "Admin"}</td>
                                                <td style={{...tdStyle, textAlign: 'center'}}>
                                                    <button onClick={() => setViewingProject(p)} style={{ background: '#e0f2fe', color: '#0369a1', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginRight:'5px' }}>👁️ Xem</button>
                                                    <button onClick={() => handleDeleteProject(p._id)} style={deleteBtnStyle}>🗑️</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* TAB 2: THÀNH VIÊN */}
                        {activeTab === 'members' && (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead><tr style={{ background: '#f8fafc', textAlign: 'left' }}><th style={thStyle}>Tên</th><th style={thStyle}>Email</th><th style={thStyle}>Role</th></tr></thead>
                                <tbody>
                                    {members.map(u => (
                                        <tr key={u._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={tdStyle}>{u.username}</td>
                                            <td style={tdStyle}>{u.email}</td>
                                            <td style={tdStyle}>
                                                <select value={u.role?.toLowerCase()} onChange={(e) => handleUpdateRole(u._id, e.target.value)} style={{padding:'5px', borderRadius:'5px'}}>
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {/* TAB 3: LOGS (Sử dụng logs state) */}
                        {activeTab === 'logs' && (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead><tr style={{ background: '#f8fafc', textAlign: 'left' }}><th style={thStyle}>Người dùng</th><th style={thStyle}>Hành động</th><th style={thStyle}>Thời gian</th></tr></thead>
                                <tbody>
                                    {logs.length > 0 ? logs.map((log, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={tdStyle}>👤 {log.user?.username || "Ẩn"}</td>
                                            <td style={tdStyle}>{log.action}</td>
                                            <td style={tdStyle}>{new Date(log.createdAt).toLocaleString('vi-VN')}</td>
                                        </tr>
                                    )) : <tr><td colSpan="3" style={{textAlign:'center', padding:'20px'}}>Chưa có hoạt động nào.</td></tr>}
                                </tbody>
                            </table>
                        )}
                    </>
                )}
            </div>

            {/* MODAL CHI TIẾT */}
            {viewingProject && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
                    <div className="login-box" style={{ width: '700px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                        <button onClick={() => setViewingProject(null)} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer' }}>✕</button>
                        <h2 style={{ color: '#2563eb' }}>📁 {viewingProject.name}</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px' }}>
                                <h4 style={{margin:'0 0 10px 0'}}>📋 Tasks</h4>
                                {allTasks.filter(t => (t.project?._id || t.project)?.toString() === viewingProject._id.toString()).map(t => (
                                    <div key={t._id} style={{background:'white', padding:'8px', borderRadius:'6px', marginBottom:'5px', fontSize:'12px', boxShadow:'0 1px 2px rgba(0,0,0,0.05)'}}><b>{t.title}</b> ({t.status?.name || "Todo"})</div>
                                ))}
                            </div>
                            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px' }}>
                                <h4 style={{margin:'0 0 10px 0'}}>📎 Attachments</h4>
                                {allAttachments.filter(a => (a.project?._id || a.project)?.toString() === viewingProject._id.toString()).map(a => (
                                    <div key={a._id} style={{fontSize:'12px', marginBottom:'5px'}}>📄 <a href={`http://localhost:3000/uploads/${a.path}`} target="_blank" rel="noreferrer" style={{color:'#2563eb'}}>{a.name}</a></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const tabStyle = { padding: '10px 20px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' };
const thStyle = { padding: '15px', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '13px' };
const tdStyle = { padding: '15px', color: '#334155', fontSize: '14px' };
const deleteBtnStyle = { background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' };

export default Dashboard;