import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TurnHistory } from '../../game/types';

interface ChartProps {
  data: TurnHistory[];
}

export function DebrisChart({ data }: ChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-blue-300 mb-4">
          Debris Count
        </h2>
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          No data yet. Start playing to see metrics.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-blue-300 mb-4">
        Debris Count
      </h2>
      <div role="img" aria-label="Debris count over time chart">
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
              label={{ value: 'Count', angle: -90, position: 'insideLeft', fill: '#888' }}
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
              dataKey="debrisCount" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ fill: '#ef4444', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
