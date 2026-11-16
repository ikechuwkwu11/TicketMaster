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
    <div className="px-6 py-6 lg:px-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Events</h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Add, edit, or remove events in any homepage section.
          </p>
        </div>
        <Link
          to={`/admin/events/new?section=${sectionKey}`}
          className="inline-flex items-center gap-2 rounded-md bg-[#0F172A] px-4 py-2.5 text-[13px] font-bold text-white"
        >
          <Plus className="h-4 w-4" />
          Add event
        </Link>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {SECTION_META.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setParams({ section: s.key })}
            className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${
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
                className="flex items-center gap-3 border-t border-[#E2E8F0] px-4 py-3 first:border-t-0"
              >
                <img
                  src={event.image}
                  alt=""
                  className="h-14 w-20 shrink-0 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold text-[#0F172A]">
                    {event.title}
                  </p>
                  <p className="truncate text-[12px] text-[#64748B]">
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
