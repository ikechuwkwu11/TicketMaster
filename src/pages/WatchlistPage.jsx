import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';

export default function WatchlistPage() {
  const { items, toggle } = useWatchlist();

  return (
    <div className="px-4 py-4 md:px-6 lg:px-8">
      <h1 className="mb-5 text-xl font-bold text-white">Watchlist</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Heart className="mb-3 h-10 w-10 text-[#303030]" />
          <p className="text-[#A0A0A0]">No saved events yet.</p>
          <p className="mt-1 text-sm text-[#A0A0A0]">
            Tap the heart on any artist or event to save it here.
          </p>
          <Link
            to="/"
            className="mt-6 rounded-md bg-[#075BE8] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((event) => (
            <li
              key={event.id}
              className="flex overflow-hidden rounded-[6px] border border-[#303030] bg-[#242424]"
            >
              <Link
                to={`/event/${event.slug}`}
                className="flex min-w-0 flex-1 items-center gap-3"
              >
                <img
                  src={event.image}
                  alt=""
                  className="h-20 w-24 shrink-0 object-cover"
                />
                <div className="min-w-0 py-2 pr-2">
                  <h3 className="truncate text-sm font-bold uppercase text-white">
                    {event.title}
                  </h3>
                  <p className="mt-0.5 truncate text-xs text-[#A0A0A0]">
                    {event.dateLabel ||
                      event.location ||
                      (event.eventCount != null
                        ? `${event.eventCount} events near you`
                        : '')}
                  </p>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => toggle(event.id)}
                className="px-4 text-[#075BE8]"
                aria-label="Remove from watchlist"
              >
                <Heart className="h-5 w-5 fill-[#075BE8]" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
