import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask, deleteTask, clearSelectedTask } from '../../store/slices/taskSlice';
import { closeTaskModal } from '../../store/slices/uiSlice';
import { getSocket } from '../../services/socket';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import PriorityBadge from '../Common/PriorityBadge';
import Avatar from '../Common/Avatar';
import CommentSection from './CommentSection';
import { formatDate, getDueDateStatus, PRIORITY_CONFIG } from '../../utils/helpers';
import toast from 'react-hot-toast';

const TaskModal = ({ isOpen }) => {
  const dispatch = useDispatch();
  const { selectedTask } = useSelector((s) => s.tasks);
  const { currentBoard } = useSelector((s) => s.boards);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedTask) {
      setForm({
        title: selectedTask.title,
        description: selectedTask.description || '',
        priority: selectedTask.priority,
        dueDate: selectedTask.dueDate ? selectedTask.dueDate.split('T')[0] : '',
        coverColor: selectedTask.coverColor || '',
      });
    }
  }, [selectedTask]);

  const handleClose = () => {
    dispatch(closeTaskModal());
    dispatch(clearSelectedTask());
    setEditing(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await dispatch(updateTask({ id: selectedTask._id, data: form })).unwrap();
      getSocket()?.emit('task_updated', { boardId: selectedTask.board, task: result });
      setEditing(false);
      toast.success('Task updated');
    } catch (err) {
      toast.error(err || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await dispatch(deleteTask(selectedTask._id)).unwrap();
      getSocket()?.emit('task_deleted', { boardId: selectedTask.board, taskId: selectedTask._id });
      handleClose();
      toast.success('Task deleted');
    } catch (err) {
      toast.error(err || 'Failed to delete task');
    }
  };

  if (!selectedTask) return null;
  const dueDateStatus = getDueDateStatus(selectedTask.dueDate);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Cover */}
          {selectedTask.coverColor && (
            <div className="h-2 rounded-full mb-4" style={{ backgroundColor: selectedTask.coverColor }} />
          )}

          {/* Labels */}
          {selectedTask.labels?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {selectedTask.labels.map((label, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: label.color + '20', color: label.color, border: `1px solid ${label.color}40` }}>
                  {label.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          {editing ? (
            <input className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          ) : (
            <h2 className="text-xl font-bold text-white mb-3">{selectedTask.title}</h2>
          )}

          {/* Description */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</h4>
            {editing ? (
              <textarea
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4} placeholder="Add a description..."
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            ) : (
              <p className="text-sm text-slate-400 whitespace-pre-wrap">
                {selectedTask.description || <span className="italic text-slate-600">No description</span>}
              </p>
            )}
          </div>

          {/* Activity */}
          {selectedTask.activity?.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Activity</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedTask.activity.slice(-5).reverse().map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                    <Avatar user={a.user} size="sm" />
                    <span>{a.user?.name} <span className="text-slate-600">{a.action}</span></span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <CommentSection taskId={selectedTask._id} boardId={selectedTask.board} />
        </div>

        {/* Sidebar */}
        <div className="w-48 flex-shrink-0 space-y-4">
          {/* Actions */}
          <div className="space-y-2">
            {editing ? (
              <>
                <Button size="sm" className="w-full" onClick={handleSave} loading={loading}>Save</Button>
                <Button size="sm" variant="ghost" className="w-full" onClick={() => setEditing(false)}>Cancel</Button>
              </>
            ) : (
              <Button size="sm" variant="secondary" className="w-full" onClick={() => setEditing(true)}>
                Edit Task
              </Button>
            )}
            <Button size="sm" variant="danger" className="w-full" onClick={handleDelete}>Delete</Button>
          </div>

          {/* Priority */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Priority</h4>
            {editing ? (
              <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {Object.entries(PRIORITY_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            ) : (
              <PriorityBadge priority={selectedTask.priority} />
            )}
          </div>

          {/* Due Date */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Due Date</h4>
            {editing ? (
              <input type="date" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            ) : selectedTask.dueDate ? (
              <span className={`text-xs px-2 py-1 rounded-lg ${dueDateStatus === 'overdue' ? 'bg-red-500/10 text-red-400' : 'bg-slate-700 text-slate-300'}`}>
                {formatDate(selectedTask.dueDate)}
              </span>
            ) : (
              <span className="text-xs text-slate-600">No due date</span>
            )}
          </div>

          {/* Assignees */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Assignees</h4>
            {selectedTask.assignees?.length > 0 ? (
              <div className="space-y-1.5">
                {selectedTask.assignees.map((u) => (
                  <div key={u._id} className="flex items-center gap-2">
                    <Avatar user={u} size="sm" />
                    <span className="text-xs text-slate-300 truncate">{u.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs text-slate-600">No assignees</span>
            )}
          </div>

          {/* Created by */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Created by</h4>
            <div className="flex items-center gap-2">
              <Avatar user={selectedTask.createdBy} size="sm" />
              <span className="text-xs text-slate-400">{selectedTask.createdBy?.name}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskModal;
