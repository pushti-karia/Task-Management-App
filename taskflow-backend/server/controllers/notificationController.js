const Notification = require('../models/Notification');

// @desc  Get user notifications
// @route GET /api/notifications
const getNotifications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });
    res.json({ notifications, unreadCount });
  } catch (err) { next(err); }
};

// @desc  Mark notification as read
// @route PUT /api/notifications/:id/read
const markRead = async (req, res, next) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: 'Marked as read' });
  } catch (err) { next(err); }
};

// @desc  Mark all notifications as read
// @route PUT /api/notifications/read-all
const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    res.json({ message: 'All marked as read' });
  } catch (err) { next(err); }
};

module.exports = { getNotifications, markRead, markAllRead };
