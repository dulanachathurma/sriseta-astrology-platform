import { useState } from 'react';
import HeroProfile from '../components/HeroProfile';
import ServicesSection from '../components/ServicesSection';
import WeeklyHoroscope from '../components/WeeklyHoroscope';
import DeveloperProfile from '../components/DeveloperProfile';
import Footer from '../components/Footer';

// IMPORTANT: ඔයාගේ "සේවා වෙන්කරවා ගැනීම" Form Component එක මෙතනට Import කරගන්න.
// (කරුණාකර Form එක තියෙන file path එක අනුව පහත line එකේ path එක වෙනස් කරගන්න)
import BookingModal from '../components/BookingModal'; 

export default function Home({ isBookingOpen, setIsBookingOpen }) {
  return (
    <>
      <HeroProfile />
      <ServicesSection />
      <WeeklyHoroscope />
      <DeveloperProfile />
      <Footer />

      {/* Nav bar එකෙන් 'සම්බන්ධ වන්න' Click කල විට Form එක Popup වේ */}
      {isBookingOpen && (
        <BookingModal onClose={() => setIsBookingOpen(false)} />
      )}
    </>
  );
}
