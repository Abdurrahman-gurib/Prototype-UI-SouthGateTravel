import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LangContext.jsx';
import ImageSlot from '../components/ImageSlot.jsx';
import './MyBookings.css';

const mono = "'IBM Plex Mono',monospace";
const sora = "'Sora',sans-serif";

const btnBase = {
  fontFamily: 'inherit',
  fontSize: 13,
  fontWeight: 700,
  padding: 12,
  borderRadius: 11,
  textAlign: 'center',
  cursor: 'pointer'
};

const railStyle = {
  padding: '22px 24px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

/* Booking ref styled like an airline PNR */
const pnrStyle = {
  fontFamily: mono,
  fontSize: 11,
  letterSpacing: '.08em',
  color: '#5B7280',
  border: '1px dashed rgba(11,36,52,.22)',
  borderRadius: 6,
  padding: '3px 8px',
  whiteSpace: 'nowrap'
};

export default function MyBookings() {
  const { t } = useLang();
  const navigate = useNavigate();

  return (
    <div className="sgp-myb-wrap" style={{ maxWidth: 1080, margin: '0 auto', padding: '44px 32px 0' }}>
      <h1 className="sgp-myb-title" style={{ fontFamily: sora, fontWeight: 800, fontSize: 38, letterSpacing: '-.034em', margin: '0 0 8px' }}>{t.mybTitle}</h1>
      <p style={{ fontSize: 15.5, color: '#5B7280', margin: '0 0 30px' }}>{t.mybSub}</p>

      <div style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: '#8CA0AC', marginBottom: 14 }}>{t.upcoming}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 34 }}>

        {/* Cotton Bay — confirmed, balance due */}
        <div className="sgp-myb-card sg-ticket">
          <div className="sgp-myb-img">
            <ImageSlot src="https://commons.wikimedia.org/wiki/Special:FilePath/Rodrigues_CalcareniticShore.jpg?width=600" alt="Rodrigues" />
          </div>
          <div style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
              <span style={{ background: '#E7F5F0', color: '#0B5F44', fontSize: 10.5, fontWeight: 800, padding: '5px 10px', borderRadius: 999 }}>{t.confirmed}</span>
              <span style={pnrStyle}>SG-26-0481</span>
            </div>
            <div style={{ fontFamily: sora, fontWeight: 700, fontSize: 20, letterSpacing: '-.022em' }}>Cotton Bay Resort and Spa</div>
            <div style={{ fontSize: 13.5, color: '#5B7280', marginTop: 6 }}>Rodrigues <span style={{ opacity: .4 }}>&middot;</span> 19 to 22 May 2026 <span style={{ opacity: .4 }}>&middot;</span> 2 adults, 1 child</div>
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#5B7280', marginBottom: 6 }}>
                <span>{t.paidSoFar} Rs 16,605</span><span>Rs 55,350</span>
              </div>
              <div style={{ height: 6, borderRadius: 99, background: '#EEF3F6', overflow: 'hidden' }}>
                <div style={{ width: '30%', height: '100%', background: '#12805C' }} />
              </div>
            </div>
          </div>
          <div className="sg-ticket-divider sgp-myb-tickdiv" aria-hidden="true" />
          <div className="sgp-myb-rail" style={railStyle}>
            <div>
              <div style={{ fontSize: 12, color: '#8CA0AC' }}>{t.balanceDue} 19 Apr 2026</div>
              <div style={{ fontFamily: sora, fontWeight: 800, fontSize: 24, letterSpacing: '-.03em', marginTop: 4 }}>Rs 38,745</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button type="button" className="sgp-myb-btn" onClick={() => navigate('/book/cotton')} style={{ ...btnBase, border: 0, background: '#E1262D', color: '#fff' }}>{t.payBalance}</button>
              <button type="button" className="sgp-myb-btn" onClick={() => {}} style={{ ...btnBase, border: '1px solid rgba(11,36,52,.14)', background: 'transparent', color: '#0B2434' }}>{t.voucher}</button>
            </div>
          </div>
        </div>

        {/* Umrah — instalment plan */}
        <div className="sgp-myb-card sg-ticket">
          <div className="sgp-myb-img">
            <ImageSlot src="https://commons.wikimedia.org/wiki/Special:FilePath/Kaaba_mirror_edit_jj.jpg?width=600" alt="Umrah" />
          </div>
          <div style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
              <span style={{ background: '#E8F6FC', color: '#0E7FAB', fontSize: 10.5, fontWeight: 800, padding: '5px 10px', borderRadius: 999 }}>{t.onPlan}</span>
              <span style={pnrStyle}>SG-26-0479</span>
            </div>
            <div style={{ fontFamily: sora, fontWeight: 700, fontSize: 20, letterSpacing: '-.022em' }}>Umrah Ramadan 2027</div>
            <div style={{ fontSize: 13.5, color: '#5B7280', marginTop: 6 }}>Makkah and Madinah <span style={{ opacity: .4 }}>&middot;</span> 12 to 26 Feb 2027 <span style={{ opacity: .4 }}>&middot;</span> 1 adult</div>
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#5B7280', marginBottom: 6 }}>
                <span>{t.instalment} 1 / 3</span><span>Rs 78,900</span>
              </div>
              <div style={{ height: 6, borderRadius: 99, background: '#EEF3F6', overflow: 'hidden' }}>
                <div style={{ width: '33%', height: '100%', background: '#17A5DA' }} />
              </div>
            </div>
          </div>
          <div className="sg-ticket-divider sgp-myb-tickdiv" aria-hidden="true" />
          <div className="sgp-myb-rail" style={railStyle}>
            <div>
              <div style={{ fontSize: 12, color: '#8CA0AC' }}>{t.nextPayment} 12 Oct 2026</div>
              <div style={{ fontFamily: sora, fontWeight: 800, fontSize: 24, letterSpacing: '-.03em', marginTop: 4 }}>Rs 26,300</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button type="button" className="sgp-myb-btn" onClick={() => navigate('/book/umrah-ram')} style={{ ...btnBase, border: 0, background: '#0B2434', color: '#fff' }}>{t.payNowBtn}</button>
              <button type="button" className="sgp-myb-btn" onClick={() => {}} style={{ ...btnBase, border: '1px solid rgba(11,36,52,.14)', background: 'transparent', color: '#0B2434' }}>{t.viewPlan}</button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: '#8CA0AC', marginBottom: 14 }}>{t.past}</div>
      <div className="sgp-myb-past" style={{ border: '1px solid rgba(11,36,52,.1)', background: '#fff', borderRadius: 18, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20, opacity: .72 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Dubai City Break</div>
          <div style={{ fontSize: 13, color: '#5B7280', marginTop: 4 }}>14 to 19 December 2025 <span style={{ opacity: .4 }}>&middot;</span> 2 adults</div>
        </div>
        <span className="sgp-myb-stamp" aria-hidden="true">Completed</span>
        <div style={{ fontFamily: mono, fontSize: 12, letterSpacing: '.06em', color: '#8CA0AC' }}>SG-25-0312</div>
        <button type="button" className="sgp-myb-btn" onClick={() => navigate('/package/dubai')} style={{ fontFamily: 'inherit', border: '1px solid rgba(11,36,52,.14)', background: 'transparent', color: '#0B2434', fontSize: 12.5, fontWeight: 700, padding: '10px 18px', borderRadius: 999, cursor: 'pointer', whiteSpace: 'nowrap' }}>{t.bookAgain}</button>
      </div>
    </div>
  );
}
