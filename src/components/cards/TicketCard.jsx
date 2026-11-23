import { Link } from 'react-router-dom';
import { Ticket } from 'lucide-react';

export default function TicketCard({ ticket }) {
  return (
    <Link
      to={`/my-tickets/${ticket.slug}`}
      className="block overflow-hidden bg-[#242424]"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#171717]">
        <img
          src={ticket.image}
          alt={ticket.title}
          className="h-full w-full bg-[#111] object-contain object-center"
          loading="lazy"
        />
        {/* Date badge — flush bottom-left, sharp corners like reference */}
        <span className="absolute bottom-0 left-0 bg-[#111111] px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white">
          {ticket.dateLabel}
        </span>
      </div>

      <div className="px-4 pb-4 pt-3.5">
        <h2 className="text-[15px] font-extrabold uppercase leading-snug tracking-wide text-white sm:text-[16px]">
          {ticket.title}
        </h2>

        {/* Thick white divider matching Ticketmaster My Events cards */}
        <div className="my-3.5 h-[6px] w-full bg-white" />

        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 flex-1 text-[13px] leading-snug text-[#C8C8C8]">
            {ticket.venue}
          </p>
          <span className="flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-white">
            <Ticket className="h-3.5 w-3.5" strokeWidth={2.25} />
            <span>x{ticket.quantity}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
