import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createBoard } from '../../store/slices/boardSlice';
import { closeCreateBoardModal } from '../../store/slices/uiSlice';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import Input from '../Common/Input';
import toast from 'react-hot-toast';

const BACKGROUNDS = ['#1e293b', '#1e3a5f', '#1a1a2e', '#0d1b2a', '#1b2838', '#2d1b69', '#1a0a2e', '#0a1628'];

const CreateBoardModal = ({ isOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', background: '#1e293b', visibility: 'private' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Board title is required');
    setLoading(true);
    try {
      const result = await dispatch(createBoard(form)).unwrap();
      dispatch(closeCreateBoardModal());
      navigate(`/board/${result._id}`);
      toast.success('Board created!');
    } catch (err) {
      toast.error(err || 'Failed to create board');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => dispatch(closeCreateBoardModal())} title="Create New Board">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Board Title *" placeholder="e.g. My Project" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-300">Description</label>
          <textarea
            className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3} placeholder="What is this board about?"
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300 block mb-2">Background Color</label>
          <div className="flex gap-2 flex-wrap">
            {BACKGROUNDS.map((bg) => (
              <button key={bg} type="button" onClick={() => setForm({ ...form, background: bg })}
                className={`w-8 h-8 rounded-lg transition-all ${form.background === bg ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900 scale-110' : 'hover:scale-105'}`}
                style={{ backgroundColor: bg }} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-300">Visibility</label>
          <select className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })}>
            <option value="private">Private</option>
            <option value="team">Team</option>
            <option value="public">Public</option>
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={() => dispatch(closeCreateBoardModal())}>Cancel</Button>
          <Button type="submit" className="flex-1" loading={loading}>Create Board</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateBoardModal;
