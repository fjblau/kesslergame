import { useAppSelector } from '../../store/hooks';
import { selectAllEvents } from '../../store/slices/eventSlice';
import { EventItem } from './EventItem';

export function EventLog() {
  const events = useAppSelector(selectAllEvents);
  
  return (
    <div className="bg-deep-space-300 border-4 border-cyber-cyan-800 p-4 flex flex-col h-[530px] shadow-depth-lg relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, transparent 40%, rgba(0,217,255,0.05) 100%)',
      }}></div>
      <div className="relative z-10 flex flex-col h-full">
      <h2 className="text-lg font-bold text-cyber-cyan-400 mb-3 pb-2 border-b-2 border-deep-space-50 uppercase tracking-wide">
        Event Log
      </h2>
      <div className="overflow-y-auto space-y-2 pr-2">
        {events.length === 0 ? (
          <div className="text-center text-gray-400 py-8 text-sm">
            No events yet
          </div>
        ) : (
          events.map(event => (
            <EventItem key={event.id} event={event} />
          ))
        )}
      </div>
      </div>
    </div>
  );
}
