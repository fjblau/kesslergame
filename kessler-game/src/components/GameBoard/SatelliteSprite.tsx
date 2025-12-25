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
      className="absolute text-blue-400"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
      }}
      title={`${satellite.purpose} Satellite (${satellite.layer})`}
    >
      {icon}
    </div>
  );
}
