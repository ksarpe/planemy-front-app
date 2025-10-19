import { createContext, useState, ReactNode, useEffect } from "react";
import type { PreferencesContextProps } from "@shared/data/User/preferencesContext";
import { persistentStorage } from "@shared/lib/storage.web";
import i18n from "@shared/i18n";

const PreferencesContext = createContext<PreferencesContextProps | undefined>(undefined);
export { PreferencesContext };

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [defaultTaskListId, setDefaultTaskListId] = useState<string | null>(null);
  const [defaultShoppingListId, setDefaultShoppingListId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguageState] = useState<"en" | "pl" | "de">("pl");

  useEffect(() => {
    const loadPreferences = async () => {
      // Load theme
      const savedTheme = await persistentStorage.getItem("app_theme");
      const isDarkMode =
        savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
      setIsDark(isDarkMode);
      updateHtmlClass(isDarkMode);

      // Load language
      const savedLanguage = await persistentStorage.getItem("app_language");
      const currentLanguage =
        savedLanguage === "en" || savedLanguage === "pl" || savedLanguage === "de" ? savedLanguage : "pl";
      setLanguageState(currentLanguage);
      i18n.changeLanguage(currentLanguage);
    };
    loadPreferences();
  }, []);

  // Function to update HTML class
  const updateHtmlClass = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Toggle dark mode
  const toggleDark = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    persistentStorage.setItem("app_theme", newIsDark ? "dark" : "light");
    updateHtmlClass(newIsDark);
  };

  // Set language
  const setLanguage = (newLanguage: "en" | "pl" | "de") => {
    setLanguageState(newLanguage);
    persistentStorage.setItem("app_language", newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  return (
    <PreferencesContext.Provider
      value={{
        defaultTaskListId,
        setDefaultTaskListId,
        defaultShoppingListId,
        setDefaultShoppingListId,
        isDark,
        toggleDark,
        language,
        setLanguage,
      }}>
      {children}
    </PreferencesContext.Provider>
  );
}
