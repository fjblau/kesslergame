import { useAppSelector } from '../../store/hooks';
import { selectAllEvents } from '../../store/slices/eventSlice';
import { EventItem } from './EventItem';

export function EventLog() {
  const events = useAppSelector(selectAllEvents);
  
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col flex-1">
      <h2 className="text-lg font-bold text-blue-300 mb-3 pb-2 border-b-2 border-slate-700 uppercase tracking-wide">
        Event Log
      </h2>
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
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
  );
}
