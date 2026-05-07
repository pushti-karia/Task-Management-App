import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import { getSocket } from '../../services/socket';
import Avatar from '../Common/Avatar';
import Button from '../Common/Button';
import { timeAgo } from '../../utils/helpers';
import toast from 'react-hot-toast';

const CommentSection = ({ taskId, boardId }) => {
  const { user } = useSelector((s) => s.auth);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const typingTimer = useRef(null);

  useEffect(() => {
    api.get(`/comments/task/${taskId}`).then(res => setComments(res.data));

    const socket = getSocket();
    if (!socket) return;

    socket.on('new_comment', ({ taskId: tid, comment }) => {
      if (tid === taskId) setComments(prev => [...prev, comment]);
    });
    socket.on('user_typing', ({ taskId: tid, user: u }) => {
      if (tid === taskId && u._id !== user._id) setTypingUsers(prev => [...new Set([...prev, u.name])]);
    });
    socket.on('user_stopped_typing', ({ taskId: tid, userId }) => {
      if (tid === taskId) setTypingUsers(prev => prev.filter(n => n !== userId));
    });

    return () => { socket.off('new_comment'); socket.off('user_typing'); socket.off('user_stopped_typing'); };
  }, [taskId, user._id]);

  const handleTyping = () => {
    getSocket()?.emit('typing_start', { boardId, taskId });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => getSocket()?.emit('typing_stop', { boardId, taskId }), 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await api.post('/comments', { text, taskId });
      setComments(prev => [...prev, res.data]);
      getSocket()?.emit('new_comment', { boardId, taskId, comment: res.data });
      setText('');
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div>
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
        Comments ({comments.length})
      </h4>

      <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-2 group">
            <Avatar user={comment.author} size="sm" className="flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="bg-slate-800 rounded-xl px-3 py-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-white">{comment.author?.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600">{timeAgo(comment.createdAt)}</span>
                    {comment.isEdited && <span className="text-xs text-slate-600">(edited)</span>}
                    {comment.author?._id === user._id && (
                      <button onClick={() => handleDelete(comment._id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-300">{comment.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {typingUsers.length > 0 && (
        <p className="text-xs text-slate-500 mb-2 italic">{typingUsers.join(', ')} typing...</p>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Avatar user={user} size="sm" className="flex-shrink-0 mt-1" />
        <div className="flex-1 flex gap-2">
          <input
            className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write a comment..."
            value={text} onChange={(e) => { setText(e.target.value); handleTyping(); }}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
          />
          <Button type="submit" size="sm" loading={loading} disabled={!text.trim()}>Post</Button>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;
