import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

export default i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: "/locales/{{lng}}.json", // path to translation files
    },
    fallbackLng: "pl-PL", // default
    debug: true,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    supportedLngs: ["en-US", "pl-PL", "de-DE"],

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "app_language",
    },
  });
