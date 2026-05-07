const express = require('express');
const { getBoardTasks, createTask, getTask, updateTask, deleteTask, moveTask, reorderTasks } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/board/:boardId', getBoardTasks);
router.put('/reorder', reorderTasks);
router.route('/').post(createTask);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);
router.put('/:id/move', moveTask);

module.exports = router;
