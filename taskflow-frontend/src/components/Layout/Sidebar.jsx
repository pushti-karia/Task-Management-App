import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../store/slices/authSlice';
import { toggleDarkMode, toggleSidebar, openCreateBoardModal } from '../../store/slices/uiSlice';
import Avatar from '../Common/Avatar';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { path: '/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);
  const { sidebarOpen, darkMode } = useSelector((s) => s.ui);
  const { boards } = useSelector((s) => s.boards);

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
          transition={{ duration: 0.25 }}
          className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-700/50 z-40 flex flex-col"
        >
          {/* Logo */}
          <div className="p-5 border-b border-slate-700/50">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-white font-bold text-lg">TaskFlow</span>
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-1 mb-6">
              {navItems.map(({ path, label, icon }) => (
                <Link key={path} to={path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === path ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                  </svg>
                  {label}
                </Link>
              ))}
            </div>

            {/* Boards */}
            <div>
              <div className="flex items-center justify-between mb-2 px-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Boards</span>
                <button onClick={() => dispatch(openCreateBoardModal())}
                  className="text-slate-500 hover:text-blue-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <div className="space-y-1">
                {boards.slice(0, 8).map((board) => (
                  <Link key={board._id} to={`/board/${board._id}`}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${location.pathname === `/board/${board._id}` ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                  >
                    <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: board.background }} />
                    <span className="truncate">{board.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700/50 space-y-2">
            <button onClick={() => dispatch(toggleDarkMode())}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={darkMode ? 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' : 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'} />
              </svg>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar user={user} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors" title="Logout">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
