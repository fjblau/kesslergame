import type { Satellite } from '../../game/types';
import { SATELLITE_PURPOSE_CONFIG } from '../../game/constants';

interface SatelliteSpriteProps {
  satellite: Satellite;
  x: number;
  y: number;
}

export function SatelliteSprite({ satellite, x, y }: SatelliteSpriteProps) {
  const icon = SATELLITE_PURPOSE_CONFIG[satellite.purpose].icon;
  
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        color: '#60a5fa',
        fontSize: '20px',
      }}
      title={`${satellite.purpose} Satellite (${satellite.layer})`}
    >
      {icon}
    </div>
  );
}
