const Task = require('../models/Task');
const Board = require('../models/Board');
const Notification = require('../models/Notification');

// @desc  Get tasks for a board
// @route GET /api/tasks/board/:boardId
const getBoardTasks = async (req, res, next) => {
  try {
    const { search, priority, assignee } = req.query;
    const filter = { board: req.params.boardId, isArchived: false };
    if (priority) filter.priority = priority;
    if (assignee) filter.assignees = assignee;
    if (search) filter.$text = { $search: search };

    const tasks = await Task.find(filter)
      .populate('assignees', 'name avatar email')
      .populate('createdBy', 'name avatar')
      .sort({ order: 1 });
    res.json(tasks);
  } catch (err) { next(err); }
};

// @desc  Create task
// @route POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, board, column, priority, dueDate, labels, assignees } = req.body;

    const boardDoc = await Board.findById(board);
    if (!boardDoc) return res.status(404).json({ message: 'Board not found' });

    const lastTask = await Task.findOne({ board, column }).sort({ order: -1 });
    const order = lastTask ? lastTask.order + 1 : 0;

    const task = await Task.create({
      title, description, board, column, priority, dueDate, labels,
      assignees: assignees || [],
      createdBy: req.user._id,
      order,
      activity: [{ user: req.user._id, action: 'created this task' }],
    });

    await task.populate('assignees', 'name avatar email');
    await task.populate('createdBy', 'name avatar');

    // Notify assignees
    if (assignees?.length) {
      const notifications = assignees.map(userId => ({
        recipient: userId,
        sender: req.user._id,
        type: 'task_assigned',
        message: `${req.user.name} assigned you to "${title}"`,
        link: `/board/${board}`,
        board, task: task._id,
      }));
      await Notification.insertMany(notifications);
    }

    res.status(201).json(task);
  } catch (err) { next(err); }
};

// @desc  Get single task
// @route GET /api/tasks/:id
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignees', 'name avatar email')
      .populate('createdBy', 'name avatar')
      .populate({ path: 'comments', populate: { path: 'author', select: 'name avatar' } })
      .populate('activity.user', 'name avatar');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) { next(err); }
};

// @desc  Update task
// @route PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { column: newColumn, assignees } = req.body;
    const activityEntry = { user: req.user._id, action: 'updated this task' };

    if (newColumn && newColumn !== task.column) {
      activityEntry.action = `moved task to "${newColumn}"`;
    }

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body, $push: { activity: activityEntry } },
      { new: true }
    ).populate('assignees', 'name avatar email').populate('createdBy', 'name avatar');

    // Notify new assignees
    if (assignees) {
      const newAssignees = assignees.filter(
        id => !task.assignees.map(a => a.toString()).includes(id)
      );
      if (newAssignees.length) {
        await Notification.insertMany(newAssignees.map(userId => ({
          recipient: userId,
          sender: req.user._id,
          type: 'task_assigned',
          message: `${req.user.name} assigned you to "${task.title}"`,
          link: `/board/${task.board}`,
          board: task.board, task: task._id,
        })));
      }
    }

    res.json(updated);
  } catch (err) { next(err); }
};

// @desc  Delete task
// @route DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) { next(err); }
};

// @desc  Move task (drag & drop)
// @route PUT /api/tasks/:id/move
const moveTask = async (req, res, next) => {
  try {
    const { column, order, boardId } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { column, order, $push: { activity: { user: req.user._id, action: `moved to "${column}"` } } },
      { new: true }
    ).populate('assignees', 'name avatar email');
    res.json(task);
  } catch (err) { next(err); }
};

// @desc  Reorder tasks in column
// @route PUT /api/tasks/reorder
const reorderTasks = async (req, res, next) => {
  try {
    const { tasks } = req.body; // [{ id, order, column }]
    const bulkOps = tasks.map(({ id, order, column }) => ({
      updateOne: { filter: { _id: id }, update: { order, column } },
    }));
    await Task.bulkWrite(bulkOps);
    res.json({ message: 'Tasks reordered' });
  } catch (err) { next(err); }
};

module.exports = { getBoardTasks, createTask, getTask, updateTask, deleteTask, moveTask, reorderTasks };
