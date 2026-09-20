import Hero from '@/components/Hero';
import Story from '@/components/Story';
import Schedule from '@/components/Schedule';
import Venue from '@/components/Venue';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <Story />
      <Schedule />
      <Venue />
      <Gallery />
      <Footer />
    </main>
  );
}
