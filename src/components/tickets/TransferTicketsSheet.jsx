import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Send, Shield, Ticket, UserRoundPlus } from 'lucide-react';

function SelectStep({
  seats,
  selected,
  toggle,
  section,
  row,
  count,
  selectedCount,
  canTransfer,
  onTransferTo,
}) {
  return (
    <>
      <h2
        id="transfer-sheet-title"
        className="shrink-0 px-4 pb-3 text-center text-[15px] font-extrabold uppercase tracking-wide text-black"
      >
        Select Tickets to Transfer
      </h2>

      <div className="shrink-0 border-t border-[#E8E8E8]" />

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="mt-4 flex shrink-0 items-center justify-between px-5">
          <p className="text-[15px] font-bold text-black">
            Sec: {section}, Row {row}
          </p>
          <p className="flex items-center gap-1.5 text-[14px] font-semibold text-black">
            <Ticket className="h-4 w-4" strokeWidth={2.25} />
            {count} Tickets
          </p>
        </div>

        <div className="hide-scrollbar scroll-touch mt-6 flex gap-3 overflow-x-auto px-5">
          {seats.map((seat) => {
            const isOn = selected.includes(seat.id);
            return (
              <button
                key={seat.id}
                type="button"
                onClick={() => toggle(seat.id)}
                className="w-[96px] shrink-0 overflow-hidden rounded-xl bg-white shadow-[0_6px_20px_rgba(0,0,0,0.14)]"
                aria-pressed={isOn}
              >
                <div className="bg-[#0046BE] py-3 text-center text-[12px] font-extrabold uppercase tracking-wide text-white">
                  Seat {seat.seat}
                </div>
                <div className="flex h-[88px] items-center justify-center bg-white">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 ${
                      isOn ? 'border-[#0046BE]' : 'border-[#C8C8C8]'
                    }`}
                  >
                    {isOn ? (
                      <span className="h-5 w-5 rounded-full bg-[#0046BE]" />
                    ) : null}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto flex shrink-0 items-center justify-between border-t border-[#E8E8E8] px-5 py-4 pb-[max(1.1rem,env(safe-area-inset-bottom))]">
        <p className="text-[15px] font-medium text-black">
          {selectedCount} Selected
        </p>
        <button
          type="button"
          disabled={!canTransfer}
          className={`text-[14px] font-extrabold uppercase tracking-wide ${
            canTransfer ? 'text-[#0046BE]' : 'text-[#A0A0A0]'
          }`}
          onClick={onTransferTo}
        >
          Transfer To &gt;
        </button>
      </div>
    </>
  );
}

function RecipientStep({ onBack, onSelectContacts, onManualEntry }) {
  return (
    <>
      <h2
        id="transfer-sheet-title"
        className="shrink-0 px-4 pb-3 text-center text-[15px] font-extrabold uppercase tracking-wide text-black"
      >
        Transfer To
      </h2>

      <div className="shrink-0 border-t border-[#E8E8E8]" />

      <div className="flex min-h-0 flex-1 flex-col px-5 pt-5">
        <button
          type="button"
          onClick={onSelectContacts}
          className="flex w-full items-center justify-between rounded-md border border-[#D8D8D8] bg-white px-4 py-4 text-left"
        >
          <span className="flex-1 text-center text-[15px] font-bold text-black">
            Select From Contacts
          </span>
          <UserRoundPlus
            className="h-5 w-5 shrink-0 text-[#333]"
            strokeWidth={1.75}
          />
        </button>

        <button
          type="button"
          onClick={onManualEntry}
          className="mt-3 flex w-full items-center justify-between rounded-md border border-[#D8D8D8] bg-white px-4 py-4 text-left"
        >
          <span className="flex-1 text-center text-[15px] font-bold text-black">
            Manually Enter A Recipient
          </span>
          <Plus className="h-5 w-5 shrink-0 text-[#333]" strokeWidth={2.25} />
        </button>

        <div className="flex flex-1 flex-col items-center justify-center px-4 pb-6 pt-10 text-center">
          <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[#EDEDED]">
            <Send
              className="h-9 w-9 -translate-x-0.5 translate-y-0.5 text-[#8A8A8A]"
              strokeWidth={1.5}
            />
          </div>
          <p className="mt-5 text-[16px] font-bold leading-snug text-black">
            Transfer Tickets Via Email or Text Message
          </p>
          <p className="mt-2 max-w-[280px] text-[13px] leading-relaxed text-[#6B6B6B]">
            Select an Email or mobile number to transfer tickets to your
            recipient.
          </p>
        </div>
      </div>

      <div className="mt-auto flex shrink-0 items-center border-t border-[#E8E8E8] px-5 py-4 pb-[max(1.1rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onBack}
          className="text-[15px] font-bold text-[#0046BE]"
        >
          &lt; Back
        </button>
      </div>
    </>
  );
}

function DetailsStep({ selectedCount, onBack, onSubmit }) {
  const [useMobile, setUseMobile] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    note: '',
  });

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const ticketLabel =
    selectedCount === 1 ? '1 ticket' : `${selectedCount} tickets`;

  const inputClass =
    'mt-1.5 w-full rounded-md border border-[#D0D0D0] bg-white px-3 py-3 text-[15px] text-black outline-none focus:border-[#0046BE]';

  return (
    <>
      <h2
        id="transfer-sheet-title"
        className="shrink-0 px-4 pb-3 text-center text-[17px] font-bold text-black"
      >
        Recipient Details
      </h2>

      <div className="shrink-0 border-t border-[#E8E8E8]" />

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-4">
        <p className="text-center text-[14px] font-semibold text-[#0046BE]">
          {ticketLabel} selected for transfer
        </p>

        <label className="mt-5 block">
          <span className="text-[13px] font-bold text-[#333]">First Name</span>
          <input
            type="text"
            value={form.firstName}
            onChange={update('firstName')}
            className={inputClass}
            autoComplete="given-name"
          />
        </label>

        <label className="mt-4 block">
          <span className="text-[13px] font-bold text-[#333]">Last Name</span>
          <input
            type="text"
            value={form.lastName}
            onChange={update('lastName')}
            className={inputClass}
            autoComplete="family-name"
          />
        </label>

        {useMobile ? (
          <div className="mt-4">
            <label className="block" htmlFor="recipient-mobile">
              <span className="text-[13px] font-bold text-[#333]">
                Mobile Number
              </span>
              <input
                id="recipient-mobile"
                type="tel"
                inputMode="tel"
                value={form.mobile}
                onChange={update('mobile')}
                placeholder="(555) 555-5555"
                className={inputClass}
                autoComplete="tel"
              />
            </label>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setUseMobile(false);
                setForm((prev) => ({ ...prev, mobile: '' }));
              }}
              className="mt-2 text-[13px] font-semibold text-[#0046BE] underline underline-offset-2"
            >
              Use Email Instead
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <label className="block" htmlFor="recipient-email">
              <span className="text-[13px] font-bold text-[#333]">Email</span>
              <input
                id="recipient-email"
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="name@example.com"
                className={inputClass}
                autoComplete="email"
              />
            </label>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setUseMobile(true);
                setForm((prev) => ({ ...prev, email: '' }));
              }}
              className="mt-2 text-[13px] font-semibold text-[#0046BE] underline underline-offset-2"
            >
              Use Mobile Number Instead
            </button>
          </div>
        )}

        <label className="mt-4 block">
          <span className="text-[13px] font-bold text-[#333]">
            Note{' '}
            <span className="font-medium text-[#8A8A8A]">(optional)</span>
          </span>
          <textarea
            value={form.note}
            onChange={update('note')}
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </label>

        <div className="mt-5 flex items-start gap-2.5 rounded-md border border-[#7EB6FF] bg-[#E8F2FF] px-3 py-3">
          <Shield
            className="mt-0.5 h-5 w-5 shrink-0 text-[#0046BE]"
            strokeWidth={2}
          />
          <p className="text-[13px] leading-snug text-[#1A1A1A]">
            Only transfer tickets to people you know and trust to keep everyone
            safe.
          </p>
        </div>
      </div>

      <div className="mt-auto flex shrink-0 items-center justify-between gap-3 border-t border-[#E8E8E8] px-5 py-3.5 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 text-[15px] font-bold text-[#0046BE]"
        >
          &lt; Back
        </button>
        <button
          type="button"
          onClick={() =>
            onSubmit({
              ...form,
              email: useMobile ? '' : form.email,
              mobile: useMobile ? form.mobile : '',
            })
          }
          className="rounded-md bg-[#1A1A1A] px-5 py-3 text-[14px] font-bold text-white"
        >
          Transfer {selectedCount}{' '}
          {selectedCount === 1 ? 'Ticket' : 'Tickets'}
        </button>
      </div>
    </>
  );
}

export default function TransferTicketsSheet({ ticket, onClose }) {
  const navigate = useNavigate();
  const seats = ticket?.seats ?? [];
  const [step, setStep] = useState('select'); // select | recipient | details
  const [selected, setSelected] = useState(() =>
    seats[0]?.id ? [seats[0].id] : [],
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!ticket) return null;

  const section = seats[0]?.section ?? '—';
  const row = seats[0]?.row ?? '—';
  const count = seats.length;
  const selectedCount = selected.length;
  const canTransfer = selectedCount > 0;

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const sheetTop = step === 'details' ? 'top-[18%]' : 'top-[24%]';

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        className="absolute inset-0 bg-black/35"
        aria-label="Close transfer sheet"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="transfer-sheet-title"
        className={`absolute inset-x-0 bottom-0 ${sheetTop} z-10 mx-auto flex w-full max-w-lg animate-[sheet-up_0.28s_ease-out] flex-col rounded-t-[20px] bg-white text-black shadow-[0_-12px_40px_rgba(0,0,0,0.35)]`}
      >
        <div className="flex shrink-0 justify-center pb-2 pt-3">
          <span className="h-1 w-10 rounded-full bg-[#D0D0D0]" />
        </div>

        {step === 'select' && (
          <SelectStep
            seats={seats}
            selected={selected}
            toggle={toggle}
            section={section}
            row={row}
            count={count}
            selectedCount={selectedCount}
            canTransfer={canTransfer}
            onTransferTo={() => {
              if (!canTransfer) return;
              setStep('recipient');
            }}
          />
        )}

        {step === 'recipient' && (
          <RecipientStep
            onBack={() => setStep('select')}
            onSelectContacts={() => setStep('details')}
            onManualEntry={() => setStep('details')}
          />
        )}

        {step === 'details' && (
          <DetailsStep
            selectedCount={selectedCount}
            onBack={() => setStep('recipient')}
            onSubmit={(form) => {
              onClose();
              navigate(`/my-tickets/${ticket.slug}/transferred`, {
                state: {
                  count: selectedCount,
                  seatIds: selected,
                  firstName: form.firstName,
                  lastName: form.lastName,
                  email: form.email,
                  mobile: form.mobile,
                  note: form.note,
                },
              });
            }}
          />
        )}
      </div>
    </div>
  );
}
