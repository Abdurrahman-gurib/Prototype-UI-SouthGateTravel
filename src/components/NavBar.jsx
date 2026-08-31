import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useLang } from '../context/LangContext.jsx';
import './NavBar.css';

const ACCENT = '#E1262D';

function NavItem({ to, label, onPick }) {
  return (
    <NavLink
      to={to}
      onClick={onPick}
      className="sg-nav-link"
      style={({ isActive }) => ({
        color: isActive ? ACCENT : '#3C5464',
        borderBottom: `2px solid ${isActive ? ACCENT : 'transparent'}`
      })}
    >
      {label}
    </NavLink>
  );
}

export default function NavBar() {
  const { t, lang, setLang } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Close the mobile menu on navigation.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const links = [
    { to: '/umrah', label: t.navUmrah },
    { to: '/rodrigues', label: t.navRodrigues },
    { to: '/holidays', label: t.navHolidays },
    { to: '/cruises', label: 'Cruises' },
    { to: '/flights', label: t.navFlights },
    { to: '/about', label: t.navAbout },
    { to: '/contact', label: t.navContact }
  ];

  const langBtn = (code, label) => {
    const on = lang === code;
    return (
      <button
        key={code}
        onClick={() => setLang(code)}
        aria-pressed={on}
        style={{
          border: 0,
          cursor: 'pointer',
          fontSize: 11.5,
          fontWeight: 800,
          padding: '6px 11px',
          borderRadius: 999,
          background: on ? '#0B2434' : 'transparent',
          color: on ? '#fff' : '#5B7280'
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="sg-navbar">
      <div className="sg-container sg-navbar-inner">
        <Link to="/" style={{ display: 'block', flexShrink: 0 }}>
          <img src="/assets/southgate-logo.webp" alt="South Gate Travel and Tourism" style={{ height: 46, width: 'auto', display: 'block' }} />
        </Link>

        <div data-navscroll className="sg-nav-links">
          {links.map((l) => (
            <NavItem key={l.to} to={l.to} label={l.label} />
          ))}
        </div>

        <div className="sg-nav-right">
          <div style={{ display: 'flex', gap: 2, background: '#F1F4F6', borderRadius: 999, padding: 3, flexShrink: 0 }}>
            {langBtn('en', 'EN')}
            {langBtn('fr', 'FR')}
            {langBtn('kr', 'KR')}
          </div>
          <button
            onClick={() => navigate('/bookings')}
            className="sg-nav-myb"
            style={{ border: 0, background: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0, color: '#3C5464' }}
          >
            {t.myBookings}
          </button>
          <button
            onClick={() => navigate('/umrah')}
            className="sg-nav-book"
            style={{
              border: 0,
              cursor: 'pointer',
              background: ACCENT,
              color: '#fff',
              fontWeight: 700,
              fontSize: 13.5,
              padding: '12px 20px',
              borderRadius: 999,
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            {t.bookNow}
          </button>
          <button
            className="sg-nav-burger"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span style={{ transform: open ? 'translateY(5px) rotate(45deg)' : 'none' }} />
            <span style={{ opacity: open ? 0 : 1 }} />
            <span style={{ transform: open ? 'translateY(-5px) rotate(-45deg)' : 'none' }} />
          </button>
        </div>
      </div>

      {open && (
        <div className="sg-nav-mobile">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className="sg-nav-mobile-link"
              style={({ isActive }) => ({ color: isActive ? ACCENT : '#0B2434' })}
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/bookings" className="sg-nav-mobile-link" style={{ color: '#3C5464' }}>
            {t.myBookings}
          </NavLink>
        </div>
      )}
    </div>
  );
}
