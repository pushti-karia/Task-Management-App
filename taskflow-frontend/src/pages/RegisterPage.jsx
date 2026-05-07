import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/slices/authSlice';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await dispatch(registerUser({ name: form.name, email: form.email, password: form.password })).unwrap();
      navigate('/dashboard');
      toast.success('Account created! Welcome to TaskFlow 🎉');
    } catch (err) {
      toast.error(err || 'Registration failed');
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
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-slate-400 mt-1">Start managing tasks for free</p>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" placeholder="John Doe"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name} />
            <Input label="Email" type="email" placeholder="you@example.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email} />
            <Input label="Password" type="password" placeholder="Min. 6 characters"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password} />
            <Input label="Confirm Password" type="password" placeholder="Repeat password"
              value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              error={errors.confirmPassword} />
            <Button type="submit" className="w-full justify-center" loading={loading}>Create Account</Button>
          </form>
        </div>

        <p className="text-center text-slate-500 mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
