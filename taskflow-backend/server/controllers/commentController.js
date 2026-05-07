const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Notification = require('../models/Notification');

// @desc  Get comments for task
// @route GET /api/comments/task/:taskId
const getTaskComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ task: req.params.taskId })
      .populate('author', 'name avatar')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) { next(err); }
};

// @desc  Add comment
// @route POST /api/comments
const addComment = async (req, res, next) => {
  try {
    const { text, taskId } = req.body;
    const task = await Task.findById(taskId).populate('board');
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const comment = await Comment.create({ text, task: taskId, author: req.user._id });
    await Task.findByIdAndUpdate(taskId, {
      $push: {
        comments: comment._id,
        activity: { user: req.user._id, action: 'added a comment' },
      },
    });

    await comment.populate('author', 'name avatar');

    // Notify task assignees
    if (task.assignees?.length) {
      await Notification.insertMany(
        task.assignees
          .filter(id => id.toString() !== req.user._id.toString())
          .map(userId => ({
            recipient: userId,
            sender: req.user._id,
            type: 'task_comment',
            message: `${req.user.name} commented on "${task.title}"`,
            link: `/board/${task.board}`,
            board: task.board, task: taskId,
          }))
      );
    }

    res.status(201).json(comment);
  } catch (err) { next(err); }
};

// @desc  Update comment
// @route PUT /api/comments/:id
const updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    comment.text = req.body.text;
    comment.isEdited = true;
    await comment.save();
    await comment.populate('author', 'name avatar');
    res.json(comment);
  } catch (err) { next(err); }
};

// @desc  Delete comment
// @route DELETE /api/comments/:id
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    await Task.findByIdAndUpdate(comment.task, { $pull: { comments: comment._id } });
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (err) { next(err); }
};

module.exports = { getTaskComments, addComment, updateComment, deleteComment };
