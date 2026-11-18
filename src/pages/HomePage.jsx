import MobileHeader from '../components/layout/MobileHeader';
import SectionHeader from '../components/sections/SectionHeader';
import HorizontalScroll from '../components/sections/HorizontalScroll';
import ForYouCard from '../components/cards/ForYouCard';
import EventCard from '../components/cards/EventCard';
import JustAnnouncedCard from '../components/cards/JustAnnouncedCard';
import CategoryCard from '../components/cards/CategoryCard';
import { SECTION_META, useCatalog } from '../context/CatalogContext';

function Section({ title, viewAllTo, children, className = '' }) {
  return (
    <section className={`mb-7 ${className}`}>
      <SectionHeader title={title} viewAllTo={viewAllTo} />
      <HorizontalScroll>{children}</HorizontalScroll>
    </section>
  );
}

function cardFor(meta, event) {
  if (meta.card === 'forYou') return <ForYouCard key={event.id} event={event} />;
  if (meta.card === 'justAnnounced') {
    return <JustAnnouncedCard key={event.id} event={event} />;
  }
  if (meta.card === 'category') {
    return <CategoryCard key={event.id} event={event} />;
  }
  return <EventCard key={event.id} event={event} />;
}

export default function HomePage() {
  const {
    sections,
    categoryLabels,
    loading,
    error,
    refresh,
  } = useCatalog();

  const hasContent = Object.values(sections).some((list) => list?.length);

  return (
    <div>
      <MobileHeader />

      {loading && !hasContent ? (
        <p className="px-4 py-10 text-center text-sm text-[#A0A0A0]">
          Loading events…
        </p>
      ) : null}
      {error && !hasContent ? (
        <div className="mx-4 mt-4 rounded-md border border-[#5A1A1A] bg-[#2A1212] px-4 py-3 text-sm text-[#F5C2C2]">
          <p>{error}</p>
          <button
            type="button"
            onClick={refresh}
            className="mt-2 font-semibold text-white underline"
          >
            Retry
          </button>
        </div>
      ) : null}

      <div className="pt-4 md:pt-6">
        {SECTION_META.map((meta) => {
          const events = sections[meta.key] || [];
          const title = categoryLabels[meta.path] || meta.label;
          if (meta.key === 'forYou') {
            return (
              <section key={meta.key} className="mb-7">
                <SectionHeader title={title} />
                <HorizontalScroll>
                  {events.map((event) => cardFor(meta, event))}
                </HorizontalScroll>
              </section>
            );
          }
          return (
            <Section
              key={meta.key}
              title={title}
              viewAllTo={`/category/${meta.path}`}
            >
              {events.map((event) => cardFor(meta, event))}
            </Section>
          );
        })}
      </div>
    </div>
  );
}
