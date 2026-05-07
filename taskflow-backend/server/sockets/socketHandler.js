const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Track online users: userId -> socketId
const onlineUsers = new Map();

const setupSocket = (io) => {
  // Auth middleware for socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = await User.findById(decoded.id).select('-password');
      next();
    } catch {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    if (!socket.user) return socket.disconnect();
    const userId = socket.user._id.toString();
    onlineUsers.set(userId, socket.id);
    console.log(`User connected: ${socket.user.name} (${socket.id})`);

    // Broadcast online users
    io.emit('online_users', Array.from(onlineUsers.keys()));

    // Join board room
    socket.on('join_board', (boardId) => {
      socket.join(`board:${boardId}`);
      socket.to(`board:${boardId}`).emit('user_joined', {
        user: { _id: userId, name: socket.user.name, avatar: socket.user.avatar },
      });
    });

    // Leave board room
    socket.on('leave_board', (boardId) => {
      socket.leave(`board:${boardId}`);
      socket.to(`board:${boardId}`).emit('user_left', { userId });
    });

    // Task events - broadcast to board room
    socket.on('task_created', ({ boardId, task }) => {
      socket.to(`board:${boardId}`).emit('task_created', task);
    });

    socket.on('task_updated', ({ boardId, task }) => {
      socket.to(`board:${boardId}`).emit('task_updated', task);
    });

    socket.on('task_deleted', ({ boardId, taskId }) => {
      socket.to(`board:${boardId}`).emit('task_deleted', taskId);
    });

    socket.on('task_moved', ({ boardId, taskId, column, order }) => {
      socket.to(`board:${boardId}`).emit('task_moved', { taskId, column, order });
    });

    // Comment typing indicator
    socket.on('typing_start', ({ boardId, taskId }) => {
      socket.to(`board:${boardId}`).emit('user_typing', {
        taskId,
        user: { _id: userId, name: socket.user.name },
      });
    });

    socket.on('typing_stop', ({ boardId, taskId }) => {
      socket.to(`board:${boardId}`).emit('user_stopped_typing', { taskId, userId });
    });

    // New comment
    socket.on('new_comment', ({ boardId, taskId, comment }) => {
      socket.to(`board:${boardId}`).emit('new_comment', { taskId, comment });
    });

    // Notification
    socket.on('send_notification', ({ recipientId, notification }) => {
      const recipientSocket = onlineUsers.get(recipientId);
      if (recipientSocket) {
        io.to(recipientSocket).emit('notification', notification);
      }
    });

    socket.on('disconnect', () => {
      if (!socket.user) return;
      onlineUsers.delete(userId);
      io.emit('online_users', Array.from(onlineUsers.keys()));
      console.log(`User disconnected: ${socket.user.name}`);
    });
  });
};

module.exports = setupSocket;
