import { motion } from 'framer-motion';
import { useEffect } from 'react';
import type { OrbitLayer } from '../../game/types';

interface LaunchAnimationProps {
  targetLayer: OrbitLayer;
  targetAngle: number;
  onComplete: () => void;
}

const ORBIT_RADII = {
  LEO: 132.5,
  MEO: 248.5,
  GEO: 321,
};

const LAYER_COLORS = {
  LEO: '#3b82f6',
  MEO: '#10b981',
  GEO: '#f59e0b',
};

export function LaunchAnimation({ targetLayer, targetAngle, onComplete }: LaunchAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const centerX = 400;
  const centerY = 400;
  
  const targetRadius = ORBIT_RADII[targetLayer];
  if (!targetRadius || typeof targetAngle !== 'number' || isNaN(targetAngle)) {
    useEffect(() => {
      onComplete();
    }, [onComplete]);
    return null;
  }
  
  const targetX = centerX + Math.cos(targetAngle) * targetRadius;
  const targetY = centerY + Math.sin(targetAngle) * targetRadius;

  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '800px',
        height: '800px',
        pointerEvents: 'none',
      }}
    >
      <motion.line
        x1={centerX}
        y1={centerY + 30}
        initial={{
          x2: centerX,
          y2: centerY + 30,
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
