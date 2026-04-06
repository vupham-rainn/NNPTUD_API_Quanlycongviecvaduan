const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'tasks' }
}, { timestamps: true });
module.exports = mongoose.model('comments', commentSchema);