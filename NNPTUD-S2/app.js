const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const app = express();
const uploadRoute = require('./routes/upload');


app.use(cors()); 
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 2. KẾT NỐI DATABASE ---
mongoose.connect('mongodb://localhost:27017/TaskManagementDB')
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log(err));


app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/users', require('./routes/users'));
app.use('/api/roles', require('./routes/roles'));
app.use('/api/statuses', require('./routes/status'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/activityLogs', require('./routes/activityLogs'));
app.use('/api/uploads', uploadRoute);


app.listen(3000, () => console.log("🚀 Server: http://localhost:3000"));