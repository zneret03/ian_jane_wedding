import { Cormorant_Garamond, Jost } from 'next/font/google';
import './globals.css';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const body = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: 'Jane & Ian — October 20, 2026',
  description:
    'Jane and Ian are getting married on Tuesday, October 20, 2026 at Kofi & Kompany, Molo, Iloilo City. RSVP here.',
  openGraph: {
    title: 'Jane & Ian — October 20, 2026',
    description: 'Kofi & Kompany, Molo, Iloilo City. Kindly RSVP.',
    images: ['/images/save-the-date.jpg'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#232D39',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
