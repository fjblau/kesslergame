import { motion } from 'framer-motion';
import type { DebrisRemovalVehicle } from '../../game/types';

interface DRVSpriteProps {
  drv: DebrisRemovalVehicle;
  x: number;
  y: number;
  isLaunching?: boolean;
}

export function DRVSprite({ drv, x, y, isLaunching = false }: DRVSpriteProps) {
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
      initial={isLaunching ? {
        x: '-50%',
        y: '-50%',
        scale: 0.5,
        opacity: 0,
        rotate: 0,
      } : false}
      animate={{
        x: '-50%',
        y: '-50%',
        scale: 1,
        opacity: 1,
        rotate: rotation,
      }}
      transition={{
        rotate: { duration: 0.5, ease: 'linear' },
        x: isLaunching ? { duration: 1.5, ease: [0.33, 1, 0.68, 1] } : { duration: 0 },
        y: isLaunching ? { duration: 1.5, ease: [0.33, 1, 0.68, 1] } : { duration: 0 },
        scale: isLaunching ? { duration: 1.5, ease: [0.33, 1, 0.68, 1] } : { duration: 0 },
        opacity: isLaunching ? { duration: 1.5, ease: [0.33, 1, 0.68, 1] } : { duration: 0 },
      }}
      title={`${drv.removalType} DRV (${drv.layer})`}
    >
      ⬟
    </motion.div>
  );
}
