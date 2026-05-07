import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns';

export const formatDate = (date) => format(new Date(date), 'MMM d, yyyy');
export const formatDateTime = (date) => format(new Date(date), 'MMM d, yyyy h:mm a');
export const timeAgo = (date) => formatDistanceToNow(new Date(date), { addSuffix: true });

export const getDueDateStatus = (dueDate) => {
  if (!dueDate) return null;
  const d = new Date(dueDate);
  if (isPast(d) && !isToday(d)) return 'overdue';
  if (isToday(d)) return 'today';
  if (isTomorrow(d)) return 'tomorrow';
  return 'upcoming';
};

export const PRIORITY_CONFIG = {
  low: { label: 'Low', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/30' },
  medium: { label: 'Medium', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  high: { label: 'High', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  urgent: { label: 'Urgent', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
};

export const COLUMN_CONFIG = {
  todo: { label: 'To Do', color: '#64748b' },
  inprogress: { label: 'In Progress', color: '#3b82f6' },
  completed: { label: 'Completed', color: '#22c55e' },
};

export const getInitials = (name = '') =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

export const generateAvatarColor = (name = '') => {
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};
