const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },

    due_date: {
        type: Date       
    },
    category: {
        type: String
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
})

const ToDo = mongoose.model('ToDo', todoSchema);

module.exports = ToDo;