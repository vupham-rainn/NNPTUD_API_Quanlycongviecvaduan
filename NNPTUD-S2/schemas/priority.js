const mongoose = require('mongoose');
const prioritySchema = new mongoose.Schema({
    level: { type: String, required: true } 
});
module.exports = mongoose.model('priorities', prioritySchema);