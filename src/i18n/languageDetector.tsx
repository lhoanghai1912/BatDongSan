import * as RNLocalize from 'react-native-localize';
import { LanguageDetectorAsyncModule } from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: async callback => {
    try {
      // Check if user has previously selected a language
      const savedLanguage = await AsyncStorage.getItem('user-language');
      if (savedLanguage && ['vi', 'en', 'lo'].includes(savedLanguage)) {
        callback(savedLanguage);
        return;
      }

      // If no saved language, check device language
      const locales = RNLocalize.getLocales();
      const deviceLang = locales[0]?.languageCode || 'lo';

      // Always default to Lao if device language is not supported
      const finalLang = ['vi', 'en', 'lo'].includes(deviceLang)
        ? deviceLang
        : 'lo';
      callback(finalLang);
    } catch (error) {
      // If any error occurs, default to Lao
      callback('lo');
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem('user-language', language);
    } catch (error) {
      console.log('Error saving language:', error);
    }
  },
};

export default languageDetector;
