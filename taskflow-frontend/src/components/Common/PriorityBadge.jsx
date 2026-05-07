import { PRIORITY_CONFIG } from '../../utils/helpers';

const PriorityBadge = ({ priority }) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${config.color} ${config.bg} ${config.border}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
};

export default PriorityBadge;
