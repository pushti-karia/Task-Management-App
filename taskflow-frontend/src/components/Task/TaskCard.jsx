import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { setSelectedTask } from '../../store/slices/taskSlice';
import { openTaskModal } from '../../store/slices/uiSlice';
import PriorityBadge from '../Common/PriorityBadge';
import Avatar from '../Common/Avatar';
import { formatDate, getDueDateStatus } from '../../utils/helpers';

const dueDateColors = {
  overdue: 'text-red-400 bg-red-500/10',
  today: 'text-yellow-400 bg-yellow-500/10',
  tomorrow: 'text-blue-400 bg-blue-500/10',
  upcoming: 'text-slate-400 bg-slate-700',
};

const TaskCard = ({ task }) => {
  const dispatch = useDispatch();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  const dueDateStatus = getDueDateStatus(task.dueDate);

  const handleClick = () => {
    dispatch(setSelectedTask(task));
    dispatch(openTaskModal());
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <motion.div
        layout
        onClick={handleClick}
        className="bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-xl p-3 cursor-pointer group transition-all hover:shadow-lg hover:shadow-black/20"
      >
        {/* Cover color */}
        {task.coverColor && <div className="h-1.5 rounded-full mb-3" style={{ backgroundColor: task.coverColor }} />}

        {/* Labels */}
        {task.labels?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {task.labels.map((label, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: label.color + '20', color: label.color, border: `1px solid ${label.color}40` }}>
                {label.name}
              </span>
            ))}
          </div>
        )}

        <p className="text-sm font-medium text-white mb-2 leading-snug">{task.title}</p>

        {task.description && (
          <p className="text-xs text-slate-500 mb-2 line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <PriorityBadge priority={task.priority} />
            {task.dueDate && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${dueDateColors[dueDateStatus] || dueDateColors.upcoming}`}>
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {task.comments?.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {task.comments.length}
              </span>
            )}
            {task.assignees?.length > 0 && (
              <div className="flex -space-x-1">
                {task.assignees.slice(0, 3).map((u) => <Avatar key={u._id} user={u} size="sm" />)}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskCard;
