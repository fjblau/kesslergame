import type { ReactNode } from 'react';

interface RadioOptionProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
  children?: ReactNode;
}

export function RadioOption({ checked, onChange, label, description, children }: RadioOptionProps) {
  return (
    <label className={`
      flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors
      ${checked ? 'bg-blue-900/30 border border-blue-500/50' : 'bg-slate-800 border border-slate-700 hover:bg-slate-700'}
    `}>
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="mt-1 w-4 h-4 accent-blue-500 cursor-pointer"
      />
      <div className="flex-1">
        <div className={`font-medium ${checked ? 'text-blue-300' : 'text-gray-200'}`}>
          {label}
        </div>
        {description && (
          <div className="text-sm text-gray-400 mt-1">{description}</div>
        )}
        {children}
      </div>
    </label>
  );
}
