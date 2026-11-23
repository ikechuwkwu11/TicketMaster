import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';

const DEFAULT_TERMS =
  'Take care of your ticket, as it cannot be replaced if lost, stolen or destroyed, and is valid only for event and seat printed on ticket. This ticket is a revocable license to attend the event listed on the front of the ticket and is subject to the full terms found at www.ticketmaster.com. Such license may be revoked without refund for noncompliance with terms. Unlawful sale or attempted resale is grounds for seizure and cancellation without compensation.';

function DetailBlock({ label, children, last = false }) {
  return (
    <section
      className={`px-4 py-4 ${last ? '' : 'border-b border-[#E5E5E5]'}`}
    >
      <h2 className="text-[15px] font-bold text-black">{label}</h2>
      <div className="mt-1.5 text-[14px] leading-snug text-[#6B6B6B]">
        {children}
      </div>
    </section>
  );
}

function barcodeFor(ticket, seat) {
  if (seat?.barcode) return seat.barcode;
  if (ticket.barcode) return ticket.barcode;
  const seed = String(seat?.seat || '0').padStart(2, '0');
  return `050599047921486161${seed}`;
}

export default function TicketDetailsPage() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { getTicketBySlug } = useCatalog();
  const ticket = getTicketBySlug(slug);

  if (!ticket) {
    return (
      <div className="min-h-screen bg-white px-4 py-16 text-center text-black">
        <p className="text-[#6B6B6B]">Ticket not found.</p>
        <Link to="/my-tickets" className="mt-4 inline-block text-[#075BE8]">
          Back to My Tickets
        </Link>
      </div>
    );
  }

  const seatId = params.get('seat');
  const seats = ticket.seats || [];
  const seat =
    seats.find((s) => s.id === seatId) || seats[0] || {
      section: '—',
      row: '—',
      seat: '—',
      type: 'Verified Fan Presale',
    };

  const displayTitle =
    ticket.displayTitle || ticket.title || 'Ticket';
  const seatLocation = `SEC ${seat.section} / ROW ${seat.row} / SEAT ${seat.seat}`;
  const eventLine = `${ticket.dateLabel} • ${ticket.venueShort || ticket.venue}`;
  const entryInfo = ticket.entryInfo || 'Mobile Ticket';
  const ticketInfoNote =
    ticket.ticketInfoNote || 'NO PROF CAMS VID/AUD REC';
  const city = ticket.city || '';
  const entrance =
    ticket.entrance ||
    (seat.section ? `BLOCK ${seat.section}` : '—');
  const purchaseDate =
    ticket.purchaseDate || 'SUN, NOV 1, 2026 • 2:16 PM';
  const faceValue = ticket.faceValue || '200.00';
  const grandTotal = ticket.grandTotal || '216.44';
  const terms = ticket.terms || DEFAULT_TERMS;
  const ticketType = seat.type || ticket.ticketType || 'Verified Fan Presale';
  const closeTo = `/my-tickets/${ticket.slug}/admission`;

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="sticky top-0 z-20 flex items-center justify-between bg-black px-3 py-3.5 text-white">
        <button
          type="button"
          onClick={() => navigate(closeTo)}
          className="flex h-9 w-9 items-center justify-center"
          aria-label="Close"
        >
          <X className="h-6 w-6" strokeWidth={1.75} />
        </button>
        <h1 className="text-[16px] font-semibold">Ticket Details</h1>
        <button
          type="button"
          className="px-1 text-[15px] font-medium"
        >
          Help
        </button>
      </header>

      <div className="pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <DetailBlock label="Seat location">{seatLocation}</DetailBlock>

        <DetailBlock label={displayTitle}>{eventLine}</DetailBlock>

        <DetailBlock label="Entry info">{entryInfo}</DetailBlock>

        <DetailBlock label="Ticket Info">
          <p className="uppercase">{ticket.title}</p>
          <p className="mt-0.5">{ticket.venue}</p>
          <p className="mt-0.5 uppercase">{ticketInfoNote}</p>
          <p className="mt-0.5 uppercase">{ticket.dateLabel}</p>
        </DetailBlock>

        <DetailBlock label="Barcode Number">
          {barcodeFor(ticket, seat)}
        </DetailBlock>

        <DetailBlock label={ticket.venueShort || ticket.venue}>
          {city || '—'}
        </DetailBlock>

        <DetailBlock label="Order Number">
          {ticket.orderNumber}
        </DetailBlock>

        <DetailBlock label="Ticket Type">{ticketType}</DetailBlock>

        <DetailBlock label="Entrance">{entrance}</DetailBlock>

        <DetailBlock label="Purchase Date">{purchaseDate}</DetailBlock>

        <DetailBlock label="Ticket Price">
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-4">
              <span>Ticket Face Value</span>
              <span className="shrink-0">${faceValue}</span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <span className="uppercase">Grand Total</span>
              <span className="shrink-0">${grandTotal}</span>
            </div>
          </div>
        </DetailBlock>

        <DetailBlock label="Terms & Conditions" last>
          <p>
            {terms.split(/(www\.ticketmaster\.com)/i).map((part, i) =>
              /www\.ticketmaster\.com/i.test(part) ? (
                <a
                  key={i}
                  href="https://www.ticketmaster.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#075BE8]"
                >
                  {part}
                </a>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </p>
        </DetailBlock>
      </div>
    </div>
  );
}
