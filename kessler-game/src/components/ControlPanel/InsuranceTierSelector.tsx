import type { InsuranceTier } from '../../game/types';
import { INSURANCE_CONFIG } from '../../game/constants';
import { RadioOption } from '../ui/RadioOption';

interface InsuranceTierSelectorProps {
  selected: InsuranceTier;
  onChange: (tier: InsuranceTier) => void;
}

export function InsuranceTierSelector({ selected, onChange }: InsuranceTierSelectorProps) {
  const tiers: InsuranceTier[] = ['none', 'basic', 'premium'];

  return (
    <div className="space-y-2">
      <label className="text-base font-medium text-gray-300">Insurance Coverage</label>
      <div className="space-y-2">
        {tiers.map((tier) => {
          const config = INSURANCE_CONFIG[tier];
          const label = tier.charAt(0).toUpperCase() + tier.slice(1);
          const costStr = `$${(config.cost / 1e6).toFixed(1)}M`;
          const payoutStr = config.payout > 0 
            ? ` → Pays $${(config.payout / 1e6).toFixed(1)}M on collision`
            : '';

          return (
            <RadioOption
              key={tier}
              checked={selected === tier}
              onChange={() => onChange(tier)}
              label={`${label} (${costStr})`}
              description={config.payout > 0 ? `Payout: ${payoutStr}` : 'No coverage'}
            />
          );
        })}
      </div>
    </div>
  );
}
