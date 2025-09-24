import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import languageDetector from './languageDetector';

// Import your translation files
import en from './locales/en.json';
import vi from './locales/vi.json';
import lo from './locales/lo.json';

const resources = {
  en: { translation: en },
  vi: { translation: vi },
  lo: { translation: lo },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    fallbackLng: 'lo', // Set Lao as default fallback language
    lng: 'lo', // Set Lao as initial language
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
