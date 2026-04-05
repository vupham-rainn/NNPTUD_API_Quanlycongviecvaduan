import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style.css';

const UserDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [allAttachments, setAllAttachments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [targetProjectId, setTargetProjectId] = useState('');
    const [editingTask, setEditingTask] = useState(null);

    const [commentModal, setCommentModal] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [uploading, setUploading] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username') || 'Người dùng';
    let USER_ID = localStorage.getItem('userId'); 
    if (!USER_ID || USER_ID === 'undefined') USER_ID = "69d12c173982cc60a12ff6f3"; 

    // --- HÀM TẢI DỮ LIỆU AN TOÀN ---
    const fetchData = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        const reqHeaders = { Authorization: `Bearer ${token}` };

        try {
            // Lấy riêng lẻ để tránh lỗi 1 cái sập tất cả
            const resP = await axios.get('http://localhost:3000/api/projects', { headers: reqHeaders }).catch(() => ({ data: [] }));
            const resT = await axios.get('http://localhost:3000/api/tasks', { headers: reqHeaders }).catch(() => ({ data: [] }));
            const resA = await axios.get('http://localhost:3000/api/uploads', { headers: reqHeaders }).catch(() => ({ data: [] }));

            setProjects(resP.data);
            setTasks(resT.data);
            setAllAttachments(resA.data);

            if (resP.data.length > 0 && !targetProjectId) setTargetProjectId(resP.data[0]._id);
        } catch (err) {
            console.error("Lỗi:", err);
        } finally {
            setLoading(false);
        }
    }, [token, targetProjectId]);

    useEffect(() => {
        if (!token) navigate('/login'); 
        else fetchData();
    }, [token, navigate, fetchData]);

    // --- XỬ LÝ FILE ---
    const handleFileUpload = async (e, projectId) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('projectId', projectId);
        formData.append('userId', USER_ID);

        setUploading(projectId);
        try {
            await axios.post('http://localhost:3000/api/uploads', formData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
            });
            alert("✅ Tải lên thành công!");
            fetchData(); 
        } catch (err) { alert("❌ Lỗi upload!"); }
        finally { setUploading(null); }
    };

    const handleRemoveFile = async (attachmentId) => {
        if (!window.confirm("🗑️ Xóa file này?")) return;
        try {
            await axios.delete(`http://localhost:3000/api/uploads/${attachmentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("🗑️ Đã xóa file!");
            fetchData();
        } catch (err) { alert("❌ Lỗi xóa!"); }
    };

    // --- QUẢN LÝ TASK ---
    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/tasks', { 
                title: newTaskTitle, project: targetProjectId, status: "69d13a12a2d25dffc3b97d0f", assignee: USER_ID 
            }, { headers: { Authorization: `Bearer ${token}` } });
            setNewTaskTitle(''); fetchData(); 
        } catch (err) { alert("❌ Lỗi!"); }
    };

    const handleSaveUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/tasks/${editingTask._id}`, { 
                title: editingTask.title, project: editingTask.project, status: editingTask.status?._id || editingTask.status 
            }, { headers: { Authorization: `Bearer ${token}` } });
            setEditingTask(null); fetchData(); 
        } catch (err) { alert("❌ Lỗi!"); }
    };

    // --- CHAT ---
    const openCommentModal = async (task) => {
        setCommentModal(task);
        try {
            const res = await axios.get(`http://localhost:3000/api/comments/task/${task._id}`, { headers: { Authorization: `Bearer ${token}` } });
            setComments(res.data);
        } catch (err) { console.log(err); }
    };

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await axios.post('http://localhost:3000/api/comments', { content: newComment, user: USER_ID, task: commentModal._id }, { headers: { Authorization: `Bearer ${token}` } });
            setNewComment(''); openCommentModal(commentModal); 
        } catch (err) { alert("❌ Lỗi!"); }
    };

    const handleLogout = () => { localStorage.clear(); window.location.href = '/login'; };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Đang tải hệ thống HUTECH...</div>;

    return (
        <div className="dashboard-container" style={{ paddingTop: '20px' }}>
            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '15px 30px', borderRadius: '15px', marginBottom: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src="https://file1.hutech.edu.vn/file/editor/homepage/stories/hinh34/logo%20CMYK-01.png" alt="HUTECH" style={{ height: '45px' }} />
                    <h2 style={{ margin: 0, color: '#1e293b', fontSize: '18px' }}>QUẢN LÝ CÔNG VIỆC</h2>
                </div>
                <div>
                    <span style={{ fontSize: '14px', marginRight: '15px' }}>👋 <b>{username}</b></span>
                    <button onClick={handleLogout} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}>Thoát</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '25px' }}>
                {/* CỘT TRÁI: FILE */}
                <div className="login-box" style={{ maxWidth: '100%', margin: 0, height: 'fit-content' }}>
                    <h3 style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>📁 Dự án & Tài liệu</h3>
                    {projects.map(p => (
                        <div key={p._id} style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', marginBottom: '15px', borderLeft: '5px solid #2563eb' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>{p.name}</div>
                            <div style={{ marginBottom: '10px' }}>
                                {allAttachments
                                    .filter(attr => (attr.project?._id || attr.project) === p._id)
                                    .map((file) => (
                                        <div key={file._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '6px', borderRadius: '6px', marginBottom: '4px', border: '1px solid #e2e8f0' }}>
                                            <a href={`http://localhost:3000/uploads/${file.path}`} target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontSize: '11px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '120px' }}>📄 {file.name}</a>
                                            <button onClick={() => handleRemoveFile(file._id)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                                        </div>
                                    ))}
                            </div>
                            <label style={{ display: 'block', padding: '6px', background: uploading === p._id ? '#cbd5e1' : '#e0f2fe', color: '#0369a1', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold', textAlign: 'center' }}>
                                {uploading === p._id ? "⌛..." : "➕ Đính kèm"}
                                <input type="file" hidden onChange={(e) => handleFileUpload(e, p._id)} />
                            </label>
                        </div>
                    ))}
                </div>

                {/* CỘT PHẢI: TASK */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="login-box" style={{ maxWidth: '100%', margin: 0 }}>
                        <form onSubmit={handleCreateTask} style={{ display: 'flex', gap: '10px' }}>
                            <input type="text" className="login-input" placeholder="Việc cần làm..." value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} required style={{margin:0, flex: 2}} />
                            <select className="login-input" value={targetProjectId} onChange={(e) => setTargetProjectId(e.target.value)} style={{margin:0, flex: 1}}>
                                {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                            </select>
                            <button type="submit" className="login-button" style={{ width: 'auto', margin: 0 }}>TẠO</button>
                        </form>
                    </div>

                    <div className="login-box" style={{ maxWidth: '100%', margin: 0 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', background: '#f8fafc' }}><th style={{padding:'12px'}}>Task</th><th style={{padding:'12px'}}>Trạng thái</th><th style={{padding:'12px', textAlign:'center'}}>Thao tác</th></tr>
                            </thead>
                            <tbody>
                                {tasks.map(t => (
                                    <tr key={t._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '12px', fontSize: '14px' }}><b>{t.title}</b></td>
                                        <td style={{ padding: '12px' }}><span style={{ background: '#fef9c3', padding: '4px 8px', borderRadius: '10px', fontSize: '11px' }}>{t.status?.name || "To Do"}</span></td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <button onClick={() => openCommentModal(t)} style={{ background: 'none', border: '1px solid #9333ea', color: '#9333ea', padding: '4px 8px', borderRadius: '5px', fontSize: '11px', cursor: 'pointer', marginRight: '5px' }}>💬</button>
                                            <button onClick={() => setEditingTask(t)} style={{ background: 'none', border: '1px solid #0284c7', color: '#0284c7', padding: '4px 8px', borderRadius: '5px', fontSize: '11px', cursor: 'pointer', marginRight: '5px' }}>✏️</button>
                                            <button onClick={() => { if(window.confirm("Xóa?")) axios.delete(`http://localhost:3000/api/tasks/${t._id}`, {headers:{Authorization:`Bearer ${token}`}}).then(()=>fetchData()) }} style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '4px 8px', borderRadius: '5px', fontSize: '11px', cursor: 'pointer' }}>🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL SỬA */}
            {editingTask && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="login-box" style={{ width: '400px' }}>
                        <h3>✏️ Sửa Task</h3>
                        <input type="text" className="login-input" value={editingTask.title} onChange={(e) => setEditingTask({...editingTask, title: e.target.value})} />
                        <select className="login-input" value={editingTask.status?._id || editingTask.status} onChange={(e) => setEditingTask({...editingTask, status: e.target.value})}>
                            <option value="69d13a12a2d25dffc3b97d0f">Todo</option>
                            <option value="69d13a12a2d25dffc3b97d10">In Progress</option>
                            <option value="69d13a12a2d25dffc3b97d11">Done</option>
                        </select>
                        <div style={{display:'flex', gap: '10px'}}>
                            <button onClick={handleSaveUpdate} className="login-button">LƯU</button>
                            <button onClick={() => setEditingTask(null)} className="login-button" style={{background:'#64748b'}}>HỦY</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL CHAT */}
            {commentModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="login-box" style={{ width: '450px', position: 'relative' }}>
                        <button onClick={() => setCommentModal(null)} style={{ position: 'absolute', top: '10px', right: '10px', border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
                        <h3 style={{fontSize:'16px'}}>💬 Chat: {commentModal.title}</h3>
                        <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', height: '200px', overflowY: 'auto', marginBottom: '10px' }}>
                            {comments.map((c, i) => <div key={i} style={{ marginBottom: '8px', fontSize: '13px' }}><b>{c.user?.username || 'Bạn'}:</b> {c.content}</div>)}
                        </div>
                        <form onSubmit={handlePostComment} style={{ display: 'flex', gap: '5px' }}>
                            <input type="text" className="login-input" value={newComment} onChange={(e) => setNewComment(e.target.value)} required style={{margin:0}} />
                            <button type="submit" className="login-button" style={{width:'auto', margin:0}}>Gửi</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;