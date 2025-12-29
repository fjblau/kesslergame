interface BudgetGaugeProps {
  budget: number;
  maxBudget?: number;
}

export function BudgetGauge({ budget, maxBudget = 200_000_000 }: BudgetGaugeProps) {
  const percentage = Math.min((budget / maxBudget) * 100, 100);
  
  const getColorClass = () => {
    if (budget >= 50_000_000) return 'bg-green-400';
    if (budget >= 20_000_000) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <div className="space-y-1">
      <div className="w-full h-[34px] bg-slate-700 border border-blue-500 relative flex items-center justify-center">
        <div 
          className={`h-full transition-all duration-300 ${getColorClass()} absolute left-0 top-0`}
          style={{ width: `${percentage}%` }}
        />
        {[16.67, 33.33, 50, 66.67, 83.33].map((pos, i) => (
          <div
            key={i}
            className="absolute top-0 h-full w-px bg-slate-900 z-[5]"
            style={{ left: `${pos}%` }}
          />
        ))}
        <span className="relative z-10 text-sm font-medium text-black">BUDGET REMAINING</span>
      </div>
    </div>
  );
}
