import i18next from 'i18next';
import memoize from 'lodash.memoize';
import {I18nManager} from 'react-native';
import {initReactI18next} from 'react-i18next';

import translateVI from '~/translations/vi.json';
import translateEN from '~/translations/en.json';
import translateFR from '~/translations/ms.json';

const resources = {
  // lazy requires (metro bundler does not support symlinks)
  vi: {
    translation: translateVI,
  },
  en: {
    translation: translateEN,
  },
  fr: {
    translation: translateFR,
  },
};

export const translate = memoize(
  (key, config) => {
    if (i18next.exists(key)) {
      return i18next.t(key, config);
    }
    return key;
  },
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

i18next.use(initReactI18next).init({
  lng: 'vi',
  fallbackLng: 'vi',
  interpolation: {
    format: function (value, format) {
      if (format === 'uppercase') {
        return value.toUpperCase();
      }
      return value;
    },
  },
  resources,
});

export const setI18nConfig = (languageTag = 'en') => {
  // fallback if no available language fits
  const fallback = {languageTag, isRTL: false};
  translate.cache.clear();

  I18nManager.forceRTL(fallback.isRTL);
  i18next.changeLanguage(languageTag);
};
