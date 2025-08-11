import * as RNLocalize from 'react-native-localize';
import { LanguageDetectorAsyncModule } from 'i18next';

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: callback => {
    const locales = RNLocalize.getLocales();
    const lang = locales[0]?.languageCode || 'en';
    callback(['vi', 'en', 'lo'].includes(lang) ? lang : 'en');
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

export default languageDetector;
