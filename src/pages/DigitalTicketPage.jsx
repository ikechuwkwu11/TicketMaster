import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Info, X } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import AdmissionTicketCard from '../components/tickets/AdmissionTicketCard';
import AppleWalletButton from '../components/tickets/AppleWalletButton';

export default function DigitalTicketPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getTicketBySlug } = useCatalog();
  const ticket = getTicketBySlug(slug);
  const scrollerRef = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;

    const onScroll = () => {
      const cards = el.querySelectorAll('[data-ticket-card]');
      if (!cards.length) return;
      const mid = el.scrollLeft + el.clientWidth / 2;
      let closest = 0;
      let best = Infinity;
      cards.forEach((card, i) => {
        const center = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(center - mid);
        if (dist < best) {
          best = dist;
          closest = i;
        }
      });
      setIndex(closest);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [ticket]);

  if (!ticket) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] px-4 py-16 text-center text-black">
        <p className="text-[#6B6B6B]">Tickets not found.</p>
        <Link to="/my-tickets" className="mt-4 inline-block text-[#075BE8]">
          Back to My Tickets
        </Link>
      </div>
    );
  }

  const seats = ticket.seats || [];
  const backTo = `/my-tickets/${ticket.slug}`;
  const meta = `${ticket.dateLabel} • ${ticket.venueShort || ticket.venue}`;

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5] text-black">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[#EAEAEA] bg-white px-3 pb-3 pt-3">
        <div className="relative flex items-start">
          <Link
            to={backTo}
            className="mt-0.5 flex h-9 w-9 items-center justify-center text-black"
            aria-label="Back"
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={1.75} />
          </Link>

          <div className="min-w-0 flex-1 px-2 text-center">
            <h1 className="truncate text-[13px] font-extrabold uppercase tracking-wide text-black">
              {ticket.title}
            </h1>
            <p className="mt-0.5 truncate text-[11px] font-medium uppercase tracking-wide text-[#6B6B6B]">
              {meta}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(backTo)}
            className="mt-0.5 flex h-9 w-9 items-center justify-center text-black"
            aria-label="Close"
          >
            <X className="h-6 w-6" strokeWidth={1.75} />
          </button>
        </div>
      </header>

      {/* Horizontal ticket carousel */}
      <div className="flex flex-1 flex-col pt-4">
        <div
          ref={scrollerRef}
          className="hide-scrollbar scroll-touch flex snap-x snap-mandatory gap-3 overflow-x-auto px-[7.5%] pb-3"
        >
          {seats.map((seat) => (
            <div
              key={seat.id}
              data-ticket-card
              className="w-[85%] max-w-[340px] shrink-0 snap-center"
            >
              <AdmissionTicketCard ticket={ticket} seat={seat} />
            </div>
          ))}
        </div>

        <p className="py-3 text-center text-[14px] font-medium text-[#333]">
          {index + 1} of {seats.length}
        </p>
      </div>

      {/* Bottom actions */}
      <div className="sticky bottom-0 border-t border-[#EAEAEA] bg-[#F5F5F5] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <AppleWalletButton />
          <button
            type="button"
            onClick={() => {
              const seat = seats[index];
              const q = seat?.id ? `?seat=${encodeURIComponent(seat.id)}` : '';
              navigate(`/my-tickets/${ticket.slug}/details${q}`);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-black bg-white px-4 py-2.5 text-[13px] font-semibold text-black"
          >
            <Info className="h-4 w-4" strokeWidth={2.25} />
            Ticket Info
          </button>
        </div>
      </div>
    </div>
  );
}
