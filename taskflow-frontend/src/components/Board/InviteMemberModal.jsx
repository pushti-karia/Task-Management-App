import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { inviteMember } from '../../store/slices/boardSlice';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import Input from '../Common/Input';
import Avatar from '../Common/Avatar';
import toast from 'react-hot-toast';

const InviteMemberModal = ({ isOpen, onClose, board }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(false);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await dispatch(inviteMember({ id: board._id, email, role })).unwrap();
      toast.success(`Invited ${email}`);
      setEmail('');
    } catch (err) {
      toast.error(err || 'Failed to invite member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Team Members">
      <form onSubmit={handleInvite} className="space-y-4">
        <div className="flex gap-2">
          <Input className="flex-1" placeholder="Email address" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} />
          <select className="bg-slate-800 border border-slate-600 rounded-lg px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <Button type="submit" loading={loading} className="w-full">Send Invite</Button>
      </form>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Current Members ({board?.members?.length})</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {board?.members?.map((m) => (
            <div key={m.user?._id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800">
              <Avatar user={m.user} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{m.user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{m.user?.email}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 capitalize">{m.role}</span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default InviteMemberModal;
