import { motion } from 'framer-motion';
import { useEffect } from 'react';
import type { OrbitLayer } from '../../game/types';
import { playRocketLaunch } from '../../utils/audio';

interface LaunchAnimationProps {
  targetLayer: OrbitLayer;
  targetAngle: number;
  onComplete: () => void;
}

const ORBIT_RADII = {
  LEO: 256,
  MEO: 365,
  GEO: 437.5,
};

const LAYER_COLORS = {
  LEO: '#3b82f6',
  MEO: '#10b981',
  GEO: '#f59e0b',
};

export function LaunchAnimation({ targetLayer, targetAngle, onComplete }: LaunchAnimationProps) {
  const centerX = 500;
  const centerY = 500;
  
  const targetRadius = ORBIT_RADII[targetLayer] || 140;
  const safeAngle = (typeof targetAngle === 'number' && !isNaN(targetAngle)) ? targetAngle : 0;
  const targetX = centerX + Math.cos(safeAngle) * targetRadius;
  const targetY = centerY + Math.sin(safeAngle) * targetRadius;

  useEffect(() => {
    playRocketLaunch();
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!targetRadius || typeof targetAngle !== 'number' || isNaN(targetAngle)) {
    return null;
  }

  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '1000px',
        height: '1000px',
        pointerEvents: 'none',
      }}
    >
      <motion.line
        x1={centerX}
        y1={centerY + 62.5}
        initial={{
          x2: centerX,
          y2: centerY + 62.5,
        }}
        animate={{
          x2: targetX,
          y2: targetY,
          opacity: [0.5, 0.5, 0],
        }}
        transition={{
          duration: 1.5,
          ease: [0.33, 1, 0.68, 1],
          opacity: { times: [0, 0.7, 1] },
        }}
        stroke={LAYER_COLORS[targetLayer]}
        strokeWidth="1"
        strokeDasharray="5,5"
      />
    </svg>
  );
}
