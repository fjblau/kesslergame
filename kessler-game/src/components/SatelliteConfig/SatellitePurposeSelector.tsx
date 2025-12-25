import type { SatelliteType } from '../../game/types';
import { SATELLITE_PURPOSE_CONFIG } from '../../game/constants';

interface SatellitePurposeSelectorProps {
  selected: SatelliteType | 'Random';
  onChange: (purpose: SatelliteType | 'Random') => void;
}

export function SatellitePurposeSelector({ selected, onChange }: SatellitePurposeSelectorProps) {
  const options: (SatelliteType | 'Random')[] = ['Weather', 'Comms', 'GPS', 'Random'];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300">Satellite Type</label>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const config = SATELLITE_PURPOSE_CONFIG[option];
          const isSelected = selected === option;

          return (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`
                p-4 rounded-xl border-2 transition-all
                ${isSelected 
                  ? 'border-blue-500 bg-blue-600 text-white shadow-lg' 
                  : 'border-slate-600 bg-slate-700 text-gray-300 hover:bg-slate-600 hover:border-slate-500'}
              `}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">{config.icon}</span>
                <span className="font-medium">{option}</span>
              </div>
              {config.discount > 0 && (
                <div className="text-xs text-green-400 mt-1">
                  -{(config.discount * 100).toFixed(0)}% cost
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
