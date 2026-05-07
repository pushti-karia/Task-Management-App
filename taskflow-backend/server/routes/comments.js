const express = require('express');
const { getTaskComments, addComment, updateComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);
router.get('/task/:taskId', getTaskComments);
router.post('/', addComment);
router.route('/:id').put(updateComment).delete(deleteComment);

module.exports = router;
