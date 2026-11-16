import { Link } from 'react-router-dom';
import { MapPin, MoreVertical } from 'lucide-react';

export default function ForYouCard({ event }) {
  const accentClass =
    event.accent === 'orange' ? 'bg-[#E58B35]' : 'bg-[#075BE8]';

  return (
    <Link
      to={`/event/${event.slug}`}
      className="relative w-[85vw] max-w-[360px] shrink-0 overflow-hidden rounded-[4px] border border-[#303030] bg-[#242424] sm:w-[320px] md:w-[340px] lg:w-[380px]"
    >
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#171717]">
        <img
          src={event.image}
          alt={event.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-3.5 pb-3 pt-12">
          <h3 className="text-[18px] font-extrabold uppercase tracking-wide text-white">
            {event.title}
          </h3>
        </div>
      </div>

      <div className="flex items-start gap-3 px-3 py-3">
        <div className="flex w-9 shrink-0 flex-col items-center pt-0.5">
          <span className="text-[10px] font-semibold uppercase leading-none tracking-wider text-[#A0A0A0]">
            {event.month}
          </span>
          <span className="mt-1 text-[22px] font-bold leading-none text-white">
            {event.day}
          </span>
          <span className={`mt-1.5 h-[2.5px] w-7 ${accentClass}`} />
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <p className="truncate text-[13px] font-medium text-white">
            {event.weekday} • {event.time} • {event.year}
          </p>
          <p className="mt-1.5 flex items-center gap-1 truncate text-[12px] text-[#A0A0A0]">
            <MapPin
              className="h-3 w-3 shrink-0 text-[#3DB8D6]"
              strokeWidth={2.5}
            />
            <span className="truncate">{event.location}</span>
          </p>
        </div>

        <button
          type="button"
          aria-label="More options"
          className="mt-1 shrink-0 p-0.5 text-[#A0A0A0] hover:text-white"
          onClick={(e) => e.preventDefault()}
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </Link>
  );
}
