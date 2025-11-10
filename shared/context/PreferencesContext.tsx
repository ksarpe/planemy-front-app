import { persistentStorage } from "@shared/lib/storage.web";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export interface PreferencesContextProps {
  defaultTaskListId: string | null;
  setDefaultTaskListId: (listId: string | null) => void;
  defaultShoppingListId: string | null;
  setDefaultShoppingListId: (listId: string | null) => void;
  isDark: boolean;
  toggleDark: () => void;
  setLanguage: (language: "en-US" | "pl-PL" | "de-DE") => void;
  language: "en-US" | "pl-PL" | "de-DE";
}

const PreferencesContext = createContext<PreferencesContextProps | undefined>(undefined);
export { PreferencesContext };

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [defaultTaskListId, setDefaultTaskListId] = useState<string | null>(null);
  const [defaultShoppingListId, setDefaultShoppingListId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    const loadPreferences = async () => {
      // Load theme
      const savedTheme = await persistentStorage.getItem("app_theme");
      const isDarkMode =
        savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
      setIsDark(isDarkMode);
      updateHtmlClass(isDarkMode);
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
  const setLanguage = (newLanguage: "en-US" | "pl-PL" | "de-DE") => {
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
        setLanguage,
        language: i18n.language as "en-US" | "pl-PL" | "de-DE",
      }}>
      {children}
    </PreferencesContext.Provider>
  );
}
