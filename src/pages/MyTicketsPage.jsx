import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket } from 'lucide-react';
import TicketCard from '../components/cards/TicketCard';
import { upcomingTickets, pastTickets } from '../data/tickets';

function UsFlag() {
  return (
    <span
      className="inline-flex h-5 w-5 overflow-hidden rounded-full border border-[#505050] shadow-sm"
      aria-label="United States"
      title="United States"
    >
      <svg viewBox="0 0 19 10" className="h-full w-full" aria-hidden>
        <rect width="19" height="10" fill="#B22234" />
        <rect y="1" width="19" height="1" fill="#fff" />
        <rect y="3" width="19" height="1" fill="#fff" />
        <rect y="5" width="19" height="1" fill="#fff" />
        <rect y="7" width="19" height="1" fill="#fff" />
        <rect y="9" width="19" height="1" fill="#fff" />
        <rect width="8" height="5.5" fill="#3C3B6E" />
      </svg>
    </span>
  );
}

export default function MyTicketsPage() {
  const [tab, setTab] = useState('upcoming');
  const tickets = tab === 'upcoming' ? upcomingTickets : pastTickets;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#111111] md:-mx-6 lg:-mx-8">
      {/* Header — matches screenshot: My Events + flag + Help */}
      <header className="sticky top-0 z-30 border-b border-[#222] bg-[#111111] md:static">
        <div className="relative flex h-12 items-center justify-center px-4">
          <div className="flex items-center gap-2">
            <h1 className="text-[17px] font-semibold text-white">My Events</h1>
            <UsFlag />
          </div>
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] font-medium text-white"
          >
            Help
          </button>
        </div>

        {/* UPCOMING / PAST tabs */}
        <div className="grid grid-cols-2">
          <button
            type="button"
            onClick={() => setTab('upcoming')}
            className={`relative py-3.5 text-[13px] font-bold uppercase tracking-wide ${
              tab === 'upcoming' ? 'text-white' : 'text-[#6B6B6B]'
            }`}
          >
            Upcoming ({upcomingTickets.length})
            {tab === 'upcoming' && (
              <span className="absolute inset-x-0 bottom-0 h-[3px] bg-white" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setTab('past')}
            className={`relative py-3.5 text-[13px] font-bold uppercase tracking-wide ${
              tab === 'past' ? 'text-white' : 'text-[#6B6B6B]'
            }`}
          >
            Past ({pastTickets.length})
            {tab === 'past' && (
              <span className="absolute inset-x-0 bottom-0 h-[3px] bg-white" />
            )}
          </button>
        </div>
      </header>

      {/* Ticket list — full-bleed cards with slim gaps like the reference */}
      <div className="mx-auto max-w-2xl space-y-[6px] px-0 pb-4 pt-0 md:space-y-3 md:px-6 md:pt-4 lg:px-8">
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-16 text-center">
            <Ticket className="mb-3 h-10 w-10 text-[#303030]" />
            <p className="text-[#A0A0A0]">
              No {tab === 'upcoming' ? 'upcoming' : 'past'} events.
            </p>
            <Link
              to="/"
              className="mt-6 rounded-md bg-[#075BE8] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Find Events
            </Link>
          </div>
        ) : (
          tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))
        )}
      </div>
    </div>
  );
}
