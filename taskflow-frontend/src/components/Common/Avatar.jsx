import { getInitials, generateAvatarColor } from '../../utils/helpers';

const Avatar = ({ user, size = 'md', className = '' }) => {
  const sizes = { sm: 'w-6 h-6 text-xs', md: 'w-8 h-8 text-sm', lg: 'w-10 h-10 text-base', xl: 'w-14 h-14 text-xl' };
  const bg = generateAvatarColor(user?.name || '');

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className={`${sizes[size]} rounded-full object-cover ring-2 ring-white/10 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white/10 ${className}`}
      style={{ backgroundColor: bg }}
      title={user?.name}
    >
      {getInitials(user?.name)}
    </div>
  );
};

export default Avatar;
