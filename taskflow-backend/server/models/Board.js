const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  background: { type: String, default: '#0f172a' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['admin', 'member', 'viewer'], default: 'member' },
  }],
  columns: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
    color: { type: String, default: '#64748b' },
  }],
  isArchived: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
  visibility: { type: String, enum: ['private', 'team', 'public'], default: 'private' },
}, { timestamps: true });

module.exports = mongoose.model('Board', boardSchema);
