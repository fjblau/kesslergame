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
      flex items-start gap-3 px-4 py-[15px] rounded-xl cursor-pointer transition-all
      ${checked ? 'bg-blue-600 border-2 border-blue-500 shadow-lg' : 'bg-slate-700 border-2 border-slate-600 hover:bg-slate-600 hover:border-slate-500'}
    `}>
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="mt-1 w-4 h-4 accent-blue-500 cursor-pointer"
      />
      <div className="flex-1">
        <div className={`font-semibold text-base ${checked ? 'text-white' : 'text-gray-200'}`}>
          {label}
        </div>
        {description && (
          <div className={`text-base mt-1 ${checked ? 'text-blue-100' : 'text-gray-400'}`}>{description}</div>
        )}
        {children}
      </div>
    </label>
  );
}
