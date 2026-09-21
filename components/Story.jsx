'use client';

import { useState } from 'react';
import Image from 'next/image';
import Reveal from './Reveal';
import { story } from '@/lib/content';

// How a card sits in the pile, indexed by its distance from the active chapter.
const PILE = [
  { x: 0, y: 0, rotate: -1.6, scale: 1, z: 40 },
  { x: 16, y: 11, rotate: 3.4, scale: 0.96, z: 30 },
  { x: -13, y: 21, rotate: -4.8, scale: 0.93, z: 20 },
  { x: 21, y: 30, rotate: 6.6, scale: 0.9, z: 10 },
];

const pad = (n) => String(n).padStart(2, '0');

export default function Story() {
  const { chapters } = story;
  const [active, setActive] = useState(0);
  const chapter = chapters[active];

  const next = () => setActive((index) => (index + 1) % chapters.length);

  return (
    <section id="story" className="section story" aria-label="Our story">
      <div className="two-col">
        <Reveal className="story__pile">
          {/* The whole pile is one control: click or Enter/Space deals the next print. */}
          <div
            className="stack"
            role="button"
            tabIndex={0}
            aria-label={`${chapter.title} — chapter ${active + 1} of ${chapters.length}. Show the next chapter.`}
            onClick={next}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                next();
              }
            }}
          >
            {chapters.map((item, index) => {
              const offset = (index - active + chapters.length) % chapters.length;
              const pose = PILE[offset];
              const isFront = offset === 0;

              return (
                <figure
                  key={item.src}
                  className={`stack__card${isFront ? ' is-front' : ''}`}
                  aria-hidden={!isFront}
                  style={{
                    transform: `translate(${pose.x}px, ${pose.y}px) rotate(${pose.rotate}deg) scale(${pose.scale})`,
                    zIndex: pose.z,
                    filter: `grayscale(${isFront ? 0 : 1})`,
                  }}
                >
                  <Image
                    className="stack__photo"
                    src={item.src}
                    alt={item.alt}
                    width={760}
                    height={950}
                  />
                  <figcaption className="stack__caption serif" style={{ opacity: isFront ? 1 : 0 }}>
                    {item.caption}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={90}>
          <p className="eyebrow">{story.eyebrow}</p>
          <h2 className="serif">{story.heading}</h2>

          <p className="story__count">
            <span>
              {pad(active + 1)} / {pad(chapters.length)}
            </span>
            <span className="story__rule" aria-hidden="true" />
          </p>

          <h3 className="serif story__title">{chapter.title}</h3>
          <p className="story__text">{chapter.text}</p>

          <div className="story__dots">
            {chapters.map((item, index) => (
              <button
                key={item.src}
                type="button"
                className={`story__dot${index === active ? ' is-on' : ''}`}
                aria-label={item.title}
                aria-current={index === active}
                onClick={() => setActive(index)}
              />
            ))}
          </div>

          <div className="story__actions">
            <button type="button" className="btn--outline story__next" onClick={next}>
              {story.nextLabel}
            </button>
            <span className="story__hint">{story.hint}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
