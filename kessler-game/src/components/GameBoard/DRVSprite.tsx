import type { DebrisRemovalVehicle } from '../../game/types';

interface DRVSpriteProps {
  drv: DebrisRemovalVehicle;
  x: number;
  y: number;
}

export function DRVSprite({ drv, x, y }: DRVSpriteProps) {
  const isCooperative = drv.removalType === 'cooperative';
  const color = isCooperative ? '#34d399' : '#fb923c';
  
  return (
    <div
      className="absolute"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        color,
        fontSize: '20px',
      }}
      title={`${drv.removalType} DRV (${drv.layer})`}
    >
      ⬟
    </div>
  );
}
