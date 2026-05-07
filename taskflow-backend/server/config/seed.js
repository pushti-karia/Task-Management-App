require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Board = require('../models/Board');
const Task = require('../models/Task');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany(); await Board.deleteMany(); await Task.deleteMany();

  const user = await User.create({ name: 'Demo User', email: 'demo@taskflow.com', password: 'demo1234' });
  const board = await Board.create({
    title: 'My First Project', description: 'Sample project board',
    owner: user._id, background: '#1e293b',
    columns: [
      { id: 'todo', title: 'To Do', order: 0, color: '#64748b' },
      { id: 'inprogress', title: 'In Progress', order: 1, color: '#3b82f6' },
      { id: 'completed', title: 'Completed', order: 2, color: '#22c55e' },
    ],
    members: [{ user: user._id, role: 'admin' }],
  });

  await Task.insertMany([
    { title: 'Design landing page', board: board._id, column: 'todo', priority: 'high', createdBy: user._id, order: 0, labels: [{ name: 'Design', color: '#8b5cf6' }] },
    { title: 'Setup backend API', board: board._id, column: 'inprogress', priority: 'urgent', createdBy: user._id, order: 0, labels: [{ name: 'Backend', color: '#3b82f6' }] },
    { title: 'Initialize React project', board: board._id, column: 'completed', priority: 'medium', createdBy: user._id, order: 0, labels: [{ name: 'Frontend', color: '#22c55e' }] },
  ]);

  console.log('Seed complete! Login: demo@taskflow.com / demo1234');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
