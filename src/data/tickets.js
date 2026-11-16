/**
 * Sample owned-ticket / order data for My Events + View Tickets.
 * Shaped for future Django REST Framework integration.
 */

function makeSeats(section, row, startSeat, count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `seat-${section}-${row}-${startSeat + i}`,
    type: 'Custom Admission',
    section: String(section),
    row: String(row),
    seat: String(startSeat + i),
  }));
}

export const upcomingTickets = [
  {
    id: 't-1',
    slug: 'noah-kahan-last-of-the-bugs',
    title: 'NOAH KAHAN: THE LAST OF THE BUGS WORLD TOUR',
    displayTitle: 'Noah Kahan: The Last of the Bugs World Tour',
    image: '/images/noah-kahan.jpg',
    dateLabel: 'SAT • JUN 12, 2027 • 6:30 PM',
    venue: 'Highmark Stadium - Orchard Park, NY',
    venueShort: 'Highmark Stadium Orchard Park',
    quantity: 4,
    orderNumber: '12-44102/HMS',
    seats: makeSeats(112, 'F', 8, 4),
    mapQuery: 'Highmark Stadium Orchard Park NY',
    mapEmbed:
      'https://www.openstreetmap.org/export/embed.html?bbox=-78.880%2C42.768%2C-78.850%2C42.788&layer=mapnik&marker=42.778%2C-78.865',
  },
  {
    id: 't-2',
    slug: 'olivia-rodrigo-unraveled-tour',
    title: 'OLIVIA RODRIGO: THE UNRAVELED TOUR',
    displayTitle: 'Olivia Rodrigo: The Unraveled Tour',
    image: '/images/olivia-rodrigo.jpg',
    dateLabel: 'SAT • DEC 19, 2026 • 7:00 PM',
    venue: 'TMobile Arena Las Vegas',
    venueShort: 'TMobile Arena Las Vegas',
    quantity: 4,
    orderNumber: '12-68027/TMO',
    seats: makeSeats(10, 'C', 3, 4),
    mapQuery: 'T-Mobile Arena Las Vegas',
    mapEmbed:
      'https://www.openstreetmap.org/export/embed.html?bbox=-115.195%2C36.092%2C-115.162%2C36.114&layer=mapnik&marker=36.1028%2C-115.1782',
  },
  {
    id: 't-3',
    slug: 'the-weeknd-after-hours',
    title: 'THE WEEKND: AFTER HOURS TIL DAWN TOUR',
    displayTitle: 'The Weeknd: After Hours Til Dawn Tour',
    image: '/images/the-weeknd.jpg',
    dateLabel: 'SAT • AUG 15, 2027 • 7:00 PM',
    venue: 'SoFi Stadium - Inglewood, CA',
    venueShort: 'SoFi Stadium Inglewood',
    quantity: 3,
    orderNumber: '12-90311/SFI',
    seats: makeSeats(214, 'A', 1, 3),
    mapQuery: 'SoFi Stadium Inglewood',
    mapEmbed:
      'https://www.openstreetmap.org/export/embed.html?bbox=-118.350%2C33.945%2C-118.325%2C33.962&layer=mapnik&marker=33.9535%2C-118.3392',
  },
  {
    id: 't-4',
    slug: 'bad-bunny-most-wanted',
    title: 'BAD BUNNY: MOST WANTED TOUR',
    displayTitle: 'Bad Bunny: Most Wanted Tour',
    image: '/images/bad-bunny.jpg',
    dateLabel: 'SUN • SEP 06, 2027 • 8:00 PM',
    venue: 'Allegiant Stadium - Las Vegas, NV',
    venueShort: 'Allegiant Stadium Las Vegas',
    quantity: 2,
    orderNumber: '12-77140/ALG',
    seats: makeSeats(18, 'B', 11, 2),
    mapQuery: 'Allegiant Stadium Las Vegas',
    mapEmbed:
      'https://www.openstreetmap.org/export/embed.html?bbox=-115.195%2C36.082%2C-115.170%2C36.098&layer=mapnik&marker=36.0908%2C-115.1833',
  },
];

export const pastTickets = [
  {
    id: 't-5',
    slug: 'beyonce-renaissance',
    title: 'BEYONCÉ: RENAISSANCE WORLD TOUR',
    displayTitle: 'Beyoncé: Renaissance World Tour',
    image: '/images/beyonce.jpg',
    dateLabel: 'SAT • MAR 08, 2025 • 7:30 PM',
    venue: 'MetLife Stadium - East Rutherford, NJ',
    venueShort: 'MetLife Stadium East Rutherford',
    quantity: 2,
    orderNumber: '11-22018/MLF',
    seats: makeSeats(130, 'D', 5, 2),
    mapQuery: 'MetLife Stadium East Rutherford',
    mapEmbed:
      'https://www.openstreetmap.org/export/embed.html?bbox=-74.085%2C40.805%2C-74.065%2C40.820&layer=mapnik&marker=40.8128%2C-74.0742',
  },
  {
    id: 't-6',
    slug: 'drake-its-all-a-blur',
    title: "DRAKE: IT'S ALL A BLUR TOUR",
    displayTitle: "Drake: It's All A Blur Tour",
    image: '/images/drake.jpg',
    dateLabel: 'FRI • NOV 14, 2025 • 8:00 PM',
    venue: 'Crypto.com Arena - Los Angeles, CA',
    venueShort: 'Crypto.com Arena Los Angeles',
    quantity: 4,
    orderNumber: '11-55890/CCA',
    seats: makeSeats(101, 'G', 1, 4),
    mapQuery: 'Crypto.com Arena Los Angeles',
    mapEmbed:
      'https://www.openstreetmap.org/export/embed.html?bbox=-118.275%2C34.035%2C-118.255%2C34.050&layer=mapnik&marker=34.0430%2C-118.2673',
  },
  {
    id: 't-7',
    slug: 'sza-sos-tour',
    title: 'SZA: SOS TOUR',
    displayTitle: 'SZA: SOS Tour',
    image: '/images/sza.jpg',
    dateLabel: 'THU • JAN 22, 2026 • 8:00 PM',
    venue: 'The Forum - Inglewood, CA',
    venueShort: 'The Forum Inglewood',
    quantity: 1,
    orderNumber: '11-90112/FRM',
    seats: makeSeats(8, 'K', 14, 1),
    mapQuery: 'The Forum Inglewood',
    mapEmbed:
      'https://www.openstreetmap.org/export/embed.html?bbox=-118.350%2C33.950%2C-118.330%2C33.965&layer=mapnik&marker=33.9582%2C-118.3419',
  },
];

export function getTicketBySlug(slug) {
  return [...upcomingTickets, ...pastTickets].find((t) => t.slug === slug);
}
