// Single source of truth for every piece of copy on the site.
// Edit here — the components read from this file.

export const RSVP_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdFtklwyGnJzq25Fr7V38BKnvVaUdIshEKZRs74-po9B6mGwg/viewform';

export const couple = {
  names: 'JANE & IAN',
  date: 'Tuesday, October 20, 2026',
  time: '5:00 PM',
  venue: 'Kofi & Kompany',
  city: 'Molo, Iloilo City',
  host: 'Kofi Company',
  rsvpDeadline: 'Kindly reply by September 20',
  footer: 'Jane & Ian · October 20, 2026 · Kofi & Ko. Avancena Molo',
};

export const story = {
  eyebrow: 'Our story',
  heading: 'How we got here',
  paragraphs: [
    'Replace this with your story — where you met, the moment you knew, and what you\u2019re looking forward to. Two or three short paragraphs reads best here.',
    'We would love to have you with us for it.',
  ],
};

export const schedule = {
  eyebrow: 'The day',
  heading: 'Tuesday, October 20',
  items: [
    { time: '4:20 PM', title: 'Guest arriving' },
    { time: '5:00 PM', title: 'Program start' },
    { time: '6:00 PM', title: 'Buffet open' },
    { time: '7:00 PM', title: 'Picture taking' },
    { time: '7:45 PM', title: 'Toast', detail: 'Couple\u2019s thank you message' },
    { time: '8:00 PM', title: 'End of program' },
  ],
};

export const venue = {
  eyebrow: 'Getting there',
  name: 'Kofi & Kompany',
  address: ['Avance\u00f1a Street, Molo', 'Iloilo City, Philippines'],
  parking:
    'On-site parking is limited, so carpooling is welcome. There is additional street parking along Avance\u00f1a Street, and drop-off is at the main entrance.',
  mapsUrl:
    'https://www.google.com/maps/place/Kofi+%26+kompany/@10.6936355,122.5351867,1164m/data=!3m2!1e3!4b1!4m6!3m5!1s0x33aef14be0fbc6e9:0x43c1fdbf7808e85d!8m2!3d10.6936355!4d122.5377616!16s%2Fg%2F11sx6yjdd0',
  embedUrl: 'https://maps.google.com/maps?q=10.6936355,122.5377616&z=17&output=embed',
};

export const dressCode = {
  eyebrow: 'Dress code',
  heading: 'Best casual garden party attire',
  body: 'We encourage our guest to wear their best casual garden party attire. You may refer to these colors on our special day. Avoid wearing or black',
  palette: ['#232D39', '#4F2427', '#6D3C35', '#8D6339', '#C1B394', '#906560'],
};

export const gallery = {
  eyebrow: 'Us, lately',
  photos: [
    { src: '/images/gallery-1.jpg', alt: 'Jane and Ian holding hands' },
    { src: '/images/gallery-2.jpg', alt: 'Ian kissing Jane\u2019s forehead' },
    { src: '/images/gallery-3.jpg', alt: 'Jane and Ian on the terrace' },
    { src: '/images/gallery-4.jpg', alt: 'Jane and Ian looking at each other' },
  ],
};
