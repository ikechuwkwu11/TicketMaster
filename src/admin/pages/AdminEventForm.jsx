import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { SECTION_META, useCatalog } from '../../context/CatalogContext';
import ImageField from '../components/ImageField';

const emptyEvent = {
  title: '',
  slug: '',
  image: '',
  category: 'concerts',
  month: '',
  day: '',
  weekday: '',
  time: '',
  year: '',
  dateLabel: '',
  location: '',
  venue: '',
  accent: 'blue',
  eventCount: '',
  hasPresale: false,
};

export default function AdminEventForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { sections, saveEvent, slugify } = useCatalog();

  const initialSection = params.get('section') || 'forYou';
  const found = useMemo(() => {
    if (isNew) return null;
    for (const meta of SECTION_META) {
      const hit = (sections[meta.key] || []).find((e) => e.id === id);
      if (hit) return { event: hit, sectionKey: meta.key };
    }
    return null;
  }, [id, isNew, sections]);

  const [sectionKey, setSectionKey] = useState(
    found?.sectionKey || initialSection,
  );
  const [form, setForm] = useState(() =>
    found?.event
      ? {
          ...emptyEvent,
          ...found.event,
          eventCount:
            found.event.eventCount != null ? String(found.event.eventCount) : '',
        }
      : { ...emptyEvent, category: SECTION_META.find((s) => s.key === initialSection)?.path || 'concerts' },
  );

  const update = (key) => (e) => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert('Title is required.');
    if (!form.image.trim()) return alert('Image is required.');

    const payload = {
      ...form,
      id: form.id || found?.event?.id,
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      eventCount:
        form.eventCount === '' ? null : Number(form.eventCount) || 0,
    };

    try {
      await saveEvent(sectionKey, payload);
      navigate(`/admin/events?section=${sectionKey}`);
    } catch (err) {
      alert(err.message || 'Failed to save event');
    }
  };

  const field =
    'mt-1.5 w-full rounded-md border border-[#CBD5E1] px-3 py-2.5 text-[14px] outline-none focus:border-[#0F172A]';

  return (
    <div className="px-6 py-6 lg:px-8">
      <div className="mb-6">
        <Link to="/admin/events" className="text-[13px] font-semibold text-[#0369A1]">
          ← Back to events
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-[#0F172A]">
          {isNew ? 'Add event' : 'Edit event'}
        </h1>
      </div>

      <form
        onSubmit={onSubmit}
        className="mx-auto max-w-3xl space-y-4 rounded-xl border border-[#E2E8F0] bg-white p-5"
      >
        <label className="block">
          <span className="text-[12px] font-bold text-[#334155]">Homepage section</span>
          <select
            value={sectionKey}
            onChange={(e) => {
              setSectionKey(e.target.value);
              const meta = SECTION_META.find((s) => s.key === e.target.value);
              if (meta) setForm((p) => ({ ...p, category: meta.path }));
            }}
            className={field}
          >
            {SECTION_META.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-[12px] font-bold text-[#334155]">Title</span>
          <input value={form.title} onChange={update('title')} className={field} required />
        </label>

        <label className="block">
          <span className="text-[12px] font-bold text-[#334155]">Slug (URL)</span>
          <input
            value={form.slug}
            onChange={update('slug')}
            placeholder="auto-from-title"
            className={field}
          />
        </label>

        <ImageField value={form.image} onChange={(v) => setForm((p) => ({ ...p, image: v }))} />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[12px] font-bold text-[#334155]">Date label</span>
            <input
              value={form.dateLabel}
              onChange={update('dateLabel')}
              placeholder="Fri 20 Nov"
              className={field}
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold text-[#334155]">Time</span>
            <input value={form.time} onChange={update('time')} placeholder="8:00 PM" className={field} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <label className="block">
            <span className="text-[12px] font-bold text-[#334155]">Month</span>
            <input value={form.month} onChange={update('month')} placeholder="APR" className={field} />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold text-[#334155]">Day</span>
            <input value={form.day} onChange={update('day')} placeholder="01" className={field} />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold text-[#334155]">Weekday</span>
            <input value={form.weekday} onChange={update('weekday')} placeholder="Thursday" className={field} />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold text-[#334155]">Year</span>
            <input value={form.year} onChange={update('year')} placeholder="2027" className={field} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[12px] font-bold text-[#334155]">Venue</span>
            <input value={form.venue} onChange={update('venue')} className={field} />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold text-[#334155]">Location</span>
            <input value={form.location} onChange={update('location')} className={field} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-[12px] font-bold text-[#334155]">Accent</span>
            <select value={form.accent} onChange={update('accent')} className={field}>
              <option value="blue">Blue</option>
              <option value="orange">Orange</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[12px] font-bold text-[#334155]">Event count</span>
            <input
              type="number"
              min="0"
              value={form.eventCount}
              onChange={update('eventCount')}
              placeholder="for category cards"
              className={field}
            />
          </label>
          <label className="flex items-end gap-2 pb-3">
            <input
              type="checkbox"
              checked={!!form.hasPresale}
              onChange={update('hasPresale')}
              className="h-4 w-4"
            />
            <span className="text-[13px] font-semibold text-[#334155]">Has presale</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            to={`/admin/events?section=${sectionKey}`}
            className="rounded-md px-4 py-2.5 text-[13px] font-bold text-[#475569]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-md bg-[#0F172A] px-5 py-2.5 text-[13px] font-bold text-white"
          >
            Save event
          </button>
        </div>
      </form>
    </div>
  );
}
