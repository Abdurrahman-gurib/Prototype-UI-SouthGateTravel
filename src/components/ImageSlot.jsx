import React, { useState } from 'react';

/**
 * Cover image with graceful loading / fallback, replacing the mockup's <image-slot>.
 * Fills its parent box (position it inside a sized container).
 */
export default function ImageSlot({ src, alt = '', style = {}, imgStyle = {}, kenburns = false }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: 'linear-gradient(135deg,#DCEAF2 0%,#C4DAE7 50%,#E8EFF4 100%)',
        ...style
      }}
    >
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: loaded ? 1 : 0,
            transition: 'opacity .6s ease',
            ...(kenburns ? { animation: 'sgKb 18s ease-out both alternate infinite' } : {}),
            ...imgStyle
          }}
        />
      )}
      {(failed || !loaded) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'IBM Plex Mono',monospace",
            fontSize: 10,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            color: 'rgba(11,36,52,.4)',
            textAlign: 'center',
            padding: 12
          }}
        >
          {alt}
        </div>
      )}
    </div>
  );
}
