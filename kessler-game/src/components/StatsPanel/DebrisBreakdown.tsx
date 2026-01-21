interface DebrisBreakdownProps {
  cooperative: number;
  uncooperative: number;
  total: number;
}

export function DebrisBreakdown({ cooperative, uncooperative, total }: DebrisBreakdownProps) {
  const cooperativePercent = total > 0 ? Math.round((cooperative / total) * 100) : 0;
  const uncooperativePercent = total > 0 ? Math.round((uncooperative / total) * 100) : 0;

  return (
    <div className="mt-4 p-4 bg-slate-900/50 border-none border border-deep-space-50">
      <div className="text-lg font-semibold text-yellow-400 mb-3">
        Total Debris: {total}
      </div>
      <div className="ml-4 space-y-2 text-base">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">
            <span className="text-gray-600">├─ </span>Cooperative:
          </span>
          <span className="text-white font-semibold">
            {cooperative} ({cooperativePercent}%)
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">
            <span className="text-gray-600">└─ </span>Uncooperative:
          </span>
          <span className="text-white font-semibold">
            {uncooperative} ({uncooperativePercent}%)
          </span>
        </div>
      </div>
    </div>
  );
}
