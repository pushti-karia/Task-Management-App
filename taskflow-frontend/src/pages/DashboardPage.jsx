import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchBoards } from '../store/slices/boardSlice';
import { openCreateBoardModal } from '../store/slices/uiSlice';
import AppLayout from '../components/Layout/AppLayout';
import BoardCard from '../components/Board/BoardCard';
import CreateBoardModal from '../components/Board/CreateBoardModal';
import Spinner from '../components/Common/Spinner';
import Button from '../components/Common/Button';
import Avatar from '../components/Common/Avatar';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { boards, loading } = useSelector((s) => s.boards);
  const { createBoardModalOpen } = useSelector((s) => s.ui);

  useEffect(() => { dispatch(fetchBoards()); }, [dispatch]);

  const myBoards = boards.filter(b => b.owner?._id === user?._id);
  const sharedBoards = boards.filter(b => b.owner?._id !== user?._id);

  return (
    <AppLayout title="Dashboard">
      {/* Profile Banner */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/20 rounded-2xl p-6 mb-8 flex items-center gap-5">
        <Avatar user={user} size="xl" />
        <div>
          <h2 className="text-2xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
          <p className="text-slate-400 mt-1">You have {boards.length} board{boards.length !== 1 ? 's' : ''} · {myBoards.length} owned</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Boards', value: boards.length, icon: '📋', color: 'from-blue-500/20 to-blue-600/10' },
          { label: 'My Boards', value: myBoards.length, icon: '🎯', color: 'from-violet-500/20 to-violet-600/10' },
          { label: 'Shared', value: sharedBoards.length, icon: '👥', color: 'from-green-500/20 to-green-600/10' },
          { label: 'Members', value: [...new Set(boards.flatMap(b => b.members?.map(m => m.user?._id)))].length, icon: '🤝', color: 'from-orange-500/20 to-orange-600/10' },
        ].map((stat) => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.color} border border-slate-700/50 rounded-xl p-4`}>
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
            <p className="text-xs text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* My Boards */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">My Boards</h3>
          <Button size="sm" onClick={() => dispatch(openCreateBoardModal())}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Board
          </Button>
        </div>

        {loading ? (
          <Spinner className="py-12" />
        ) : myBoards.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-700 rounded-2xl">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-slate-400 mb-4">No boards yet. Create your first one!</p>
            <Button onClick={() => dispatch(openCreateBoardModal())}>Create Board</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {myBoards.map((board) => (
              <BoardCard key={board._id} board={board} currentUserId={user?._id} />
            ))}
          </div>
        )}
      </div>

      {/* Shared Boards */}
      {sharedBoards.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Shared with me</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sharedBoards.map((board) => (
              <BoardCard key={board._id} board={board} currentUserId={user?._id} />
            ))}
          </div>
        </div>
      )}

      <CreateBoardModal isOpen={createBoardModalOpen} />
    </AppLayout>
  );
};

export default DashboardPage;
