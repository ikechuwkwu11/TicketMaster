import { Link, useSearchParams } from 'react-router-dom';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';

export default function AdminTickets() {
  const { upcomingTickets, pastTickets, deleteTicket } = useCatalog();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'past' ? 'past' : 'upcoming';
  const list = tab === 'past' ? pastTickets : upcomingTickets;

  return (
    <div className="px-6 py-6 lg:px-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Tickets & seats</h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Manage owned ticket orders, sections, rows, and seat numbers.
          </p>
        </div>
        <Link
          to={`/admin/tickets/new?tab=${tab}`}
          className="inline-flex items-center gap-2 rounded-md bg-[#0F172A] px-4 py-2.5 text-[13px] font-bold text-white"
        >
          <Plus className="h-4 w-4" />
          Add ticket order
        </Link>
      </header>

      <div className="mb-4 flex gap-2">
        {[
          ['upcoming', `Upcoming (${upcomingTickets.length})`],
          ['past', `Past (${pastTickets.length})`],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setParams({ tab: key })}
            className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${
              tab === key
                ? 'bg-[#0F172A] text-white'
                : 'bg-white text-[#475569] ring-1 ring-[#E2E8F0]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
        {list.length === 0 ? (
          <p className="px-4 py-10 text-center text-[14px] text-[#94A3B8]">
            No ticket orders in this list.
          </p>
        ) : (
          <ul>
            {list.map((ticket) => (
              <li
                key={ticket.id}
                className="flex items-center gap-3 border-t border-[#E2E8F0] px-4 py-3 first:border-t-0"
              >
                <img
                  src={ticket.image}
                  alt=""
                  className="h-14 w-20 shrink-0 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold text-[#0F172A]">
                    {ticket.displayTitle || ticket.title}
                  </p>
                  <p className="truncate text-[12px] text-[#64748B]">
                    {ticket.dateLabel} · {ticket.seats?.length || 0} seats ·{' '}
                    {ticket.orderNumber}
                  </p>
                </div>
                <Link
                  to={`/admin/tickets/${ticket.id}`}
                  className="rounded-md p-2 text-[#475569] hover:bg-[#F1F5F9]"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    if (
                      !confirm(
                        `Delete order “${ticket.displayTitle || ticket.title}”?`,
                      )
                    ) {
                      return;
                    }
                    try {
                      await deleteTicket(ticket.id);
                    } catch (err) {
                      alert(err.message || 'Delete failed');
                    }
                  }}
                  className="rounded-md p-2 text-[#DC2626] hover:bg-[#FEF2F2]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
