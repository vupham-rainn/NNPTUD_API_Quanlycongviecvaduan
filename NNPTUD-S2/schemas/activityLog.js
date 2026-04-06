const mongoose = require('mongoose');
const activityLogSchema = new mongoose.Schema({
    action: { type: String, required: true }, // "Created Task", "Updated Status"
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    targetId: mongoose.Schema.Types.ObjectId, // ID của Task hoặc Project bị tác động
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('activityLogs', activityLogSchema);