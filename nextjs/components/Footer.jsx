import RsvpButton from './RsvpButton';
import Reveal from './Reveal';
import { couple } from '@/lib/content';

export default function Footer() {
  return (
    <footer className="footer">
      <Reveal>
        <p className="footer__deadline">{couple.rsvpDeadline}</p>
        <div className="footer__cta">
          <RsvpButton variant="light" />
        </div>
        <p className="footer__meta">{couple.footer}</p>
      </Reveal>
    </footer>
  );
}
