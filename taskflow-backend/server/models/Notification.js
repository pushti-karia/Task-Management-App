const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: {
    type: String,
    enum: ['task_assigned', 'task_comment', 'board_invite', 'task_due', 'task_moved', 'mention'],
    required: true,
  },
  message: { type: String, required: true },
  link: { type: String, default: '' },
  isRead: { type: Boolean, default: false },
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
