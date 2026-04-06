const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Manager', 'Member'], default: 'Member' }
}, { timestamps: true });
module.exports = mongoose.model('users', userSchema);