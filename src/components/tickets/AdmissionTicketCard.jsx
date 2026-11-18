import SafeTixBarcode from './SafeTixBarcode';

export default function AdmissionTicketCard({ ticket, seat }) {
  const seed = Number(seat.seat) || 1;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_8px_28px_rgba(0,0,0,0.12)]">
      {/* Blue Ticketmaster header */}
      <div className="flex h-8 shrink-0 items-center justify-center bg-[#026CDF]">
        <span className="text-[12px] font-semibold italic tracking-tight text-white">
          ticketmaster
        </span>
      </div>

      {/* Artist image with SafeTix barcode overlay */}
      <div className="relative shrink-0 bg-[#111]">
        <img
          src={ticket.image}
          alt=""
          className="aspect-[5/4] w-full object-cover object-[center_20%]"
        />
        <div className="absolute inset-x-3 top-2.5">
          <SafeTixBarcode seed={seed} />
        </div>
      </div>

      {/* Admission details */}
      <div className="flex flex-1 flex-col px-4 pb-3.5 pt-3">
        <h2 className="text-[15px] font-extrabold uppercase tracking-wide text-black">
          Verified Fan Presale
        </h2>
        <p className="mt-0.5 text-[12px] text-[#6B6B6B]">Reserved Seat Ticket</p>

        <div className="mt-3.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#6B6B6B]">
            Section
          </p>
          <p className="mt-0.5 text-[34px] font-extrabold leading-none text-black">
            {seat.section}
          </p>
        </div>

        <button
          type="button"
          className="mt-3.5 w-full rounded-[2px] bg-black py-2.5 text-[11px] font-bold uppercase tracking-wide text-white"
        >
          Reserved Seat Ticket
        </button>

        <p className="mt-2.5 text-center text-[10px] font-semibold uppercase tracking-wide text-[#6B6B6B]">
          Row {seat.row} &nbsp;•&nbsp; Seat {seat.seat} &nbsp;•&nbsp; Gate Entrance
        </p>
      </div>
    </article>
  );
}