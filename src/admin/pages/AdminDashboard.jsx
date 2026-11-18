import { Link } from 'react-router-dom';
import { CalendarDays, Image as ImageIcon, Ticket } from 'lucide-react';
import { SECTION_META, useCatalog } from '../../context/CatalogContext';

export default function AdminDashboard() {
  const {
    allEvents,
    upcomingTickets,
    pastTickets,
    images,
    sections,
    loading,
    error,
    refresh,
  } = useCatalog();

  const stats = [
    {
      label: 'Total events',
      value: allEvents.length,
      to: '/admin/events',
      icon: CalendarDays,
    },
    {
      label: 'Upcoming tickets',
      value: upcomingTickets.length,
      to: '/admin/tickets',
      icon: Ticket,
    },
    {
      label: 'Past tickets',
      value: pastTickets.length,
      to: '/admin/tickets?tab=past',
      icon: Ticket,
    },
    {
      label: 'Uploaded images',
      value: images.length,
      to: '/admin/images',
      icon: ImageIcon,
    },
  ];

  return (
    <div className="px-4 py-5 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-[#0F172A] sm:text-2xl">Dashboard</h1>
        <p className="mt-1 text-[13px] leading-relaxed text-[#64748B] sm:text-[14px]">
          Live data from Django REST Framework at{' '}
          <code className="break-all rounded bg-[#F1F5F9] px-1.5 py-0.5 text-[12px]">
            /api/bootstrap/
          </code>
        </p>
        {loading ? (
          <p className="mt-2 text-[13px] text-[#64748B]">Syncing with API…</p>
        ) : null}
        {error ? (
          <div className="mt-3 rounded-md border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-[13px] text-[#991B1B]">
            {error}{' '}
            <button type="button" onClick={refresh} className="font-bold underline">
              Retry
            </button>
          </div>
        ) : (
          <p className="mt-2 text-[13px] font-semibold text-[#15803D]">
            API connected
          </p>
        )}
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, to, icon: Icon }) => (
          <Link
            key={label}
            to={to}
            className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition hover:border-[#94A3B8]"
          >
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold text-[#64748B]">{label}</p>
              <Icon className="h-4 w-4 text-[#94A3B8]" />
            </div>
            <p className="mt-3 text-3xl font-bold text-[#0F172A]">{value}</p>
          </Link>
        ))}
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#0F172A]">
            Homepage sections
          </h2>
          <Link
            to="/admin/sections"
            className="text-[13px] font-semibold text-[#0369A1]"
          >
            Manage sections
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] text-left text-[13px]">
              <thead className="bg-[#F8FAFC] text-[#64748B]">
                <tr>
                  <th className="px-3 py-3 font-semibold sm:px-4">Section</th>
                  <th className="px-3 py-3 font-semibold sm:px-4">Items</th>
                  <th className="px-3 py-3 font-semibold sm:px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {SECTION_META.map((s) => (
                  <tr key={s.key} className="border-t border-[#E2E8F0]">
                    <td className="px-3 py-3 font-semibold text-[#0F172A] sm:px-4">
                      {s.label}
                    </td>
                    <td className="px-3 py-3 text-[#475569] sm:px-4">
                      {(sections[s.key] || []).length}
                    </td>
                    <td className="px-3 py-3 sm:px-4">
                      <Link
                        to={`/admin/events?section=${s.key}`}
                        className="font-semibold text-[#0369A1]"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        <Link
          to="/admin/events/new"
          className="rounded-xl bg-[#0F172A] px-4 py-4 text-center text-[14px] font-bold text-white"
        >
          Add event
        </Link>
        <Link
          to="/admin/tickets/new"
          className="rounded-xl border border-[#0F172A] bg-white px-4 py-4 text-center text-[14px] font-bold text-[#0F172A]"
        >
          Add ticket order
        </Link>
        <Link
          to="/admin/images"
          className="rounded-xl border border-[#CBD5E1] bg-white px-4 py-4 text-center text-[14px] font-bold text-[#0F172A]"
        >
          Upload images
        </Link>
      </section>
    </div>
  );
}
