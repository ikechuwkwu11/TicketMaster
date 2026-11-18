/**
 * Built-in fallback catalog used when the device is offline and no
 * previously synced API cache exists yet.
 */
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
  categoryLabels,
} from './events';
import { upcomingTickets, pastTickets } from './tickets';

export function getOfflineBootstrap() {
  return {
    sections: {
      forYou: forYouEvents,
      lastMinute: lastMinuteEvents,
      popularWeekend: popularWeekendEvents,
      justAnnounced: justAnnouncedEvents,
      concerts: concertArtists,
      sports: sportsEvents,
      arts: artsTheaterComedy,
      family: familyEvents,
      festivals: festivalEvents,
    },
    upcomingTickets,
    pastTickets,
    images: [],
    categoryLabels: { ...categoryLabels },
    _source: 'seed',
  };
}
