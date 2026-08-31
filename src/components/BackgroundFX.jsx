import React, { useEffect, useState } from 'react';

/** Floating ambient blobs behind the whole site. */
export function BackgroundFX() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: '-16%',
          left: '-10%',
          width: '54vw',
          height: '54vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(23,165,218,.22),rgba(23,165,218,0) 68%)',
          filter: 'blur(40px)',
          animation: 'sgFloatA 28s ease-in-out infinite'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '26%',
          right: '-14%',
          width: '48vw',
          height: '48vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(23,165,218,.16),rgba(23,165,218,0) 68%)',
          filter: 'blur(44px)',
          animation: 'sgFloatB 34s ease-in-out infinite'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-18%',
          left: '22%',
          width: '46vw',
          height: '46vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(225,38,45,.10),rgba(225,38,45,0) 68%)',
          filter: 'blur(48px)',
          animation: 'sgFloatA 40s ease-in-out infinite reverse'
        }}
      />
    </div>
  );
}

/** Thin scroll-progress bar along the top (JS-driven for cross-browser support). */
export function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = document.scrollingElement || document.documentElement;
        const max = el.scrollHeight - el.clientHeight;
        setP(max > 0 ? el.scrollTop / max : 0);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 95,
        transformOrigin: '0 50%',
        background: 'linear-gradient(90deg,#17A5DA,#E1262D)',
        transform: `scaleX(${p})`,
        pointerEvents: 'none'
      }}
    />
  );
}
