import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useSocket } from './hooks/useSocket';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BoardPage from './pages/BoardPage';
import ProfilePage from './pages/ProfilePage';

const AppRoutes = () => {
  useSocket(); // Initialize socket connection globally
  const { token } = useSelector((s) => s.auth);

  return (
    <Routes>
      <Route path="/" element={token ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <RegisterPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/board/:id" element={<ProtectedRoute><BoardPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <AppRoutes />
    <Toaster
      position="top-right"
      toastOptions={{
        style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' },
        success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
      }}
    />
  </BrowserRouter>
);

export default App;
