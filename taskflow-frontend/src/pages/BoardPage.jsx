import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { fetchBoard } from '../store/slices/boardSlice';
import { fetchBoardTasks, optimisticMove, reorderTasks } from '../store/slices/taskSlice';
import { getSocket } from '../services/socket';
import { useBoardSocket } from '../hooks/useSocket';
import AppLayout from '../components/Layout/AppLayout';
import TaskColumn from '../components/Task/TaskColumn';
import TaskCard from '../components/Task/TaskCard';
import TaskModal from '../components/Task/TaskModal';
import InviteMemberModal from '../components/Board/InviteMemberModal';
import Spinner from '../components/Common/Spinner';
import Button from '../components/Common/Button';
import Avatar from '../components/Common/Avatar';

const BoardPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentBoard } = useSelector((s) => s.boards);
  const { tasks, loading } = useSelector((s) => s.tasks);
  const { taskModalOpen } = useSelector((s) => s.ui);
  const [activeTask, setActiveTask] = useState(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  useBoardSocket(id);

  useEffect(() => {
    dispatch(fetchBoard(id));
    dispatch(fetchBoardTasks({ boardId: id }));
  }, [id, dispatch]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const getColumnTasks = useCallback((columnId) => {
    let filtered = tasks.filter(t => t.column === columnId);
    if (search) filtered = filtered.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    if (filterPriority) filtered = filtered.filter(t => t.priority === filterPriority);
    return filtered.sort((a, b) => a.order - b.order);
  }, [tasks, search, filterPriority]);

  const handleDragStart = ({ active }) => {
    setActiveTask(tasks.find(t => t._id === active.id));
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;

    const activeTask = tasks.find(t => t._id === active.id);
    if (!activeTask) return;

    const overId = over.id;
    const columns = currentBoard?.columns || [];
    const isOverColumn = columns.some(c => c.id === overId);
    const targetColumn = isOverColumn ? overId : tasks.find(t => t._id === overId)?.column;

    if (!targetColumn) return;

    const columnTasks = tasks.filter(t => t.column === targetColumn).sort((a, b) => a.order - b.order);
    let newOrder = columnTasks.length;

    if (!isOverColumn) {
      const overIndex = columnTasks.findIndex(t => t._id === overId);
      newOrder = overIndex >= 0 ? overIndex : newOrder;
    }

    // Optimistic update
    dispatch(optimisticMove({ taskId: active.id, column: targetColumn, order: newOrder }));

    // Persist & broadcast
    const updatedTasks = columnTasks
      .filter(t => t._id !== active.id)
      .map((t, i) => ({ id: t._id, order: i >= newOrder ? i + 1 : i, column: targetColumn }));
    updatedTasks.push({ id: active.id, order: newOrder, column: targetColumn });

    dispatch(reorderTasks(updatedTasks));
    getSocket()?.emit('task_moved', { boardId: id, taskId: active.id, column: targetColumn, order: newOrder });
  };

  if (!currentBoard) return <AppLayout><Spinner className="py-32" /></AppLayout>;

  return (
    <AppLayout title={currentBoard.title}>
      {/* Board Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {currentBoard.members?.slice(0, 5).map((m) => (
              <Avatar key={m.user?._id} user={m.user} size="sm" />
            ))}
          </div>
          <span className="text-sm text-slate-400">{currentBoard.members?.length} member{currentBoard.members?.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Priority Filter */}
          <select
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            <option value="">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <Button size="sm" variant="secondary" onClick={() => setInviteOpen(true)}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Invite
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      {loading ? (
        <Spinner className="py-32" />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-6">
            {(currentBoard.columns || []).map((column) => (
              <TaskColumn key={column.id} column={column} tasks={getColumnTasks(column.id)} boardId={id} />
            ))}
          </div>
          <DragOverlay>
            {activeTask && (
              <div className="rotate-2 opacity-90">
                <TaskCard task={activeTask} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}

      <TaskModal isOpen={taskModalOpen} />
      <InviteMemberModal isOpen={inviteOpen} onClose={() => setInviteOpen(false)} board={currentBoard} />
    </AppLayout>
  );
};

export default BoardPage;
