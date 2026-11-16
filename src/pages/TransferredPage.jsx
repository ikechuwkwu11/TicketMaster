import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Check, Ticket } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';

export default function TransferredPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getTicketBySlug } = useCatalog();
  const ticket = getTicketBySlug(slug);
  const transfer = location.state ?? {};

  const count = transfer.count ?? 1;
  const ticketWord = count === 1 ? 'Ticket' : 'Tickets';
  const recipientName = [transfer.firstName, transfer.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();
  const contact = transfer.email || transfer.mobile || '';

  if (!ticket) {
    return (
      <div className="bg-white px-4 py-16 text-center text-black">
        <p className="text-[#6B6B6B]">Ticket order not found.</p>
        <Link to="/my-tickets" className="mt-4 inline-block text-[#075BE8]">
          Back to My Tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-white text-black">
      <header className="flex items-center justify-center border-b border-[#E8E8E8] px-4 py-3.5">
        <h1 className="text-[16px] font-extrabold uppercase tracking-wide text-black">
          Transferred
        </h1>
      </header>

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center px-6 pb-10 pt-12 text-center">
        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#E8F2FF]">
          <Check className="h-9 w-9 text-[#0046BE]" strokeWidth={2.75} />
        </div>

        <h2 className="mt-6 text-[22px] font-extrabold leading-tight text-black">
          {count} {ticketWord} Transferred
        </h2>
        <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-[#5A5A5A]">
          {recipientName
            ? `Your transfer to ${recipientName} is on its way.`
            : 'Your transfer is on its way.'}
          {contact ? (
            <>
              {' '}
              We&apos;ll notify them at{' '}
              <span className="font-semibold text-black">{contact}</span>.
            </>
          ) : null}
        </p>

        <div className="mt-8 w-full overflow-hidden rounded-xl border border-[#E0E0E0] bg-[#F7F7F7] text-left">
          <div className="flex gap-3 p-4">
            <img
              src={ticket.image}
              alt=""
              className="h-[72px] w-[56px] shrink-0 rounded-md object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold leading-snug text-black">
                {ticket.displayTitle || ticket.title}
              </p>
              <p className="mt-1 text-[12px] text-[#6B6B6B]">
                {ticket.dateLabel}
              </p>
              <p className="mt-0.5 truncate text-[12px] text-[#6B6B6B]">
                {ticket.venueShort || ticket.venue}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-[#E0E0E0] px-4 py-3">
            <Ticket className="h-4 w-4 text-[#0046BE]" strokeWidth={2.25} />
            <p className="text-[13px] font-semibold text-black">
              {count} {ticketWord.toLowerCase()} sent
              {recipientName ? ` to ${recipientName}` : ''}
            </p>
          </div>
        </div>

        <div className="mt-auto w-full pt-10">
          <button
            type="button"
            onClick={() => navigate(`/my-tickets/${slug}`)}
            className="w-full rounded-md bg-[#1A1A1A] py-3.5 text-[15px] font-bold text-white"
          >
            Done
          </button>
          <Link
            to="/my-tickets"
            className="mt-3 block w-full py-3 text-center text-[14px] font-bold text-[#0046BE]"
          >
            Back to My Tickets
          </Link>
        </div>
      </div>
    </div>
  );
}
