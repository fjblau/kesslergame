import type { SatelliteType, OrbitLayer, InsuranceTier } from '../../game/types';
import { SATELLITE_PURPOSE_CONFIG, LAUNCH_COSTS, INSURANCE_CONFIG } from '../../game/constants';

interface SatellitePurposeSelectorProps {
  selected: SatelliteType | 'Random';
  onChange: (purpose: SatelliteType | 'Random') => void;
  selectedOrbit: OrbitLayer;
  insuranceTier: InsuranceTier;
}

export function SatellitePurposeSelector({ selected, onChange, selectedOrbit, insuranceTier }: SatellitePurposeSelectorProps) {
  const options: (SatelliteType | 'Random')[] = ['Weather', 'Comms', 'GPS', 'Random'];

  const calculateCost = (purpose: SatelliteType | 'Random') => {
    const baseCost = LAUNCH_COSTS[selectedOrbit];
    const purposeDiscount = purpose === 'Random' ? SATELLITE_PURPOSE_CONFIG.Random.discount : 0;
    const insuranceCost = INSURANCE_CONFIG[insuranceTier].cost;
    return baseCost * (1 - purposeDiscount) + insuranceCost;
  };

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
                p-4 rounded-xl border-2 transition-all min-h-[78px] flex flex-col items-center justify-center
                ${isSelected 
                  ? 'border-blue-500 bg-blue-600 text-white shadow-lg' 
                  : 'border-slate-600 bg-slate-700 text-gray-300 hover:bg-slate-600 hover:border-slate-500'}
              `}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">{config.icon}</span>
                <span className="font-medium">{option}</span>
              </div>
              <div className="text-xs opacity-75 mt-1">
                ${(calculateCost(option) / 1e6).toFixed(1)}M
              </div>
              {config.discount > 0 && (
                <div className="text-xs text-green-400">
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
