import { Link } from 'react-router-dom';

export default function SeatTicketBlock({ seat, to }) {
  const content = (
    <>
      <div className="bg-[#EDEDED] px-4 py-3">
        <p className="text-[14px] font-bold text-black">{seat.type}</p>
      </div>
      <div className="mt-[3px] grid grid-cols-3 bg-[#F7F7F7] px-4 py-3.5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#6B6B6B]">
            Section
          </p>
          <p className="mt-1 text-[20px] font-bold leading-none text-black">
            {seat.section}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#6B6B6B]">
            Row
          </p>
          <p className="mt-1 text-[20px] font-bold leading-none text-black">
            {seat.row}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#6B6B6B]">
            Seat
          </p>
          <p className="mt-1 text-[20px] font-bold leading-none text-black">
            {seat.seat}
          </p>
        </div>
      </div>
    </>
  );

  if (to) {
    return (
      <Link to={to} className="block overflow-hidden rounded-[4px]">
        {content}
      </Link>
    );
  }

  return <div className="overflow-hidden rounded-[4px]">{content}</div>;
}
