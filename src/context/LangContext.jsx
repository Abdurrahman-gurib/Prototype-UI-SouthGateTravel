import React, { createContext, useContext, useMemo, useState } from 'react';
import { translations } from '../i18n/translations.js';

const LangContext = createContext(null);

function readStoredLang() {
  try {
    const v = window.localStorage.getItem('sg-lang');
    if (v === 'en' || v === 'fr' || v === 'kr') return v;
  } catch (e) {
    /* private mode etc. */
  }
  return 'en';
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(readStoredLang);

  const value = useMemo(() => {
    const setLang = (l) => {
      setLangState(l);
      try {
        window.localStorage.setItem('sg-lang', l);
      } catch (e) {
        /* ignore */
      }
    };
    return { lang, setLang, t: translations[lang] || translations.en };
  }, [lang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
}
