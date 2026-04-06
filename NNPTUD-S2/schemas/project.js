const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
}, { timestamps: true });
module.exports = mongoose.model('projects', projectSchema);