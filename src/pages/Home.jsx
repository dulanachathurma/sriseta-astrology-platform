import { useState } from 'react';
import HeroProfile from '../components/HeroProfile';
import ServicesSection from '../components/ServicesSection';
import WeeklyHoroscope from '../components/WeeklyHoroscope';
import DeveloperProfile from '../components/DeveloperProfile';
import Footer from '../components/Footer';

// ඔබගේ ServiceForm component එක import කිරීම
import ServiceForm from '../components/ServiceForm'; 

export default function Home({ isBookingOpen, setIsBookingOpen }) {
  return (
    <>
      <HeroProfile />
      <ServicesSection />
      <WeeklyHoroscope />
      <DeveloperProfile />
      <Footer />

      {/* Nav bar එකෙන් 'සම්බන්ධ වන්න' Click කල විට Form එක Open වේ */}
      {isBookingOpen && (
        <ServiceForm onClose={() => setIsBookingOpen(false)} />
      )}
    </>
  );
}
