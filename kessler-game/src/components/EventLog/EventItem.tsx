import type { GameEvent } from '../../game/types';

interface EventItemProps {
  event: GameEvent;
}

const eventColorMap = {
  'satellite-launch': { border: 'border-green-500', bg: 'bg-green-500/10', text: 'text-green-400' },
  'drv-launch': { border: 'border-green-500', bg: 'bg-green-500/10', text: 'text-green-400' },
  'collision': { border: 'border-red-500', bg: 'bg-red-500/10', text: 'text-red-400' },
  'debris-removal': { border: 'border-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-400' },
  'mission-complete': { border: 'border-yellow-400', bg: 'bg-yellow-400/10', text: 'text-yellow-400' },
  'drv-expired': { border: 'border-gray-500', bg: 'bg-gray-500/10', text: 'text-gray-400' },
  'solar-storm': { border: 'border-orange-500', bg: 'bg-orange-500/10', text: 'text-orange-400' },
};

function formatTimestamp(timestamp: number): string {
  const hours = Math.floor(timestamp / 3600000);
  const minutes = Math.floor((timestamp % 3600000) / 60000);
  const seconds = Math.floor((timestamp % 60000) / 1000);
  const milliseconds = timestamp % 1000;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
}

export function EventItem({ event }: EventItemProps) {
  const colors = eventColorMap[event.type];
  
  return (
    <div className={`${colors.bg} border-l-4 ${colors.border} rounded-lg pl-[10px] pr-[5px] py-[5px] transition-all hover:translate-x-1`}>
      <div className="flex items-start gap-3">
        <div className={`text-xs font-mono ${colors.text} font-semibold min-w-[110px]`}>
          Day {event.day} • {formatTimestamp(event.timestamp)}
        </div>
        <div className="text-sm text-gray-300 flex-1">
          {event.message}
        </div>
      </div>
    </div>
  );
}
