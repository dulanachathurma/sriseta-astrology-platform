import HeroProfile from '../components/HeroProfile';
import ServicesSection from '../components/ServicesSection';
import WeeklyHoroscope from '../components/WeeklyHoroscope';
import DeveloperProfile from '../components/DeveloperProfile';
import Footer from '../components/Footer';

// Note: WeeklyHoroscope / DeveloperProfile / Footer used to be React.lazy +
// Suspense (code-split for a small performance win). That broke the navbar's
// scroll-spy: the IntersectionObserver sets itself up once on mount, but
// lazy sections don't exist in the DOM yet at that point, so their ids were
// never observed and those nav links never highlighted. Plain imports fix
// that — all sections exist immediately, so every nav link tracks correctly.
export default function Home() {
  return (
    <>
      <HeroProfile />
      <ServicesSection />
      <WeeklyHoroscope />
      <DeveloperProfile />
      <Footer />
    </>
  );
}