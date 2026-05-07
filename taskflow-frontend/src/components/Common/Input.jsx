import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
    <input
      ref={ref}
      className={`bg-slate-800 border ${error ? 'border-red-500' : 'border-slate-600'} rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${className}`}
      {...props}
    />
    {error && <span className="text-xs text-red-400">{error}</span>}
  </div>
));

Input.displayName = 'Input';
export default Input;
