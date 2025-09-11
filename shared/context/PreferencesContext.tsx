import { createContext, useState, ReactNode, useEffect } from "react";
import type { PreferencesContextProps } from "../data/User/preferencesContext";

import { persistentStorage } from "../lib/storage.native";

const PreferencesContext = createContext<PreferencesContextProps | undefined>(undefined);
export { PreferencesContext };

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [mainListId, setMainListId] = useState<string | null>(null);
  const [defaultShoppingListId, setDefaultShoppingListId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Load dark mode from localStorage on mount
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await persistentStorage.getItem("app_theme");
      const isDarkMode =
        savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
      setIsDark(isDarkMode);
      updateHtmlClass(isDarkMode);
    };
    loadTheme();
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

  return (
    <PreferencesContext.Provider
      value={{
        mainListId,
        setMainListId,
        defaultShoppingListId,
        setDefaultShoppingListId,
        isDark,
        toggleDark,
      }}>
      {children}
    </PreferencesContext.Provider>
  );
}
