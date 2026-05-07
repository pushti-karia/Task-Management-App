import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTask } from '../../store/slices/taskSlice';
import { getSocket } from '../../services/socket';
import TaskCard from './TaskCard';
import Button from '../Common/Button';
import toast from 'react-hot-toast';

const TaskColumn = ({ column, tasks, boardId }) => {
  const dispatch = useDispatch();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const handleAddTask = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const result = await dispatch(createTask({ title, board: boardId, column: column.id, priority: 'medium' })).unwrap();
      getSocket()?.emit('task_created', { boardId, task: result });
      setTitle('');
      setAdding(false);
      toast.success('Task created');
    } catch (err) {
      toast.error(err || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const columnColors = { todo: '#64748b', inprogress: '#3b82f6', completed: '#22c55e' };
  const color = column.color || columnColors[column.id] || '#64748b';

  return (
    <div className={`flex flex-col w-72 flex-shrink-0 rounded-xl bg-slate-900/60 border transition-colors ${isOver ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-700/50'}`}>
      {/* Column Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          <h3 className="font-semibold text-white text-sm">{column.title}</h3>
          <span className="text-xs bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded-full">{tasks.length}</span>
        </div>
        <button onClick={() => setAdding(true)}
          className="text-slate-500 hover:text-blue-400 transition-colors p-1 rounded-lg hover:bg-slate-700">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Tasks */}
      <div ref={setNodeRef} className="flex-1 p-2 space-y-2 min-h-[100px] overflow-y-auto max-h-[calc(100vh-280px)]">
        <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => <TaskCard key={task._id} task={task} />)}
        </SortableContext>
      </div>

      {/* Add Task */}
      <div className="p-2">
        {adding ? (
          <div className="bg-slate-800 rounded-xl p-3 space-y-2">
            <textarea
              autoFocus
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2} placeholder="Task title..."
              value={title} onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddTask(); } if (e.key === 'Escape') setAdding(false); }}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddTask} loading={loading} className="flex-1">Add</Button>
              <Button size="sm" variant="ghost" onClick={() => { setAdding(false); setTitle(''); }}>Cancel</Button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAdding(true)}
            className="w-full flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add task
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
