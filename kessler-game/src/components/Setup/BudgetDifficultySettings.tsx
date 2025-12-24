import type { BudgetDifficulty } from '../../game/types';
import { BUDGET_DIFFICULTY_CONFIG } from '../../game/constants';
import { RadioOption } from '../ui/RadioOption';

interface BudgetDifficultySettingsProps {
  selected: BudgetDifficulty;
  onChange: (difficulty: BudgetDifficulty) => void;
}

export function BudgetDifficultySettings({ selected, onChange }: BudgetDifficultySettingsProps) {
  const difficulties: BudgetDifficulty[] = ['easy', 'normal', 'hard', 'challenge'];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-blue-300">Budget Difficulty</h3>
      <div className="space-y-3">
        {difficulties.map((diff) => {
          const config = BUDGET_DIFFICULTY_CONFIG[diff];
          return (
            <RadioOption
              key={diff}
              checked={selected === diff}
              onChange={() => onChange(diff)}
              label={config.label}
              description={config.description}
            >
              <div className="mt-2 text-xs space-y-1 text-gray-400">
                <div>Starting: ${(config.startingBudget / 1e6).toFixed(0)}M</div>
                {config.incomeAmount > 0 ? (
                  <div>Income: +${(config.incomeAmount / 1e6).toFixed(0)}M every {config.incomeInterval} turns</div>
                ) : config.drainAmount > 0 ? (
                  <div className="text-red-400">Drain: -${(config.drainAmount / 1e6).toFixed(0)}M per turn</div>
                ) : (
                  <div>Income: None</div>
                )}
              </div>
            </RadioOption>
          );
        })}
      </div>
    </div>
  );
}
