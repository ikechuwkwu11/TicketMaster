import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function AcceptTicketsPage() {
  const [params] = useSearchParams();
  const eventTitle = params.get('event') || '';

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F5] px-4 pb-24 pt-10 text-black">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <span className="rounded bg-[#026CDF] px-3 py-1.5 text-[15px] font-bold tracking-tight text-white">
            ticketmaster
          </span>
        </div>

        <div className="rounded-xl border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE2E2]">
            <AlertTriangle className="h-7 w-7 text-[#DC2626]" strokeWidth={2} />
          </div>

          <h1 className="text-center text-[22px] font-extrabold leading-tight text-[#111111]">
            Unable to Accept Tickets
          </h1>

          <p className="mt-3 text-center text-[15px] leading-relaxed text-[#555555]">
            Something went wrong while accepting this transfer
            {eventTitle ? ` for ${eventTitle}` : ''}. Please try again later or
            contact Ticketmaster support.
          </p>

          <div className="mt-5 rounded-lg bg-[#FEF2F2] px-4 py-3 text-center text-[13px] font-semibold text-[#B91C1C]">
            Error: Transfer could not be completed.
          </div>

          <Link
            to="/my-tickets"
            className="mt-6 flex w-full items-center justify-center rounded-md bg-[#026CDF] py-3.5 text-[15px] font-bold uppercase tracking-wide text-white"
          >
            Back to My Tickets
          </Link>
        </div>
      </div>
    </div>
  );
}
