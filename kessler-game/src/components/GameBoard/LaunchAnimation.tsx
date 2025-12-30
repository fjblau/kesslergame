import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useAppSelector } from '../../store/hooks';
import type { OrbitLayer } from '../../game/types';
import { playRocketLaunch } from '../../utils/audio';

interface LaunchAnimationProps {
  targetLayer: OrbitLayer;
  targetAngle: number;
  onComplete: () => void;
}

const ORBIT_RADII = {
  LEO: 225,
  MEO: 325,
  GEO: 400,
  GRAVEYARD: 475,
};

const LAYER_COLORS = {
  LEO: '#3b82f6',
  MEO: '#10b981',
  GEO: '#f59e0b',
  GRAVEYARD: '#a855f7',
};

const EARTH_RADIUS = 50;

export function LaunchAnimation({ targetLayer, targetAngle, onComplete }: LaunchAnimationProps) {
  const centerX = 500;
  const centerY = 500;
  const hasPlayedSound = useRef(false);
  const gameOver = useAppSelector(state => state.game.gameOver);
  
  const targetRadius = ORBIT_RADII[targetLayer] || 140;
  const safeAngle = (typeof targetAngle === 'number' && !isNaN(targetAngle)) ? targetAngle : 0;
  
  const startAngle = safeAngle - Math.PI * 2;
  
  const progress = useMotionValue(0);
  const radius = useTransform(progress, [0, 1], [EARTH_RADIUS, targetRadius]);
  const angle = useTransform(progress, [0, 1], [startAngle, safeAngle]);
  
  const x = useTransform(() => centerX + Math.cos(angle.get()) * radius.get());
  const y = useTransform(() => centerY + Math.sin(angle.get()) * radius.get());
  
  const pathD = useTransform(
    () => `M ${centerX} ${centerY + EARTH_RADIUS} L ${x.get()} ${y.get()}`
  );

  useEffect(() => {
    if (!hasPlayedSound.current && !gameOver) {
      hasPlayedSound.current = true;
      playRocketLaunch();
    }
    
    const controls = animate(progress, 1, {
      duration: 4,
      ease: [0.2, 0.8, 0.4, 1],
    });
    
    const timer = setTimeout(onComplete, 4000);
    
    return () => {
      controls.stop();
      clearTimeout(timer);
    };
  }, [onComplete, progress, gameOver]);

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
      <motion.path
        d={pathD}
        stroke={LAYER_COLORS[targetLayer]}
        strokeWidth="1"
        strokeDasharray="5,5"
        fill="none"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 0.5, 0] }}
        transition={{
          duration: 4,
          opacity: { times: [0, 0.85, 1] },
        }}
      />
    </svg>
  );
}
