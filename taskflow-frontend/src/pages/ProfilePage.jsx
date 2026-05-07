import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../store/slices/authSlice';
import AppLayout from '../components/Layout/AppLayout';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import Avatar from '../components/Common/Avatar';
import api from '../services/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(updateProfile(form)).unwrap();
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('Passwords do not match');
    if (pwForm.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setPwLoading(true);
    try {
      await api.put('/auth/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <AppLayout title="Profile Settings">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Profile Information</h2>
          <div className="flex items-center gap-4 mb-6">
            <Avatar user={user} size="xl" />
            <div>
              <p className="font-semibold text-white">{user?.name}</p>
              <p className="text-sm text-slate-400">{user?.email}</p>
              <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full mt-1 inline-block capitalize">
                {user?.role}
              </span>
            </div>
          </div>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-300">Bio</label>
              <textarea
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3} placeholder="Tell us about yourself..."
                value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>
            <Button type="submit" loading={loading}>Save Changes</Button>
          </form>
        </div>

        {/* Password Card */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input label="Current Password" type="password" placeholder="••••••••"
              value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
            <Input label="New Password" type="password" placeholder="Min. 6 characters"
              value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} />
            <Input label="Confirm New Password" type="password" placeholder="Repeat new password"
              value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} />
            <Button type="submit" loading={pwLoading}>Update Password</Button>
          </form>
        </div>

        {/* Account Info */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Account Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Email</span>
              <span className="text-white">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Member since</span>
              <span className="text-white">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
