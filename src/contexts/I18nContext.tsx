'use client';

import { useRouter } from 'next/router';
import { ReactNode, createContext, useContext, useCallback } from 'react';

type Language = 'en' | 'si';

interface I18nContextType {
  language: Language;
  changeLanguage: (lang: Language) => Promise<void>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const currentLanguage = (router.locale || 'en') as Language;

  const changeLanguage = useCallback(async (newLang: Language) => {
    await router.push(router.pathname, router.asPath, { locale: newLang });
  }, [router]);

  return (
    <I18nContext.Provider value={{ language: currentLanguage, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
