/**
 * Sample event data shaped for future Django REST Framework integration.
 * Fields mirror typical DRF serializers: id, slug, title, image, datetime, venue, etc.
 * Images are served from /public/images for reliability.
 */

export const forYouEvents = [
  {
    id: 'fy-1',
    slug: 'hans-zimmer-live-2027',
    title: 'HANS ZIMMER',
    image: '/images/hans-zimmer.jpg',
    month: 'APR',
    day: '01',
    weekday: 'Thursday',
    time: '7:30PM',
    year: '2027',
    location: 'Los Angeles, US - Crypto.com Arena',
    accent: 'blue',
    category: 'concerts',
  },
  {
    id: 'fy-2',
    slug: 'dancing-with-the-stars',
    title: 'DANCING WITH THE STARS',
    image: '/images/dancing.jpg',
    month: 'APR',
    day: '02',
    weekday: 'Friday',
    time: '8:00PM',
    year: '2027',
    location: 'Los Angeles, US - Hollywood Bowl',
    accent: 'orange',
    category: 'arts',
  },
  {
    id: 'fy-3',
    slug: 'billie-eilish-hit-me-hard',
    title: 'BILLIE EILISH',
    image: '/images/billie.jpg',
    month: 'MAY',
    day: '14',
    weekday: 'Saturday',
    time: '8:00PM',
    year: '2027',
    location: 'Inglewood, US - SoFi Stadium',
    accent: 'blue',
    category: 'concerts',
  },
];

export const lastMinuteEvents = [
  {
    id: 'lm-1',
    slug: 'static-dress-regent',
    title: 'STATIC DRESS',
    image: '/images/static-dress.jpg',
    dateLabel: 'Tue 17 Nov',
    time: '7:00 PM',
    venue: 'The Regent Theater',
    location: 'Los Angeles, CA',
    category: 'concerts',
  },
  {
    id: 'lm-2',
    slug: 'troy-kingi-lodge-room',
    title: 'TROY KINGI',
    image: '/images/troy-kingi.jpg',
    dateLabel: 'Tue 17 Nov',
    time: '8:00 PM',
    venue: 'Lodge Room',
    location: 'Los Angeles, CA',
    category: 'concerts',
  },
  {
    id: 'lm-3',
    slug: 'local-natives-wiltern',
    title: 'LOCAL NATIVES',
    image: '/images/local-natives.jpg',
    dateLabel: 'Wed 18 Nov',
    time: '8:00 PM',
    venue: 'The Wiltern',
    location: 'Los Angeles, CA',
    category: 'concerts',
  },
];

export const popularWeekendEvents = [
  {
    id: 'pw-1',
    slug: 'late-night-thoughts',
    title: 'LATE NIGHT THOUGHTS',
    image: '/images/late-night.jpg',
    dateLabel: 'Fri 20 Nov',
    time: '9:30 PM',
    venue: 'The Moroccan Lounge',
    location: 'Los Angeles, CA',
    category: 'concerts',
  },
  {
    id: 'pw-2',
    slug: 'apashe',
    title: 'APASHE',
    image: '/images/apashe.jpg',
    dateLabel: 'Sat 21 Nov',
    time: '9:00 PM',
    venue: 'Academy LA',
    location: 'Los Angeles, CA',
    category: 'concerts',
  },
  {
    id: 'pw-3',
    slug: 'glass-animals',
    title: 'GLASS ANIMALS',
    image: '/images/glass-animals.jpg',
    dateLabel: 'Sun 22 Nov',
    time: '8:00 PM',
    venue: 'The Forum',
    location: 'Inglewood, CA',
    category: 'concerts',
  },
];

export const justAnnouncedEvents = [
  {
    id: 'ja-1',
    slug: 'dynamicduo-2027-us-tour',
    title: 'DYNAMICDUO 2027 US TOUR',
    image: '/images/dynamicduo.jpg',
    dateLabel: 'Sun 31 Jan',
    time: '7:30 PM',
    venue: 'Los Angeles, CA',
    location: 'Los Angeles, CA',
    hasPresale: true,
    category: 'concerts',
  },
  {
    id: 'ja-2',
    slug: 'coldplay-music-of-spheres',
    title: 'COLDPLAY - MUSIC OF THE SPHERES',
    image: '/images/coldplay.jpg',
    dateLabel: 'Sat 12 Jun',
    time: '7:00 PM',
    venue: 'Rose Bowl',
    location: 'Pasadena, CA',
    hasPresale: true,
    category: 'concerts',
  },
  {
    id: 'ja-3',
    slug: 'taylor-swift-eras',
    title: 'TAYLOR SWIFT | THE ERAS TOUR',
    image: '/images/taylor.jpg',
    dateLabel: 'Fri 20 Aug',
    time: '6:30 PM',
    venue: 'SoFi Stadium',
    location: 'Inglewood, CA',
    hasPresale: true,
    category: 'concerts',
  },
];

