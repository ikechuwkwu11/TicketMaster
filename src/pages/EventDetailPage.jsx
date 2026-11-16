import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Heart, MapPin, Calendar, Clock, Ticket } from 'lucide-react';
import { getEventBySlug } from '../data/events';
import { getTicketBySlug } from '../data/tickets';
import { useWatchlist } from '../context/WatchlistContext';

function getBySlug(slug) {
  return getEventBySlug(slug) || getTicketBySlug(slug);
}

export default function EventDetailPage() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const event = getBySlug(slug);
  const { isWatched, toggle } = useWatchlist();
  const showPresale = params.get('presale') === '1';

  if (!event) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-[#A0A0A0]">Event not found.</p>
        <Link to="/" className="mt-4 inline-block text-[#075BE8]">
          Back to Home
        </Link>
      </div>
    );
  }

  const watched = isWatched(event.id);

  return (
    <div>
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="h-56 w-full object-cover md:h-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-black/40" />
        <Link
          to="/"
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <button
          type="button"
          onClick={() => toggle(event.id)}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white"
          aria-label={watched ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          <Heart
            className={`h-5 w-5 ${watched ? 'fill-[#075BE8] text-[#075BE8]' : ''}`}
          />
        </button>
      </div>

      <div className="px-4 py-5 md:px-6 lg:px-8">
        <h1 className="text-2xl font-extrabold uppercase tracking-wide text-white md:text-3xl">
          {event.title}
        </h1>

        {showPresale && (
          <p className="mt-2 inline-block rounded bg-[#075BE8]/20 px-2 py-1 text-xs font-semibold text-[#075BE8]">
            Presale available
          </p>
        )}

        <div className="mt-5 space-y-3 text-sm text-[#A0A0A0]">
          {(event.dateLabel || event.weekday) && (
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#075BE8]" />
              {event.dateLabel ||
                `${event.weekday}, ${event.month} ${event.day}, ${event.year}`}
            </p>
          )}
          {event.time && (
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#075BE8]" />
              {event.time}
            </p>
          )}
          {(event.venue || event.location) && (
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#075BE8]" />
              {event.venue || event.location}
              {event.location && event.venue && event.venue !== event.location
                ? ` • ${event.location}`
                : ''}
            </p>
          )}
          {event.eventCount != null && (
            <p className="text-white">
              {event.eventCount}{' '}
              {event.eventCount === 1 ? 'event' : 'events'} near you
            </p>
          )}
          {event.quantity != null && (
            <p className="flex items-center gap-2 text-white">
              <Ticket className="h-4 w-4 text-[#075BE8]" />
              {event.quantity}{' '}
              {event.quantity === 1 ? 'ticket' : 'tickets'} in your account
            </p>
          )}
        </div>

        <p className="mt-6 text-sm leading-relaxed text-[#A0A0A0]">
          Experience {event.title} live. Secure your seats now — official
          tickets with verified entry. Ready for Django REST Framework
          integration for live inventory and checkout.
        </p>

        <button
          type="button"
          className="mt-8 w-full rounded-md bg-[#075BE8] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#064bc2] md:max-w-sm"
        >
          {event.quantity != null ? 'View Tickets' : 'Find Tickets'}
        </button>
      </div>
    </div>
  );
}
