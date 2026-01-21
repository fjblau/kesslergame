import { useAppSelector } from '../../store/hooks';
import { selectAllEvents } from '../../store/slices/eventSlice';
import { EventItem } from './EventItem';

export function DetailedEventLog() {
  const events = useAppSelector(selectAllEvents);
  
  return (
    <div className="bg-deep-space-300 border border-deep-space-50 border-none p-4 flex flex-col">
      <h2 className="text-lg font-bold text-cyber-cyan-400 mb-3 pb-2 border-b-2 border-deep-space-50 uppercase tracking-wide">
        Detailed Event Log
      </h2>
      <div className="overflow-y-auto space-y-2 pr-2 max-h-[600px]">
        {events.length === 0 ? (
          <div className="text-center text-gray-400 py-8 text-sm">
            No events yet
          </div>
        ) : (
          events.map(event => (
            <EventItem key={event.id} event={event} showDetails={true} />
          ))
        )}
      </div>
    </div>
  );
}
