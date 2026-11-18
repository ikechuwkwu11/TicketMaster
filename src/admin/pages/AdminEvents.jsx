import { Link, useSearchParams } from 'react-router-dom';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { SECTION_META, useCatalog } from '../../context/CatalogContext';

export default function AdminEvents() {
  const { sections, deleteEvent } = useCatalog();
  const [params, setParams] = useSearchParams();
  const sectionKey = params.get('section') || 'forYou';
  const events = sections[sectionKey] || [];
  const meta = SECTION_META.find((s) => s.key === sectionKey);

  return (
    <div className="px-4 py-5 sm:px-6 lg:px-8">
      <header className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] sm:text-2xl">Events</h1>
          <p className="mt-1 text-[13px] text-[#64748B] sm:text-[14px]">
            Add, edit, or remove events in any homepage section.
          </p>
        </div>
        <Link
          to={`/admin/events/new?section=${sectionKey}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#0F172A] px-4 py-2.5 text-[13px] font-bold text-white sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Add event
        </Link>
      </header>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SECTION_META.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setParams({ section: s.key })}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold ${
              sectionKey === s.key
                ? 'bg-[#0F172A] text-white'
                : 'bg-white text-[#475569] ring-1 ring-[#E2E8F0]'
            }`}
          >
            {s.label} ({(sections[s.key] || []).length})
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
        <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-[13px] font-semibold text-[#64748B]">
          {meta?.label || sectionKey}
        </div>
        {events.length === 0 ? (
          <p className="px-4 py-10 text-center text-[14px] text-[#94A3B8]">
            No events in this section yet.
          </p>
        ) : (
          <ul>
            {events.map((event) => (
              <li
                key={event.id}
                className="flex items-center gap-2.5 border-t border-[#E2E8F0] px-3 py-3 first:border-t-0 sm:gap-3 sm:px-4"
              >
                <img
                  src={event.image}
                  alt=""
                  className="h-12 w-16 shrink-0 rounded object-cover sm:h-14 sm:w-20"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-[#0F172A] sm:text-[14px]">
                    {event.title}
                  </p>
                  <p className="truncate text-[11px] text-[#64748B] sm:text-[12px]">
                    {event.dateLabel ||
                      [event.month, event.day, event.year].filter(Boolean).join(' ') ||
                      event.location ||
                      event.venue ||
                      event.slug}
                  </p>
                </div>
                <Link
                  to={`/admin/events/${event.id}?section=${sectionKey}`}
                  className="rounded-md p-2 text-[#475569] hover:bg-[#F1F5F9]"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm(`Delete “${event.title}”?`)) return;
                    try {
                      await deleteEvent(sectionKey, event.id);
                    } catch (err) {
                      alert(err.message || 'Delete failed');
                    }
                  }}
                  className="rounded-md p-2 text-[#DC2626] hover:bg-[#FEF2F2]"
                  aria-label="Delete"
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
