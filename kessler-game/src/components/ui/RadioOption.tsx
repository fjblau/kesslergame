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
        flex items-start gap-3 px-4 py-[10px] rounded-xl cursor-pointer transition-all
        ${checked ? 'bg-blue-600 border-2 border-blue-500' : 'bg-slate-700 border-2 border-slate-600 hover:bg-slate-600 hover:border-slate-500'}
      `}
      style={{
        boxShadow: checked
          ? 'inset 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(0,0,0,0.2)'
          : '0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
      }}
      onMouseEnter={(e) => {
        if (!checked) {
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (!checked) {
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)';
        }
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(0,0,0,0.2)';
      }}
      onMouseUp={(e) => {
        if (!checked) {
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)';
        }
      }}
    >
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="mt-1 w-4 h-4 accent-blue-500 cursor-pointer"
      />
      <div className="flex-1">
        <div className={`font-semibold text-lg ${checked ? 'text-white' : 'text-gray-200'}`}>
          {label}
        </div>
        {description && (
          <div className={`text-lg mt-1 ${checked ? 'text-blue-100' : 'text-gray-400'}`}>{description}</div>
        )}
        {children}
      </div>
    </label>
  );
}
