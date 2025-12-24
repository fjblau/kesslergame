import type { DRVTargetPriority as DRVPriorityType } from '../../game/types';
import { DRV_PRIORITY_CONFIG } from '../../game/constants';
import { RadioOption } from '../ui/RadioOption';

interface DRVTargetPriorityProps {
  selected: DRVPriorityType;
  onChange: (priority: DRVPriorityType) => void;
}

export function DRVTargetPriority({ selected, onChange }: DRVTargetPriorityProps) {
  const priorities: DRVPriorityType[] = ['auto', 'cooperative-focus', 'uncooperative-focus'];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300">Target Priority</label>
      <div className="space-y-2">
        {priorities.map((priority) => {
          const config = DRV_PRIORITY_CONFIG[priority];
          const label = priority.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          const modifier = config.costModifier !== 1.0 
            ? ` (${config.costModifier > 1 ? '+' : ''}${((config.costModifier - 1) * 100).toFixed(0)}% cost)`
            : '';

          return (
            <RadioOption
              key={priority}
              checked={selected === priority}
              onChange={() => onChange(priority)}
              label={`${label}${modifier}`}
              description={config.description}
            />
          );
        })}
      </div>
    </div>
  );
}
