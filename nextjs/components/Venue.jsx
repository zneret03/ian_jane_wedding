import Reveal from './Reveal';
import { venue, dressCode } from '@/lib/content';

export default function Venue() {
  return (
    <section className="section venue" aria-label="Venue and dress code">
      <div className="two-col">
        <Reveal>
          <p className="eyebrow">{venue.eyebrow}</p>
          <h2 className="serif">{venue.name}</h2>
          <p className="venue__address">
            {venue.address.map((line, i) => (
              <span key={line}>
                {line}
                {i < venue.address.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
          <p className="venue__parking">{venue.parking}</p>
          <a href={venue.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn--outline">
            Open in maps
          </a>

          <div className="dress">
            <p className="eyebrow">{dressCode.eyebrow}</p>
            <p className="dress__heading">{dressCode.heading}</p>
            <p className="dress__body">{dressCode.body}</p>
            <div className="dress__palette">
              {dressCode.palette.map((hex) => (
                <div
                  key={hex}
                  className="dress__swatch"
                  title={hex}
                  style={{ background: hex }}
                />
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="venue__map" delay={90}>
          <iframe
            src={venue.embedUrl}
            title="Map to Kofi & Kompany, Molo, Iloilo City"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </div>
    </section>
  );
}
