import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWatchlist } from '../../context/WatchlistContext';

/** Concerts / Sports / Arts / Family / Festivals style card */
export default function CategoryCard({ event }) {
  const { isWatched, toggle } = useWatchlist();
  const watched = isWatched(event.id);
  const countLabel =
    event.eventCount === 1
      ? '1 event near you'
      : `${event.eventCount} events near you`;

  return (
    <div className="w-[46vw] max-w-[210px] shrink-0 overflow-hidden rounded-[4px] border border-[#303030] bg-[#242424] sm:w-[190px] md:w-[210px] lg:w-[230px]">
      <Link to={`/event/${event.slug}`} className="block">
        <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#171717]">
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <button
            type="button"
            aria-label={watched ? 'Remove from watchlist' : 'Add to watchlist'}
            className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center bg-black/60 text-white"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle(event.id);
            }}
          >
            <Heart
              className={`h-[15px] w-[15px] ${
                watched ? 'fill-[#075BE8] text-[#075BE8]' : ''
              }`}
              strokeWidth={2}
            />
          </button>
        </div>

        <div className="px-2.5 py-2.5">
          <h3 className="line-clamp-2 text-[13px] font-bold uppercase leading-snug text-white">
            {event.title}
          </h3>
          <p className="mt-1 text-[12px] text-[#A0A0A0]">{countLabel}</p>
        </div>
      </Link>
    </div>
  );
}
