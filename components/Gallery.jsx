import Image from 'next/image';
import Reveal from './Reveal';
import { gallery } from '@/lib/content';

export default function Gallery() {
  return (
    <section className="section gallery" aria-label="Photos">
      <div className="gallery__inner">
        <Reveal>
          <p className="eyebrow gallery__eyebrow">{gallery.eyebrow}</p>
        </Reveal>

        <div className="gallery__grid">
          {gallery.photos.map((photo, i) => (
            <Reveal key={photo.src} className="print" delay={Math.min(i, 5) * 90}>
              <div className="print__frame">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 700px) 50vw, 270px"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