export const concertArtists = [
  {
    id: 'c-1',
    slug: 'system-of-a-down',
    title: 'SYSTEM OF A DOWN',
    image: '/images/soad.jpg',
    eventCount: 4,
    category: 'concerts',
  },
  {
    id: 'c-2',
    slug: 'twenty-one-pilots',
    title: 'TWENTY ONE PILOTS',
    image: '/images/top.jpg',
    eventCount: 1,
    category: 'concerts',
  },
  {
    id: 'c-3',
    slug: 'metallica',
    title: 'METALLICA',
    image: '/images/metallica.jpg',
    eventCount: 3,
    category: 'concerts',
  },
];

export const sportsEvents = [
  {
    id: 's-1',
    slug: 'los-angeles-dodgers',
    title: 'LOS ANGELES DODGERS',
    image: '/images/dodgers.jpg',
    eventCount: 81,
    category: 'sports',
  },
  {
    id: 's-2',
    slug: 'pbr-team-series',
    title: 'PBR: TEAM SERIES',
    image: '/images/pbr.jpg',
    eventCount: 1,
    category: 'sports',
  },
  {
    id: 's-3',
    slug: 'la-lakers',
    title: 'LOS ANGELES LAKERS',
    image: '/images/lakers.jpg',
    eventCount: 41,
    category: 'sports',
  },
];

export const artsTheaterComedy = [
  {
    id: 'atc-1',
    slug: 'mojo-brookzz',
    title: 'MOJO BROOKZZ',
    image: '/images/mojo.jpg',
    eventCount: 2,
    category: 'arts',
  },
  {
    id: 'atc-2',
    slug: 'jo-koy',
    title: 'JO KOY',
    image: '/images/jokoy.jpg',
    eventCount: 1,
    category: 'arts',
  },
  {
    id: 'atc-3',
    slug: 'dave-chappelle',
    title: 'DAVE CHAPPELLE',
    image: '/images/chappelle.jpg',
    eventCount: 3,
    category: 'arts',
  },
];

export const familyEvents = [
  {
    id: 'f-1',
    slug: 'disney-on-ice',
    title: 'DISNEY ON ICE PRESENT...',
    image: '/images/disney.jpg',
    eventCount: 10,
    category: 'family',
  },
  {
    id: 'f-2',
    slug: 'harlem-globetrotters',
    title: 'HARLEM GLOBETROTTERS',
    image: '/images/globetrotters.jpg',
    eventCount: 2,
    category: 'family',
  },
  {
    id: 'f-3',
    slug: 'sesame-street-live',
    title: 'SESAME STREET LIVE',
    image: '/images/sesame.jpg',
    eventCount: 5,
    category: 'family',
  },
];

export const festivalEvents = [
  {
    id: 'fest-1',
    slug: 'dreamstate',
    title: 'DREAMSTATE',
    image: '/images/dreamstate.jpg',
    eventCount: 2,
    category: 'festivals',
  },
  {
    id: 'fest-2',
    slug: 'time-warp-la',
    title: 'TIME WARP LA',
    image: '/images/timewarp.jpg',
    eventCount: 2,
    category: 'festivals',
  },
  {
    id: 'fest-3',
    slug: 'coachella',
    title: 'COACHELLA',
    image: '/images/coachella.jpg',
    eventCount: 1,
    category: 'festivals',
  },
];

/** Flattened catalog for search + detail pages */
export const allEvents = [
  ...forYouEvents,
  ...lastMinuteEvents,
  ...popularWeekendEvents,
  ...justAnnouncedEvents,
  ...concertArtists,
  ...sportsEvents,
  ...artsTheaterComedy,
  ...familyEvents,
  ...festivalEvents,
];

export const categoryLabels = {
  concerts: 'Concerts',
  sports: 'Sports',
  arts: 'Arts, Theater & Comedy',
  family: 'Family',
  festivals: 'Festivals',
  'last-minute': 'Last Minute',
  'popular-weekend': 'Popular This Weekend',
  'just-announced': 'Just Announced',
  'for-you': 'For You',
};

export function getEventBySlug(slug) {
  return allEvents.find((e) => e.slug === slug);
}

export function getEventsByCategory(category) {
  const map = {
    concerts: concertArtists,
    sports: sportsEvents,
    arts: artsTheaterComedy,
    family: familyEvents,
    festivals: festivalEvents,
    'last-minute': lastMinuteEvents,
    'popular-weekend': popularWeekendEvents,
    'just-announced': justAnnouncedEvents,
    'for-you': forYouEvents,
  };
  return map[category] || allEvents.filter((e) => e.category === category);
}

export function searchEvents(query) {
  if (!query?.trim()) return [];
  const q = query.toLowerCase().trim();
  return allEvents.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      e.venue?.toLowerCase().includes(q) ||
      e.location?.toLowerCase().includes(q) ||
      e.category?.toLowerCase().includes(q),
  );
}
