import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await dispatch(loginUser(form)).unwrap();
      navigate('/dashboard');
      toast.success('Welcome back!');
    } catch (err) {
      toast.error(err || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">TaskFlow</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-slate-400 mt-1">Sign in to your account</p>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" placeholder="you@example.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email} />
            <Input label="Password" type="password" placeholder="••••••••"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password} />
            <Button type="submit" className="w-full justify-center" loading={loading}>Sign In</Button>
          </form>

          <div className="mt-4 p-3 bg-slate-800 rounded-lg">
            <p className="text-xs text-slate-500 text-center">Demo: <span className="text-slate-300">demo@taskflow.com</span> / <span className="text-slate-300">demo1234</span></p>
          </div>
        </div>

        <p className="text-center text-slate-500 mt-6 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
