import { motion } from 'framer-motion';
import type { DebrisRemovalVehicle } from '../../game/types';

interface DRVSpriteProps {
  drv: DebrisRemovalVehicle;
  x: number;
  y: number;
}

export function DRVSprite({ drv, x, y }: DRVSpriteProps) {
  const isCooperative = drv.removalType === 'cooperative';
  const color = isCooperative ? '#34d399' : '#fb923c';
  const rotation = (drv.x / 100) * 360;
  
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        color,
        fontSize: '20px',
      }}
      animate={{
        x: '-50%',
        y: '-50%',
        rotate: rotation,
      }}
      transition={{
        rotate: { duration: 0.5, ease: 'linear' },
        x: { duration: 0 },
        y: { duration: 0 },
      }}
      title={`${drv.removalType} DRV (${drv.layer})`}
    >
      ⬟
    </motion.div>
  );
}
