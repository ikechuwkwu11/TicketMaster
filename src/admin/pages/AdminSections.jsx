import { Link } from 'react-router-dom';
import { SECTION_META, useCatalog } from '../../context/CatalogContext';

export default function AdminSections() {
  const { sections, categoryLabels, updateCategoryLabel, resetCatalog } =
    useCatalog();

  return (
    <div className="px-4 py-5 sm:px-6 lg:px-8">
      <header className="mb-5 sm:mb-6">
        <h1 className="text-xl font-bold text-[#0F172A] sm:text-2xl">
          Homepage sections
        </h1>
        <p className="mt-1 text-[13px] text-[#64748B] sm:text-[14px]">
          Rename section labels and jump into each section&apos;s events.
        </p>
      </header>

      <div className="space-y-3">
        {SECTION_META.map((s) => (
          <div
            key={s.key}
            className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 sm:flex-row sm:flex-wrap sm:items-end"
          >
            <label className="w-full min-w-0 flex-1 sm:min-w-[220px]">
              <span className="text-[12px] font-bold text-[#334155]">
                Display name
              </span>
              <input
                value={categoryLabels[s.path] || s.label}
                onChange={(e) => updateCategoryLabel(s.path, e.target.value)}
                className="mt-1.5 w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2.5 text-[14px] text-[#0F172A]"
              />
            </label>
            <div className="text-[12px] leading-relaxed text-[#64748B] sm:pb-2 sm:text-[13px]">
              {(sections[s.key] || []).length} events · path{' '}
              <code className="break-all rounded bg-[#F1F5F9] px-1.5 py-0.5 text-[12px]">
                /category/{s.path}
              </code>
            </div>
            <Link
              to={`/admin/events?section=${s.key}`}
              className="inline-flex w-full items-center justify-center rounded-md bg-[#0F172A] px-4 py-2.5 text-[13px] font-bold text-white sm:w-auto"
            >
              Manage events
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-5">
        <h2 className="text-[15px] font-bold text-[#991B1B]">Reset app data</h2>
        <p className="mt-1 text-[13px] text-[#7F1D1D]">
          Restores the original sample events and tickets. Uploaded images stay
          in the image library.
        </p>
        <button
          type="button"
          onClick={async () => {
            if (
              !confirm(
                'Reset all events and tickets to the original sample data on the Django API?',
              )
            ) {
              return;
            }
            try {
              await resetCatalog();
              alert('Catalog reset on the server.');
            } catch (err) {
              alert(err.message || 'Reset failed — are you signed in as admin?');
            }
          }}
          className="mt-4 rounded-md bg-[#991B1B] px-4 py-2.5 text-[13px] font-bold text-white"
        >
          Reset catalog
        </button>
      </div>
    </div>
  );
}
