import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { fetchNotifications, markAllRead } from '../../store/slices/notificationSlice';
import { useEffect, useState } from 'react';
import Avatar from '../Common/Avatar';
import { timeAgo } from '../../utils/helpers';

const Navbar = ({ title }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { notifications, unreadCount } = useSelector((s) => s.notifications);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => { dispatch(fetchNotifications()); }, [dispatch]);

  return (
    <header className="h-14 bg-slate-900/80 backdrop-blur border-b border-slate-700/50 flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button onClick={() => dispatch(toggleSidebar())}
          className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {title && <h1 className="text-white font-semibold text-lg">{title}</h1>}
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setShowNotifs(!showNotifs)}
            className="relative text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-10 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="flex items-center justify-between p-3 border-b border-slate-700">
                <span className="font-semibold text-white text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={() => dispatch(markAllRead())} className="text-xs text-blue-400 hover:text-blue-300">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-6">No notifications</p>
                ) : (
                  notifications.slice(0, 10).map((n) => (
                    <div key={n._id} className={`p-3 border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors ${!n.isRead ? 'bg-blue-500/5' : ''}`}>
                      <div className="flex items-start gap-2">
                        <Avatar user={n.sender} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-300">{n.message}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{timeAgo(n.createdAt)}</p>
                        </div>
                        {!n.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <Link to="/profile">
          <Avatar user={user} size="sm" className="cursor-pointer hover:ring-blue-500 transition-all" />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
