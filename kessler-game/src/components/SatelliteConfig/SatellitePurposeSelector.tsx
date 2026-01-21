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
      <label className="text-base font-medium text-gray-300">Satellite Type</label>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const config = SATELLITE_PURPOSE_CONFIG[option];
          const isSelected = selected === option;

          return (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`
                p-[7px] border-none border-2 transition-all min-h-[54px] flex flex-col items-center justify-center
                ${isSelected 
                  ? 'border-blue-500 bg-cyber-cyan-600 text-white' 
                  : 'border-deep-space-50 bg-deep-space-100 text-gray-300 hover:bg-deep-space-50 hover:border-cyber-cyan-800'}
              `}
              style={{
                boxShadow: isSelected
                  ? 'inset 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(0,0,0,0.2)'
                  : '0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)';
                }
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(0,0,0,0.2)';
              }}
              onMouseUp={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)';
                }
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">{config.icon}</span>
                <span className="font-medium text-lg">{option}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
