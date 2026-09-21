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

// Facebook, Messenger and iMessage need an absolute image URL. Without this,
// Next falls back to http://localhost:3000 and no preview renders.
const SITE_URL = 'https://ianjanewedding.vercel.app';

const SHARE_TITLE = 'Jane & Ian — October 20, 2026';
const SHARE_TEXT = 'Kofi & Kompany, Molo, Iloilo City. Kindly RSVP.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: SHARE_TITLE,
  description:
    'Jane and Ian are getting married on Tuesday, October 20, 2026 at Kofi & Kompany, Molo, Iloilo City. RSVP here.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Jane & Ian',
    title: SHARE_TITLE,
    description: SHARE_TEXT,
    // og-hero.jpg is a 1200×630 snapshot of the hero — see the README.
    images: [
      {
        url: '/images/og-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Save the Date — Jane & Ian, October 20, 2026, Kofi & Kompany, Molo, Iloilo City',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SHARE_TITLE,
    description: SHARE_TEXT,
    images: ['/images/og-hero.jpg'],
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
