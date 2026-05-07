import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { deleteBoard } from '../../store/slices/boardSlice';
import Avatar from '../Common/Avatar';
import toast from 'react-hot-toast';

const BoardCard = ({ board, currentUserId }) => {
  const dispatch = useDispatch();
  const isOwner = board.owner?._id === currentUserId;

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!window.confirm('Delete this board and all its tasks?')) return;
    try {
      await dispatch(deleteBoard(board._id)).unwrap();
      toast.success('Board deleted');
    } catch (err) {
      toast.error(err || 'Failed to delete board');
    }
  };

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
      className="group relative rounded-xl overflow-hidden border border-slate-700/50 hover:border-slate-600 transition-all">
      <Link to={`/board/${board._id}`}>
        <div className="h-24 relative" style={{ backgroundColor: board.background }}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
          <div className="absolute bottom-2 left-3">
            <span className={`text-xs px-2 py-0.5 rounded-full ${board.visibility === 'private' ? 'bg-slate-700 text-slate-300' : 'bg-blue-600/80 text-white'}`}>
              {board.visibility}
            </span>
          </div>
        </div>
        <div className="bg-slate-800 p-4">
          <h3 className="font-semibold text-white truncate mb-1">{board.title}</h3>
          {board.description && <p className="text-xs text-slate-400 truncate mb-3">{board.description}</p>}
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {board.members?.slice(0, 4).map((m) => (
                <Avatar key={m.user?._id} user={m.user} size="sm" className="-ml-1 first:ml-0" />
              ))}
              {board.members?.length > 4 && (
                <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs text-slate-300 ring-2 ring-slate-800">
                  +{board.members.length - 4}
                </div>
              )}
            </div>
            <span className="text-xs text-slate-500">{board.members?.length} member{board.members?.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </Link>
      {isOwner && (
        <button onClick={handleDelete}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-lg">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </motion.div>
  );
};

export default BoardCard;
