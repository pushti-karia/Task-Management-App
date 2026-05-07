const express = require('express');
const { getBoards, createBoard, getBoard, updateBoard, deleteBoard, inviteMember, removeMember } = require('../controllers/boardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.route('/').get(getBoards).post(createBoard);
router.route('/:id').get(getBoard).put(updateBoard).delete(deleteBoard);
router.post('/:id/invite', inviteMember);
router.delete('/:id/members/:userId', removeMember);

module.exports = router;
