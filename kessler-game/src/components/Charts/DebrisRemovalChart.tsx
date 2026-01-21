import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TurnHistory } from '../../game/types';

interface ChartProps {
  data: TurnHistory[];
}

export function DebrisRemovalChart({ data }: ChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-deep-space-300 border border-deep-space-50 border-none p-6">
        <h2 className="text-lg font-semibold text-cyber-cyan-400 mb-4">
          Debris Removal Over Time
        </h2>
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          No data yet. Start playing to see metrics.
        </div>
      </div>
    );
  }

  const latestData = data[data.length - 1];
  const totalRemoved = latestData.debrisRemoved;
  const activeDRVs = latestData.activeDRVCount;
  const avgPerTurn = latestData.turn > 0 ? (totalRemoved / latestData.turn).toFixed(1) : '0.0';

  return (
    <div className="bg-deep-space-300 border border-deep-space-50 border-none p-6">
      <h2 className="text-lg font-semibold text-cyber-cyan-400 mb-4">
        Debris Removal Over Time
      </h2>
      <div role="img" aria-label="Cumulative debris removed over time chart">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              dataKey="turn" 
              stroke="#888" 
              style={{ fontSize: '12px', fontFamily: 'Calibri, Candara, Segoe UI, Arial, sans-serif' }}
              label={{ value: 'Turn', position: 'insideBottom', offset: -5, fill: '#888' }}
            />
            <YAxis 
              stroke="#888" 
              style={{ fontSize: '12px', fontFamily: 'Calibri, Candara, Segoe UI, Arial, sans-serif' }}
              label={{ value: 'Removed', angle: -90, position: 'insideLeft', fill: '#888' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #334155',
                borderRadius: '12px',
                fontFamily: 'Calibri, Candara, Segoe UI, Arial, sans-serif'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="debrisRemoved" 
              stroke="#4ade80" 
              strokeWidth={2}
              dot={{ fill: '#4ade80', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-around mt-6 pt-6 border-t border-deep-space-50">
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-2">Total Removed</div>
          <div className="text-2xl font-bold text-green-400">{totalRemoved}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-2">Active DRVs</div>
          <div className="text-2xl font-bold text-green-400">{activeDRVs}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-2">Avg. per Turn</div>
          <div className="text-2xl font-bold text-green-400">{avgPerTurn}</div>
        </div>
      </div>
    </div>
  );
}
