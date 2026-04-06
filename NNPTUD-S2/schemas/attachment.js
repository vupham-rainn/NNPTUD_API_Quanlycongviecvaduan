const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
    name: { type: String, required: true },   
    path: { type: String, required: true },   
    project: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project', 
        required: true 
    },
    uploadedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attachment', attachmentSchema);