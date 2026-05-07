import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const AppLayout = ({ children, title }) => {
  const { sidebarOpen, darkMode } = useSelector((s) => s.ui);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Navbar title={title} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
