import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enLanding from '@/../public/locales/en/landing.json';
import siLanding from '@/../public/locales/si/landing.json';
import enAuth from '@/../public/locales/en/auth.json';
import siAuth from '@/../public/locales/si/auth.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        landing: enLanding,
        auth: enAuth,
      },
      si: {
        landing: siLanding,
        auth: siAuth,
      },
    },
    fallbackLng: 'en',
    lng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
