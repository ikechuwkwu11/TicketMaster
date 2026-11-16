import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { useWatchlist } from '../context/WatchlistContext';

export default function EventsListPage() {
  const { category } = useParams();
  const { getEventsByCategory, categoryLabels } = useCatalog();
  const events = getEventsByCategory(category);
  const title = categoryLabels[category] || 'Events';
  const { isWatched, toggle } = useWatchlist();

  return (
    <div className="px-4 py-4 md:px-6 lg:px-8">
      <div className="mb-5 flex items-center gap-3">
        <Link
          to="/"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#303030] text-white md:hidden"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold text-white">{title}</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {events.map((event) => {
          const watched = isWatched(event.id);
          return (
            <div
              key={event.id}
              className="overflow-hidden rounded-[6px] border border-[#303030] bg-[#242424]"
            >
              <Link to={`/event/${event.slug}`} className="block">
                <div className="relative aspect-[16/11] overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-sm bg-black/55 text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      toggle(event.id);
                    }}
                    aria-label="Toggle watchlist"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        watched ? 'fill-[#075BE8] text-[#075BE8]' : ''
                      }`}
                    />
                  </button>
                </div>
                <div className="p-2.5">
                  <h3 className="line-clamp-2 text-[13px] font-bold uppercase text-white">
                    {event.title}
                  </h3>
                  <p className="mt-1 truncate text-[12px] text-[#A0A0A0]">
                    {event.dateLabel ||
                      (event.time && event.venue
                        ? `${event.time} • ${event.venue}`
                        : null) ||
                      (event.eventCount != null
                        ? `${event.eventCount} events near you`
                        : event.location)}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {events.length === 0 && (
        <p className="py-12 text-center text-[#A0A0A0]">No events found.</p>
      )}
    </div>
  );
}
