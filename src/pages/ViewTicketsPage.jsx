import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MoreVertical,
  ScanBarcode,
  Ticket,
} from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import SeatTicketBlock from '../components/tickets/SeatTicketBlock';
import TransferSellBar from '../components/tickets/TransferSellBar';
import TransferTicketsSheet from '../components/tickets/TransferTicketsSheet';

export default function ViewTicketsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getTicketBySlug } = useCatalog();
  const ticket = getTicketBySlug(slug);
  const [tab, setTab] = useState('tickets');
  const [scrolled, setScrolled] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const heroRef = useRef(null);
  const admissionPath = `/my-tickets/${slug}/admission`;

  useEffect(() => {
    const onScroll = () => {
      const threshold = heroRef.current?.offsetHeight
        ? heroRef.current.offsetHeight - 80
        : 180;
      setScrolled(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    ticket.mapQuery || ticket.venue,
  )}`;

  return (
    <div className="relative min-h-screen bg-[#F2F2F2] text-black">
      {/* Sticky compact header (appears after scroll — screenshots 2–4) */}
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-200 ${
          scrolled
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        <div className="relative overflow-hidden">
          <img
            src={ticket.image}
            alt=""
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
          />
          <div className="absolute inset-0 bg-black/65" />
          <div className="relative flex items-center gap-3 px-3 py-3">
            <Link
              to="/my-tickets"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/45 text-white"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="min-w-0 flex-1 text-center">
              <p className="truncate text-[13px] font-bold text-white">
                {ticket.displayTitle || ticket.title}
              </p>
              <p className="truncate text-[11px] text-[#C8C8C8]">
                {ticket.venueShort || ticket.venue}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(admissionPath)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#075BE8] text-white"
              aria-label="Scan tickets"
            >
              <ScanBarcode className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero + inset Ticketmaster event card (date step, side gutters) */}
      <section ref={heroRef} className="relative bg-[#F2F2F2]">
        <div
          className={`relative overflow-hidden ${
            transferOpen
              ? 'h-[28vh] min-h-[200px]'
              : 'h-[42vh] min-h-[260px] max-h-[360px]'
          }`}
        >
          <img
            src={ticket.image}
            alt={ticket.title}
            className="h-full w-full object-contain object-center bg-[#111]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

          <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-3 pt-3">
            <Link
              to="/my-tickets"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <button
              type="button"
              className="rounded-full bg-black/50 px-4 py-1.5 text-[13px] font-medium text-white backdrop-blur-sm"
            >
              Help
            </button>
          </div>
        </div>

        {/* Pulls up over the photo; mx creates the side white space */}
        <div
          className={`relative z-10 px-3 sm:px-4 ${
            transferOpen ? '-mt-16' : '-mt-[7.25rem]'
          }`}
        >
          <div className="inline-block bg-black px-2.5 py-1.5">
            <p className="whitespace-nowrap text-[11px] font-medium tracking-wide text-white">
              {ticket.dateLabel}
            </p>
          </div>
          <div className="bg-black px-3 pb-3 pt-2.5">
            <h1 className="text-[18px] font-extrabold uppercase leading-[1.15] tracking-wide text-white sm:text-[20px]">
              {ticket.title}
            </h1>
            {!transferOpen ? (
              <div className="mt-2 flex items-end justify-between gap-3">
                <p className="text-[13px] text-white">{ticket.venue}</p>
                <span className="flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-white">
                  <Ticket className="h-4 w-4" strokeWidth={2.25} />
                  x{ticket.quantity}
                </span>
              </div>
            ) : null}
          </div>
          {!transferOpen ? (
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 bg-[#026CDF] py-3.5 text-[15px] font-bold text-white"
              onClick={() => navigate(admissionPath)}
            >
              <ScanBarcode className="h-5 w-5" />
              View Tickets
            </button>
          ) : null}
        </div>
      </section>

      {/* Light content area */}
      <div className="bg-white">
        {/* Tabs — stick under compact header when scrolled */}
        <div
          className={`sticky z-30 grid grid-cols-2 border-b border-[#E8E8E8] bg-white pt-1 ${
            scrolled ? 'top-[56px]' : 'top-0'
          }`}
        >
          <button
            type="button"
            onClick={() => setTab('tickets')}
            className={`relative py-3.5 text-[15px] font-bold ${
              tab === 'tickets' ? 'text-black' : 'text-[#8A8A8A]'
            }`}
          >
            Tickets
            <span
              className={`absolute inset-x-0 bottom-0 h-[3px] ${
                tab === 'tickets' ? 'bg-black' : 'bg-[#D8D8D8]'
              }`}
            />
          </button>
          <button
            type="button"
            onClick={() => setTab('extras')}
            className={`relative py-3.5 text-[15px] font-bold ${
              tab === 'extras' ? 'text-black' : 'text-[#8A8A8A]'
            }`}
          >
            Extras
            <span
              className={`absolute inset-x-0 bottom-0 h-[3px] ${
                tab === 'extras' ? 'bg-black' : 'bg-[#D8D8D8]'
              }`}
            />
          </button>
        </div>

        {tab === 'tickets' ? (
          <>
            {/* Order + seat list */}
            <div id="ticket-list" className="bg-[#F5F5F5] px-4 pb-2 pt-4">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h2 className="text-[15px] font-bold text-black">
                    Order #{ticket.orderNumber}
                  </h2>
                  <p className="mt-0.5 text-[12px] text-[#6B6B6B]">
                    x{ticket.quantity} Tickets
                  </p>
                </div>
                <button
                  type="button"
                  className="p-1 text-[#333]"
                  aria-label="More options"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                {ticket.seats.map((seat) => (
                  <SeatTicketBlock
                    key={seat.id}
                    seat={seat}
                    to={admissionPath}
                  />
                ))}
              </div>
            </div>

            {/* MORE OPTIONS */}
            <div className="bg-[#F5F5F5] px-4 pb-6 pt-6">
              <h3 className="mb-3 text-[15px] font-extrabold uppercase tracking-wide text-black">
                More Options
              </h3>

              <div className="overflow-hidden rounded-md border border-[#E0E0E0] bg-white">
                <div className="relative h-44 w-full bg-[#E8EDE8]">
                  <iframe
                    title="Venue map"
                    src={ticket.mapEmbed}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <span className="pointer-events-none absolute bottom-2 right-2 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-[#555]">
                    Map
                  </span>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block border-t border-[#E8E8E8] bg-[#F0F0F0] py-3.5 text-center text-[15px] font-bold text-black"
                >
                  Get Directions
                </a>
              </div>
            </div>

            {/* YOU GOT TICKETS + Share */}
            <div className="bg-[#111111] px-4 pb-28 pt-5">
              <div className="overflow-hidden rounded-md bg-gradient-to-br from-[#2A2A2A] to-[#141414]">
                <div className="flex gap-0">
                  <div className="w-[42%] shrink-0">
                    <img
                      src={ticket.image}
                      alt=""
                      className="aspect-[3/4] w-full bg-[#111] object-contain object-center"
                    />
                    <div className="bg-black px-2.5 py-2.5">
                      <p className="text-[9px] font-semibold uppercase tracking-wide text-white">
                        {ticket.dateLabel}
                      </p>
                      <p className="mt-1 text-[11px] font-extrabold uppercase leading-snug text-white">
                        {ticket.title}
                      </p>
                      <p className="mt-1 text-[10px] text-[#A0A0A0]">
                        {ticket.venue}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-1 items-center justify-center px-4 py-6">
                    <div>
                      <p className="text-[28px] font-extrabold uppercase leading-[1.05] tracking-tight text-white">
                        You Got
                        <br />
                        Tickets!
                      </p>
                      <div className="mt-3 h-[5px] w-full max-w-[140px] bg-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-md bg-[#1A1A1A] px-4 py-5">
                <h4 className="text-[17px] font-bold text-white">
                  Post on Social Media
                </h4>
                <p className="mt-2 text-[13px] leading-relaxed text-[#A0A0A0]">
                  Build hype for the event, and share that you got tickets with
                  your friends and family.
                </p>
                <button
                  type="button"
                  className="mt-4 w-full rounded-md border border-[#303030] bg-black py-3.5 text-[14px] font-bold text-white"
                >
                  Share You&apos;re Going
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-[#F5F5F5] px-4 py-16 text-center">
            <p className="text-[15px] font-semibold text-black">Extras</p>
            <p className="mt-2 text-[13px] text-[#6B6B6B]">
              Parking, VIP upgrades and add-ons will appear here.
            </p>
          </div>
        )}
      </div>

      <TransferSellBar
        hidden={transferOpen}
        onTransfer={() => setTransferOpen(true)}
      />

      {transferOpen && (
        <TransferTicketsSheet
          ticket={ticket}
          onClose={() => setTransferOpen(false)}
        />
      )}
    </div>
  );
}
