import { Link } from 'react-router-dom';

export default function SeatTicketBlock({ seat, to }) {
  const content = (
    <div className="w-full overflow-hidden rounded-md bg-[#E8E8E8]">
      <div className="w-full px-3.5 py-2">
        <p className="text-[12px] font-bold leading-none text-black">
          Verified Fan Presale
        </p>
      </div>
      {/* Ticketmaster layout: SECTION left · ROW center · SEAT right */}
      <div className="flex w-full items-start justify-between bg-[#F0F0F0] px-3.5 pb-3 pt-2">
        <div className="min-w-0 text-left">
          <p className="text-[9px] font-bold uppercase tracking-wide text-[#6B6B6B]">
            Section
          </p>
          <p className="mt-0.5 text-[18px] font-bold leading-none text-black">
            {seat.section}
          </p>
        </div>
        <div className="min-w-0 text-center">
          <p className="text-[9px] font-bold uppercase tracking-wide text-[#6B6B6B]">
            Row
          </p>
          <p className="mt-0.5 text-[18px] font-bold leading-none text-black">
            {seat.row}
          </p>
        </div>
        <div className="min-w-0 text-right">
          <p className="text-[9px] font-bold uppercase tracking-wide text-[#6B6B6B]">
            Seat
          </p>
          <p className="mt-0.5 text-[18px] font-bold leading-none text-black">
            {seat.seat}
          </p>
        </div>
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block w-full">
        {content}
      </Link>
    );
  }

  return <div className="w-full">{content}</div>;
}
