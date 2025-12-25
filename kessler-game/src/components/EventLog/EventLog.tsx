import { useAppSelector } from '../../store/hooks';
import { selectAllEvents } from '../../store/slices/eventSlice';
import { EventItem } from './EventItem';

export function EventLog() {
  const events = useAppSelector(selectAllEvents);
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-blue-300 mb-5 pb-3 border-b-2 border-slate-700 uppercase tracking-wide">
          Event Log
        </h2>
        <div className="max-h-[600px] overflow-y-auto space-y-3 pr-2">
          {events.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              No events yet. Start playing to see game events here!
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
