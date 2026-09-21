import Image from 'next/image';
import RsvpButton from './RsvpButton';
import { couple } from '@/lib/content';

export default function Hero() {
  return (
    <section className="hero" aria-label="Invitation">
      <div className="hero__band">
        <div className="hero__photos">
          <div className="hero__photo">
            <Image src="/images/hero-left.jpg" alt="Jane and Ian on the terrace" fill priority sizes="50vw" />
          </div>
          <div className="hero__photo">
            <Image src="/images/hero-right.jpg" alt="Jane and Ian looking at each other" fill priority sizes="50vw" />
          </div>
        </div>

        <div className="hero__card">
          <Image
            src="/images/save-the-date.jpg"
            alt={`Save the Date — Jane and Ian, ${couple.date}, ${couple.venue}, ${couple.time}`}
            width={1000}
            height={1400}
            priority
          />
        </div>
      </div>

      <div className="hero__plate">
        <h1 className="serif hero__names">{couple.names}</h1>

        <div style={{ marginTop: 30, display: 'flex', justifyContent: 'center' }}>
          <RsvpButton variant="dark" />
        </div>
        <p className="hero__note">Attending or not, please let us know</p>

        <dl className="hero__facts">
          <div>
            <dt>Hosted by</dt>
            <dd>{couple.host}</dd>
          </div>
          <div>
            <dt>{couple.date}</dt>
            <dd>{couple.time}</dd>
          </div>
          <div>
            <dt>{couple.venue}</dt>
            <dd>{couple.city}</dd>
          </div>
        </dl>

        <a href="#story" className="hero__more">
          Details below
        </a>
      </div>
    </section>
  );
}
