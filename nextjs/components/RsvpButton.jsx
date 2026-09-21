import { RSVP_URL } from '@/lib/content';

export default function RsvpButton({ variant = 'dark', children = 'RSVP' }) {
  return (
    <a
      href={RSVP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn--${variant}`}
    >
      {children}
    </a>
  );
}
