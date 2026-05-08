import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const features = [
  { icon: '🎯', title: 'Kanban Boards', desc: 'Visualize your workflow with drag-and-drop task management' },
  { icon: '⚡', title: 'Real-time Sync', desc: 'Collaborate live with your team using Socket.io' },
  { icon: '👥', title: 'Team Collaboration', desc: 'Invite members, assign tasks, and track progress together' },
  { icon: '🔔', title: 'Smart Notifications', desc: 'Stay updated with instant notifications for all activities' },
  { icon: '📊', title: 'Priority Tracking', desc: 'Set priorities and due dates to keep projects on track' },
  { icon: '💬', title: 'Task Comments', desc: 'Discuss tasks with your team directly in context' },
];


const LandingPage = () => (
  <div className="min-h-screen bg-slate-950 text-white">
    {/* Navbar */}
    <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800 max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <span className="font-bold text-xl">TaskFlow</span>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/login" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Sign In</Link>
        <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Get Started Free
        </Link>
      </div>
    </nav>

    {/* Hero */}
    <section className="max-w-7xl mx-auto px-6 py-24 text-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <span className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
          Real-time Collaboration
        </span>
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
          Manage Tasks
          <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            Like a Pro
          </span>
        </h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          TaskFlow brings your team together with real-time Kanban boards, smart notifications, and seamless collaboration tools.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-500/25">
            Start for Free →
          </Link>
          <Link to="/login"
            className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all">
            Sign In
          </Link>
        </div>
      </motion.div>

      {/* Mock Board Preview */}
      <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-20 bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl shadow-black/50 max-w-4xl mx-auto">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[
            { title: 'To Do', color: '#64748b', tasks: ['Design mockups', 'Write API docs', 'Setup CI/CD'] },
            { title: 'In Progress', color: '#3b82f6', tasks: ['Build auth system', 'Create dashboard'] },
            { title: 'Completed', color: '#22c55e', tasks: ['Project setup', 'Database schema'] },
          ].map((col) => (
            <div key={col.title} className="flex-shrink-0 w-56 bg-slate-800/60 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                <span className="text-sm font-semibold text-white">{col.title}</span>
                <span className="text-xs bg-slate-700 text-slate-400 px-1.5 rounded-full">{col.tasks.length}</span>
              </div>
              <div className="space-y-2">
                {col.tasks.map((t) => (
                  <div key={t} className="bg-slate-700/60 rounded-lg p-2.5 text-xs text-slate-300">{t}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>

    {/* Features */}
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need</h2>
        <p className="text-slate-400 text-lg">Powerful features to supercharge your team's productivity</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-slate-900 border border-slate-700/50 hover:border-slate-600 rounded-xl p-6 transition-all hover:-translate-y-1">
            <span className="text-3xl mb-4 block">{f.icon}</span>
            <h3 className="font-semibold text-white text-lg mb-2">{f.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="max-w-7xl mx-auto px-6 py-20 text-center">
      <div className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/20 rounded-2xl p-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to get started?</h2>
        <p className="text-slate-400 mb-8">Join thousands of teams already using TaskFlow</p>
        <Link to="/register"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105">
          Create Free Account
        </Link>
      </div>
    </section>

    <footer className="border-t border-slate-800 py-8 text-center text-slate-600 text-sm">
      © {new Date().getFullYear()} TaskFlow. Built with React, Node.js & MongoDB.
    </footer>
  </div>
);

export default LandingPage;
