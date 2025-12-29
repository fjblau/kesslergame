import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { playSolarFlare } from '../../utils/audio';

interface SolarStormEffectProps {
  onComplete: () => void;
}

export function SolarStormEffect({ onComplete }: SolarStormEffectProps) {
  useEffect(() => {
    playSolarFlare();
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const sunX = 150;
  const sunY = 150;
  const beamCount = 12;
  const beams = Array.from({ length: beamCount }, (_, i) => i);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '1000px',
        height: '1000px',
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [0, 0.5, 0.4, 0],
          scale: [0, 3, 3.5, 4]
        }}
        transition={{
          duration: 2,
          times: [0, 0.2, 0.7, 1],
          ease: 'easeOut',
        }}
        style={{
          position: 'absolute',
          left: sunX,
          top: sunY,
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.8) 0%, rgba(251, 191, 36, 0.4) 40%, rgba(251, 191, 36, 0) 70%)',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <svg
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <defs>
          <radialGradient id="flareGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {beams.map((i) => {
          const baseAngle = (i * Math.PI * 2) / beamCount + Math.PI / 4;
          const cosAngle = Math.cos(baseAngle);
          const sinAngle = Math.sin(baseAngle);
          const length = 800;

          return (
            <motion.g
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.9, 0.7, 0],
              }}
              transition={{
                duration: 2,
                times: [0, 0.15, 0.6, 1],
                delay: i * 0.02,
              }}
            >
              <line
                x1={sunX}
                y1={sunY}
                x2={sunX + cosAngle * length}
                y2={sunY + sinAngle * length}
                stroke="url(#flareGradient)"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </motion.g>
          );
        })}
      </svg>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.15, 0.1, 0] }}
        transition={{
          duration: 2,
          times: [0, 0.3, 0.7, 1],
        }}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(225deg, rgba(251, 191, 36, 0.3) 0%, rgba(251, 191, 36, 0) 50%)',
        }}
      />
    </div>
  );
}
