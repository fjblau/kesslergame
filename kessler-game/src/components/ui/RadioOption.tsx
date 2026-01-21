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
    <label 
      className={`
        flex items-start gap-3 px-4 py-[10px] cursor-pointer transition-all border-2
        ${checked ? 'bg-cyber-cyan-600 border-cyber-cyan-400' : 'bg-deep-space-100 border-deep-space-50 hover:bg-deep-space-50 hover:border-cyber-cyan-800'}
      `}
    >
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="mt-1 w-4 h-4 accent-cyber-cyan-500 cursor-pointer"
      />
      <div className="flex-1">
        <div className={`font-semibold text-lg ${checked ? 'text-deep-space-500' : 'text-gray-200'}`}>
          {label}
        </div>
        {description && (
          <div className={`text-lg mt-1 ${checked ? 'text-deep-space-600' : 'text-gray-400'}`}>{description}</div>
        )}
        {children}
      </div>
    </label>
  );
}
