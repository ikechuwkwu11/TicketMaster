import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { api } from '../../api/client';
import { useCatalog, uid } from '../../context/CatalogContext';
import ImageField from '../components/ImageField';

function blankSeat() {
  return {
    id: uid('seat'),
    type: 'Verified Fan Presale',
    section: '',
    row: '',
    seat: '',
  };
}

const emptyTicket = {
  title: '',
  displayTitle: '',
  slug: '',
  image: '',
  dateLabel: '',
  venue: '',
  venueShort: '',
  orderNumber: '',
  mapQuery: '',
  mapEmbed: '',
  entryInfo: 'Mobile Ticket',
  ticketInfoNote: 'NO PROF CAMS VID/AUD REC',
  city: '',
  entrance: '',
  purchaseDate: '',
  faceValue: '200.00',
  grandTotal: '216.44',
  ticketType: 'Verified Fan Presale',
  barcode: '',
  terms: '',
  recipientName: '',
  recipientEmail: '',
  transferFromName: '',
  seats: [blankSeat()],
};

export default function AdminTicketForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { upcomingTickets, pastTickets, saveTicket, slugify } = useCatalog();

  const found = useMemo(() => {
    if (isNew) return null;
    const up = upcomingTickets.find((t) => t.id === id);
    if (up) return { ticket: up, bucket: 'upcoming' };
    const past = pastTickets.find((t) => t.id === id);
    if (past) return { ticket: past, bucket: 'past' };
    return null;
  }, [id, isNew, upcomingTickets, pastTickets]);

  const [bucket, setBucket] = useState(
    found?.bucket || (params.get('tab') === 'past' ? 'past' : 'upcoming'),
  );
  const [form, setForm] = useState(() =>
    found?.ticket
      ? {
          ...emptyTicket,
          ...found.ticket,
          seats: found.ticket.seats?.length
            ? found.ticket.seats.map((s) => ({ ...s }))
            : [blankSeat()],
        }
      : { ...emptyTicket, seats: [blankSeat()] },
  );

  const [bulk, setBulk] = useState({
    section: '',
    row: '',
    startSeat: '1',
    count: '4',
  });
  const [sendTransferEmail, setSendTransferEmail] = useState(true);
  const [emailBusy, setEmailBusy] = useState(false);

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const updateSeat = (seatId, key, value) => {
    setForm((prev) => ({
      ...prev,
      seats: prev.seats.map((s) =>
        s.id === seatId ? { ...s, [key]: value } : s,
      ),
    }));
  };

  const addSeat = () =>
    setForm((prev) => ({ ...prev, seats: [...prev.seats, blankSeat()] }));

  const removeSeat = (seatId) =>
    setForm((prev) => ({
      ...prev,
      seats: prev.seats.length <= 1 ? prev.seats : prev.seats.filter((s) => s.id !== seatId),
    }));

  const generateSeats = () => {
    const section = bulk.section.trim();
    const row = bulk.row.trim();
    const start = Number(bulk.startSeat) || 1;
    const count = Math.max(1, Math.min(50, Number(bulk.count) || 1));
    if (!section || !row) return alert('Section and row are required to generate seats.');
    const seats = Array.from({ length: count }, (_, i) => ({
      id: uid('seat'),
      type: form.ticketType || 'Verified Fan Presale',
      section,
      row,
      seat: String(start + i),
    }));
    setForm((prev) => ({ ...prev, seats }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() && !form.displayTitle.trim()) {
      return alert('Title is required.');
    }
    if (!form.image.trim()) return alert('Image is required.');
    if (form.seats.some((s) => !s.section || !s.row || !s.seat)) {
      return alert('Every seat needs section, row, and seat number.');
    }

    const displayTitle = form.displayTitle.trim() || form.title.trim();
    const title = form.title.trim() || displayTitle.toUpperCase();

    const payload = {
      ...form,
      id: form.id || found?.ticket?.id,
      title,
      displayTitle,
      slug: form.slug.trim() || slugify(displayTitle),
      venueShort: form.venueShort.trim() || form.venue.trim(),
      mapQuery: form.mapQuery.trim() || form.venue.trim(),
      recipientName: form.recipientName.trim(),
      recipientEmail: form.recipientEmail.trim(),
      transferFromName: form.transferFromName.trim(),
      seats: form.seats.map((s) => ({
        ...s,
        section: String(s.section),
        row: String(s.row),
        seat: String(s.seat),
        type: s.type || form.ticketType || 'Verified Fan Presale',
      })),
    };

    try {
      await saveTicket(payload, { bucket });

      if (sendTransferEmail && payload.recipientEmail) {
        setEmailBusy(true);
        try {
          const image = (() => {
            const src = payload.image || '';
            if (
              !src ||
              src.startsWith('http://') ||
              src.startsWith('https://') ||
              src.startsWith('data:')
            ) {
              return src;
            }
            try {
              return new URL(src, window.location.href).href;
            } catch {
              return src;
            }
          })();
          await api.sendTransferEmail({
            to: payload.recipientEmail,
            fromName: payload.transferFromName,
            ticket: { ...payload, image },
          });
          alert(`Ticket saved. Transfer email sent to ${payload.recipientEmail}.`);
        } catch (mailErr) {
          alert(
            `Ticket saved, but email failed: ${
              mailErr.message || 'Could not send transfer email'
            }. Make sure the Django backend is running and EMAIL_HOST_PASSWORD is set.`,
          );
        } finally {
          setEmailBusy(false);
        }
      }

      navigate(`/admin/tickets?tab=${bucket}`);
    } catch (err) {
      alert(err.message || 'Failed to save ticket');
    }
  };

  const field =
    'mt-1.5 w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2.5 text-[14px] text-[#0F172A] outline-none focus:border-[#0F172A]';

  return (
    <div className="px-4 py-5 sm:px-6 lg:px-8">
      <div className="mb-5 sm:mb-6">
        <Link to="/admin/tickets" className="text-[13px] font-semibold text-[#0369A1]">
          ← Back to tickets
        </Link>
        <h1 className="mt-2 text-xl font-bold text-[#0F172A] sm:text-2xl">
          {isNew ? 'Add ticket order' : 'Edit ticket order'}
        </h1>
      </div>

      <form
        onSubmit={onSubmit}
        className="mx-auto max-w-3xl space-y-4 rounded-xl border border-[#E2E8F0] bg-white p-4 sm:p-5"
      >
        <label className="block">
          <span className="text-[12px] font-bold text-[#334155]">List</span>
          <select
            value={bucket}
            onChange={(e) => setBucket(e.target.value)}
            className={field}
          >
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </label>

        <label className="block">
          <span className="text-[12px] font-bold text-[#334155]">Display title</span>
          <input value={form.displayTitle} onChange={update('displayTitle')} className={field} />
        </label>

        <label className="block">
          <span className="text-[12px] font-bold text-[#334155]">Full title (uppercase OK)</span>
          <input value={form.title} onChange={update('title')} className={field} />
        </label>

        <label className="block">
          <span className="text-[12px] font-bold text-[#334155]">Slug</span>
          <input value={form.slug} onChange={update('slug')} className={field} />
        </label>

        <ImageField value={form.image} onChange={(v) => setForm((p) => ({ ...p, image: v }))} />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[12px] font-bold text-[#334155]">Date label</span>
            <input
              value={form.dateLabel}
              onChange={update('dateLabel')}
              placeholder="SAT • JUN 12, 2027 • 6:30 PM"
              className={field}
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold text-[#334155]">Order number</span>
            <input value={form.orderNumber} onChange={update('orderNumber')} className={field} />
          </label>
        </div>

        <label className="block">
          <span className="text-[12px] font-bold text-[#334155]">Venue</span>
          <input value={form.venue} onChange={update('venue')} className={field} />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[12px] font-bold text-[#334155]">Short venue</span>
            <input value={form.venueShort} onChange={update('venueShort')} className={field} />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold text-[#334155]">Map query</span>
            <input value={form.mapQuery} onChange={update('mapQuery')} className={field} />
          </label>
        </div>

        <label className="block">
          <span className="text-[12px] font-bold text-[#334155]">Map embed URL</span>
          <input value={form.mapEmbed} onChange={update('mapEmbed')} className={field} />
        </label>

        <div className="rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] p-4">
          <h2 className="text-[14px] font-bold text-[#0F172A]">Transfer email</h2>
          <p className="mt-1 text-[12px] text-[#64748B]">
            When you book for a user, this sends the Ticketmaster-style “ready to
            accept” email from Xptraveler78@gmail.com using this ticket’s title,
            date, venue, seats, and image.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-[12px] font-bold text-[#334155]">
                Transfer from name (shown in subject/title)
              </span>
              <input
                value={form.transferFromName}
                onChange={update('transferFromName')}
                placeholder="Optional — leave blank for “From -”"
                className={field}
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-bold text-[#334155]">Recipient name</span>
              <input
                value={form.recipientName}
                onChange={update('recipientName')}
                className={field}
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-bold text-[#334155]">Recipient email</span>
              <input
                type="email"
                value={form.recipientEmail}
                onChange={update('recipientEmail')}
                placeholder="user@gmail.com"
                className={field}
              />
            </label>
          </div>
          <label className="mt-3 flex items-center gap-2 text-[13px] font-semibold text-[#0F172A]">
            <input
              type="checkbox"
              checked={sendTransferEmail}
              onChange={(e) => setSendTransferEmail(e.target.checked)}
              className="h-4 w-4 accent-[#075BE8]"
            />
            Send transfer email on save
          </label>
        </div>

        <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <h2 className="text-[14px] font-bold text-[#0F172A]">Ticket Details page</h2>
          <p className="mt-1 text-[12px] text-[#64748B]">
            These fields power the Ticket Info screen in the app.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-[12px] font-bold text-[#334155]">Entry info</span>
              <input value={form.entryInfo} onChange={update('entryInfo')} className={field} />
            </label>
            <label className="block">
              <span className="text-[12px] font-bold text-[#334155]">Ticket type</span>
              <input value={form.ticketType} onChange={update('ticketType')} className={field} />
            </label>
            <label className="block">
              <span className="text-[12px] font-bold text-[#334155]">Entrance</span>
              <input
                value={form.entrance}
                onChange={update('entrance')}
                placeholder="BLOCK 11"
                className={field}
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-bold text-[#334155]">City</span>
              <input value={form.city} onChange={update('city')} className={field} />
            </label>
            <label className="block">
              <span className="text-[12px] font-bold text-[#334155]">Purchase date</span>
              <input
                value={form.purchaseDate}
                onChange={update('purchaseDate')}
                placeholder="SUN, NOV 1, 2026 • 2:16 PM"
                className={field}
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-bold text-[#334155]">Barcode (optional)</span>
              <input value={form.barcode} onChange={update('barcode')} className={field} />
            </label>
            <label className="block">
              <span className="text-[12px] font-bold text-[#334155]">Face value</span>
              <input value={form.faceValue} onChange={update('faceValue')} className={field} />
            </label>
            <label className="block">
              <span className="text-[12px] font-bold text-[#334155]">Grand total</span>
              <input value={form.grandTotal} onChange={update('grandTotal')} className={field} />
            </label>
          </div>
          <label className="mt-3 block">
            <span className="text-[12px] font-bold text-[#334155]">Ticket info note</span>
            <input
              value={form.ticketInfoNote}
              onChange={update('ticketInfoNote')}
              placeholder="NO PROF CAMS VID/AUD REC"
              className={field}
            />
          </label>
          <label className="mt-3 block">
            <span className="text-[12px] font-bold text-[#334155]">Terms &amp; conditions</span>
            <textarea
              value={form.terms}
              onChange={update('terms')}
              rows={4}
              className={field}
              placeholder="Leave blank to use the default Ticketmaster-style terms."
            />
          </label>
        </div>

        <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <h2 className="text-[14px] font-bold text-[#0F172A]">Generate seats</h2>
          <p className="mt-1 text-[12px] text-[#64748B]">
            Quickly create section / row / seat numbers for this order.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <input
              placeholder="Section"
              value={bulk.section}
              onChange={(e) => setBulk((p) => ({ ...p, section: e.target.value }))}
              className="rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-[13px] text-[#0F172A]"
            />
            <input
              placeholder="Row"
              value={bulk.row}
              onChange={(e) => setBulk((p) => ({ ...p, row: e.target.value }))}
              className="rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-[13px] text-[#0F172A]"
            />
            <input
              placeholder="Start seat"
              value={bulk.startSeat}
              onChange={(e) => setBulk((p) => ({ ...p, startSeat: e.target.value }))}
              className="rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-[13px] text-[#0F172A]"
            />
            <input
              placeholder="Count"
              value={bulk.count}
              onChange={(e) => setBulk((p) => ({ ...p, count: e.target.value }))}
              className="rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-[13px] text-[#0F172A]"
            />
          </div>
          <button
            type="button"
            onClick={generateSeats}
            className="mt-3 rounded-md bg-white px-3 py-2 text-[12px] font-bold text-[#0F172A] ring-1 ring-[#CBD5E1]"
          >
            Generate seats
          </button>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[14px] font-bold text-[#0F172A]">
              Seats ({form.seats.length})
            </h2>
            <button
              type="button"
              onClick={addSeat}
              className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0369A1]"
            >
              <Plus className="h-3.5 w-3.5" />
              Add seat
            </button>
          </div>
          <div className="space-y-2">
            {form.seats.map((seat) => (
              <div
                key={seat.id}
                className="grid grid-cols-2 gap-2 rounded-md border border-[#E2E8F0] p-2 sm:grid-cols-[1fr_1fr_1fr_auto]"
              >
                <input
                  value={seat.section}
                  onChange={(e) => updateSeat(seat.id, 'section', e.target.value)}
                  placeholder="Section"
                  className="rounded border border-[#CBD5E1] bg-white px-2 py-2 text-[13px] text-[#0F172A]"
                />
                <input
                  value={seat.row}
                  onChange={(e) => updateSeat(seat.id, 'row', e.target.value)}
                  placeholder="Row"
                  className="rounded border border-[#CBD5E1] bg-white px-2 py-2 text-[13px] text-[#0F172A]"
                />
                <input
                  value={seat.seat}
                  onChange={(e) => updateSeat(seat.id, 'seat', e.target.value)}
                  placeholder="Seat #"
                  className="rounded border border-[#CBD5E1] bg-white px-2 py-2 text-[13px] text-[#0F172A]"
                />
                <button
                  type="button"
                  onClick={() => removeSeat(seat.id)}
                  className="rounded p-2 text-[#DC2626] hover:bg-[#FEF2F2] sm:justify-self-center"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
          <Link
            to={`/admin/tickets?tab=${bucket}`}
            className="rounded-md px-4 py-2.5 text-center text-[13px] font-bold text-[#475569]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={emailBusy}
            className="rounded-md bg-[#0F172A] px-5 py-2.5 text-[13px] font-bold text-white disabled:opacity-60"
          >
            {emailBusy ? 'Sending email…' : 'Save ticket order'}
          </button>
        </div>
      </form>
    </div>
  );
}
