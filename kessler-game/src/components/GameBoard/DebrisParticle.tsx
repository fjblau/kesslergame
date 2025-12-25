import type { Debris } from '../../game/types';

interface DebrisParticleProps {
  debris: Debris;
  x: number;
  y: number;
}

export function DebrisParticle({ debris, x, y }: DebrisParticleProps) {
  const isCooperative = debris.type === 'cooperative';
  const color = isCooperative ? '#9ca3af' : '#ef4444';
  const symbol = isCooperative ? '•' : '••';
  
  return (
    <div
      className="absolute text-xs"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        color,
        fontSize: '12px',
      }}
      title={`${debris.type} Debris (${debris.layer})`}
    >
      {symbol}
    </div>
  );
}
