const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  column: { type: String, required: true }, // column id
  order: { type: Number, default: 0 },
  assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  labels: [{ name: String, color: String }],
  dueDate: { type: Date },
  attachments: [{
    filename: String,
    url: String,
    publicId: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadedAt: { type: Date, default: Date.now },
  }],
  checklist: [{
    text: String,
    completed: { type: Boolean, default: false },
  }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  activity: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: String,
    timestamp: { type: Date, default: Date.now },
  }],
  isArchived: { type: Boolean, default: false },
  coverColor: { type: String, default: '' },
}, { timestamps: true });

taskSchema.index({ board: 1, column: 1 });
taskSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Task', taskSchema);
