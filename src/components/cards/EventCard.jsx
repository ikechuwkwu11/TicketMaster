import { Link } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';

/** Last Minute / Popular This Weekend style card */
export default function EventCard({ event }) {
  return (
    <Link
      to={`/event/${event.slug}`}
      className="w-[46vw] max-w-[210px] shrink-0 overflow-hidden rounded-[4px] border border-[#303030] bg-[#242424] sm:w-[190px] md:w-[210px] lg:w-[230px]"
    >
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#171717]">
        <img
          src={event.image}
          alt={event.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <span className="absolute bottom-2 left-2 rounded-[3px] bg-black/90 px-2 py-[3px] text-[11px] font-medium leading-none text-white">
          {event.dateLabel}
        </span>
      </div>

      <div className="px-2.5 py-2.5">
        <div className="flex items-start justify-between gap-1">
          <h3 className="line-clamp-2 min-w-0 flex-1 text-[13px] font-bold uppercase leading-snug text-white">
            {event.title}
          </h3>
          <button
            type="button"
            aria-label="More options"
            className="mt-0.5 shrink-0 text-[#A0A0A0] hover:text-white"
            onClick={(e) => e.preventDefault()}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 truncate text-[12px] text-[#A0A0A0]">
          {event.time} • {event.venue}
        </p>
      </div>
    </Link>
  );
}
