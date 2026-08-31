import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import PromoBar from './components/PromoBar.jsx';
import NavBar from './components/NavBar.jsx';
import Footer from './components/Footer.jsx';
import ChatWidget from './components/ChatWidget.jsx';
import { BackgroundFX, ScrollProgress } from './components/BackgroundFX.jsx';

import Home from './pages/Home.jsx';
import PackageListing from './pages/PackageListing.jsx';
import Flights from './pages/Flights.jsx';
import PackageDetail from './pages/PackageDetail.jsx';
import Booking from './pages/Booking.jsx';
import MyBookings from './pages/MyBookings.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import BackOffice from './pages/BackOffice.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  const isOffice = location.pathname.startsWith('/office');

  return (
    <div style={{ background: 'transparent', position: 'relative', minHeight: '100vh' }}>
      <ScrollToTop />
      <BackgroundFX />
      {!isOffice && <ScrollProgress />}
      {!isOffice && <PromoBar />}
      {!isOffice && <NavBar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/umrah" element={<PackageListing cat="umrah" />} />
        <Route path="/rodrigues" element={<PackageListing cat="rodrigues" />} />
        <Route path="/holidays" element={<PackageListing cat="holidays" />} />
        <Route path="/cruises" element={<PackageListing cat="cruises" />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/package/:id" element={<PackageDetail />} />
        <Route path="/book/:id" element={<Booking />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/office" element={<BackOffice />} />
        <Route path="*" element={<Home />} />
      </Routes>

      {!isOffice && <Footer />}
      {!isOffice && <ChatWidget />}
    </div>
  );
}
