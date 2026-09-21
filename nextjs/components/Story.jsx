import Image from 'next/image';
import Reveal from './Reveal';
import { story } from '@/lib/content';

export default function Story() {
  return (
    <section id="story" className="section story" aria-label="Our story">
      <div className="two-col" style={{ alignItems: 'center' }}>
        <Reveal className="story__photo">
          <Image
            src="/images/story.jpg"
            alt="Ian kissing Jane's forehead"
            fill
            sizes="(max-width: 700px) 100vw, 500px"
          />
        </Reveal>
        <Reveal delay={90}>
          <p className="eyebrow">{story.eyebrow}</p>
          <h2 className="serif">{story.heading}</h2>
          {story.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
