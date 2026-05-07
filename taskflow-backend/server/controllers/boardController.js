const Board = require('../models/Board');
const Task = require('../models/Task');
const User = require('../models/User');
const Notification = require('../models/Notification');

const DEFAULT_COLUMNS = [
  { id: 'todo', title: 'To Do', order: 0, color: '#64748b' },
  { id: 'inprogress', title: 'In Progress', order: 1, color: '#3b82f6' },
  { id: 'completed', title: 'Completed', order: 2, color: '#22c55e' },
];

// @desc  Get all boards for user
// @route GET /api/boards
const getBoards = async (req, res, next) => {
  try {
    const boards = await Board.find({
      $or: [{ owner: req.user._id }, { 'members.user': req.user._id }],
      isArchived: false,
    }).populate('owner', 'name avatar').populate('members.user', 'name avatar email');
    res.json(boards);
  } catch (err) { next(err); }
};

// @desc  Create board
// @route POST /api/boards
const createBoard = async (req, res, next) => {
  try {
    const { title, description, background, visibility } = req.body;
    const board = await Board.create({
      title, description, background, visibility,
      owner: req.user._id,
      columns: DEFAULT_COLUMNS,
      members: [{ user: req.user._id, role: 'admin' }],
    });
    await User.findByIdAndUpdate(req.user._id, { $push: { boards: board._id } });
    await board.populate('owner', 'name avatar');
    res.status(201).json(board);
  } catch (err) { next(err); }
};

// @desc  Get single board
// @route GET /api/boards/:id
const getBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate('owner', 'name avatar email')
      .populate('members.user', 'name avatar email');
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const isMember = board.members.some(m => m.user._id.toString() === req.user._id.toString());
    if (!isMember && board.visibility === 'private')
      return res.status(403).json({ message: 'Access denied' });

    res.json(board);
  } catch (err) { next(err); }
};

// @desc  Update board
// @route PUT /api/boards/:id
const updateBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    if (board.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Only board owner can update' });

    const updated = await Board.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('owner', 'name avatar').populate('members.user', 'name avatar email');
    res.json(updated);
  } catch (err) { next(err); }
};

// @desc  Delete board
// @route DELETE /api/boards/:id
const deleteBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    if (board.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Only board owner can delete' });

    await Task.deleteMany({ board: req.params.id });
    await Board.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(req.user._id, { $pull: { boards: req.params.id } });
    res.json({ message: 'Board deleted' });
  } catch (err) { next(err); }
};

// @desc  Invite member to board
// @route POST /api/boards/:id/invite
const inviteMember = async (req, res, next) => {
  try {
    const { email, role = 'member' } = req.body;
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const invitee = await User.findOne({ email });
    if (!invitee) return res.status(404).json({ message: 'User not found' });

    const alreadyMember = board.members.some(m => m.user.toString() === invitee._id.toString());
    if (alreadyMember) return res.status(400).json({ message: 'User already a member' });

    board.members.push({ user: invitee._id, role });
    await board.save();

    await Notification.create({
      recipient: invitee._id,
      sender: req.user._id,
      type: 'board_invite',
      message: `${req.user.name} invited you to board "${board.title}"`,
      link: `/board/${board._id}`,
      board: board._id,
    });

    await board.populate('members.user', 'name avatar email');
    res.json(board);
  } catch (err) { next(err); }
};

// @desc  Remove member from board
// @route DELETE /api/boards/:id/members/:userId
const removeMember = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    if (board.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Only owner can remove members' });

    board.members = board.members.filter(m => m.user.toString() !== req.params.userId);
    await board.save();
    res.json({ message: 'Member removed' });
  } catch (err) { next(err); }
};

module.exports = { getBoards, createBoard, getBoard, updateBoard, deleteBoard, inviteMember, removeMember };
