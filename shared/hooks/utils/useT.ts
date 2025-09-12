import { useTranslation } from "react-i18next";

/**
 * Custom hook for easy access to translations
 * Provides the t function and common translation utilities
 */
export const useT = () => {
  const { t, i18n } = useTranslation();
  
  return {
    t,
    currentLanguage: i18n.language,
    changeLanguage: (lang: string) => i18n.changeLanguage(lang),
  };
};