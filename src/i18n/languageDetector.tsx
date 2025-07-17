import * as RNLocalize from 'react-native-localize';
import { LanguageDetectorAsyncModule } from 'i18next';

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: callback => {
    const locales = RNLocalize.getLocales();
    const lang = locales[0]?.languageCode || 'vi';
    callback(['vi', 'en', 'lo'].includes(lang) ? lang : 'vi');
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

export default languageDetector;
