const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    status: { type: mongoose.Schema.Types.ObjectId, ref: 'statuses' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'projects' },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    priority: { type: mongoose.Schema.Types.ObjectId, ref: 'priorities' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'categories' },
    attachment: String // Lưu path file upload
}, { timestamps: true });
module.exports = mongoose.model('tasks', taskSchema);