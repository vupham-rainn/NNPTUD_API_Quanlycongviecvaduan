import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang công khai */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Trang dành riêng cho Admin */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Trang dành riêng cho User */}
        <Route path="/userdashboard" element={<UserDashboard />} />

        {/* Mặc định vào Login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;