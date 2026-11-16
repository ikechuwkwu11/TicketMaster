import { Link } from 'react-router-dom';
import { ChevronRight, MoreVertical } from 'lucide-react';

export default function JustAnnouncedCard({ event }) {
  return (
    <div className="w-[80vw] max-w-[340px] shrink-0 overflow-hidden rounded-[4px] border border-[#303030] bg-[#242424] sm:w-[300px] md:w-[320px] lg:w-[360px]">
      <Link to={`/event/${event.slug}`} className="block">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#171717]">
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

        <div className="px-3 pt-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-[14px] font-bold uppercase leading-snug text-white">
                {event.title}
              </h3>
              <span className="mt-1.5 block h-[2px] w-14 bg-[#C41E3A]" />
            </div>
            <button
              type="button"
              aria-label="More options"
              className="mt-0.5 shrink-0 text-[#A0A0A0] hover:text-white"
              onClick={(e) => e.preventDefault()}
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-2 text-[12px] text-[#A0A0A0]">
            {event.time} • {event.venue || event.location}
          </p>
        </div>
      </Link>

      {event.hasPresale && (
        <Link
          to={`/event/${event.slug}?presale=1`}
          className="mt-3 flex items-center justify-between border-t border-[#303030] px-3 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#2a2a2a]"
        >
          <span>View Presales</span>
          <span className="flex items-center border-l border-[#303030] pl-3">
            <ChevronRight className="h-4 w-4 text-[#A0A0A0]" />
          </span>
        </Link>
      )}
    </div>
  );
}
