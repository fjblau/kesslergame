interface BudgetGaugeProps {
  budget: number;
  maxBudget?: number;
}

export function BudgetGauge({ budget, maxBudget = 200_000_000 }: BudgetGaugeProps) {
  const percentage = Math.min((budget / maxBudget) * 100, 100);
  
  const getColorClass = () => {
    if (budget >= 50_000_000) return 'bg-green-500';
    if (budget >= 20_000_000) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-1">
      <div className="w-full h-6 bg-slate-700 border-2 border-slate-600 overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${getColorClass()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
