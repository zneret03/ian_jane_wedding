import Reveal from './Reveal';
import { schedule } from '@/lib/content';

export default function Schedule() {
  return (
    <section className="section schedule" aria-label="Schedule">
      <div className="schedule__inner">
        <Reveal>
          <p className="eyebrow">{schedule.eyebrow}</p>
          <h2 className="serif">{schedule.heading}</h2>
        </Reveal>

        <div className="schedule__list">
          {schedule.items.map((item, i) => (
            <Reveal key={item.time} className="schedule__row" delay={Math.min(i, 5) * 70}>
              <div className="schedule__time">{item.time}</div>
              <div>
                <div className="schedule__title">{item.title}</div>
                {item.detail ? <div className="schedule__detail">{item.detail}</div> : null}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
