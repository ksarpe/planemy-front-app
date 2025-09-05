import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import enTranslations from "./locales/en.json";
import plTranslations from "./locales/pl.json";

// Translation resources
const resources = {
  en: {
    translation: enTranslations,
  },
  pl: {
    translation: plTranslations,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "pl", // Default to Polish as it seems to be the primary language
    debug: false,

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      // Don't use browser language detection, let the app control language
      order: [],
      caches: [], // Don't cache language detection
    },
  });

export default i18n;
