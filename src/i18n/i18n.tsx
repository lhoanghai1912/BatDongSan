// src/i18n/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import languageDetector from './languageDetector';

import * as en from './locales/en.json';
import * as vi from './locales/vi.json';
import * as lo from './locales/lo.json';

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      en: { translation: (en as any).default || en },
      vi: { translation: (vi as any).default || vi },
      lo: { translation: (lo as any).default || lo },
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
