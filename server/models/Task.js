// server/models/Task.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: {
    type: String,
    enum: ['todo', 'inprogress', 'done'],
    default: 'todo'
  },
  assignedTo: { type: String, default: null },
  index: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
