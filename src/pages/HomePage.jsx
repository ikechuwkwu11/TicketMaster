import MobileHeader from '../components/layout/MobileHeader';
import SectionHeader from '../components/sections/SectionHeader';
import HorizontalScroll from '../components/sections/HorizontalScroll';
import ForYouCard from '../components/cards/ForYouCard';
import EventCard from '../components/cards/EventCard';
import JustAnnouncedCard from '../components/cards/JustAnnouncedCard';
import CategoryCard from '../components/cards/CategoryCard';
import {
  forYouEvents,
  lastMinuteEvents,
  popularWeekendEvents,
  justAnnouncedEvents,
  concertArtists,
  sportsEvents,
  artsTheaterComedy,
  familyEvents,
  festivalEvents,
} from '../data/events';

function Section({ title, viewAllTo, children, className = '' }) {
  return (
    <section className={`mb-7 ${className}`}>
      <SectionHeader title={title} viewAllTo={viewAllTo} />
      <HorizontalScroll>{children}</HorizontalScroll>
    </section>
  );
}

export default function HomePage() {
  return (
    <div>
      <MobileHeader />

      <div className="pt-4 md:pt-6">
        {/* For You — no View All in screenshots */}
        <section className="mb-7">
          <SectionHeader title="For You" />
          <HorizontalScroll>
            {forYouEvents.map((event) => (
              <ForYouCard key={event.id} event={event} />
            ))}
          </HorizontalScroll>
        </section>

        <Section title="Last Minute" viewAllTo="/category/last-minute">
          {lastMinuteEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </Section>

        <Section
          title="Popular This Weekend"
          viewAllTo="/category/popular-weekend"
        >
          {popularWeekendEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </Section>

        <Section title="Just Announced" viewAllTo="/category/just-announced">
          {justAnnouncedEvents.map((event) => (
            <JustAnnouncedCard key={event.id} event={event} />
          ))}
        </Section>

        <Section title="Concerts" viewAllTo="/category/concerts">
          {concertArtists.map((event) => (
            <CategoryCard key={event.id} event={event} />
          ))}
        </Section>

        <Section title="Sports" viewAllTo="/category/sports">
          {sportsEvents.map((event) => (
            <CategoryCard key={event.id} event={event} />
          ))}
        </Section>

        <Section
          title="Arts, Theater & Comedy"
          viewAllTo="/category/arts"
        >
          {artsTheaterComedy.map((event) => (
            <CategoryCard key={event.id} event={event} />
          ))}
        </Section>

        <Section title="Family" viewAllTo="/category/family">
          {familyEvents.map((event) => (
            <CategoryCard key={event.id} event={event} />
          ))}
        </Section>

        <Section title="Festivals" viewAllTo="/category/festivals">
          {festivalEvents.map((event) => (
            <CategoryCard key={event.id} event={event} />
          ))}
        </Section>
      </div>
    </div>
  );
}
