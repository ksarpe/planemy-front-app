import { createContext, useState, ReactNode, useEffect } from "react";
import type { PreferencesContextProps } from "@/data/User/preferencesContext";
import { useTranslation } from "react-i18next";

import { getUserSettings, updateUserSettings } from "@shared/api/user_settings";
import { useAuthContext } from "@shared/hooks/context/useAuthContext";
import { UserSettings } from "@/data/User/interfaces";
import { useToastContext } from "@shared/hooks/context/useToastContext";

const PreferencesContext = createContext<PreferencesContextProps | undefined>(undefined);
export { PreferencesContext };

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToastContext();
  const { user } = useAuthContext();
  const { i18n } = useTranslation();
  const [mainListId, setMainListId] = useState<string | null>(null);
  const [defaultShoppingListId, setDefaultShoppingListId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Locale settings (read-only in context; update via dedicated hooks)
  const [language, setLanguage] = useState("pl");
  const [timezone, setTimezone] = useState("Europe/Warsaw");

  // Load dark mode from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("app_theme");
    const isDarkMode =
      savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(isDarkMode);
    updateHtmlClass(isDarkMode);
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
    localStorage.setItem("app_theme", newIsDark ? "dark" : "light");
    updateHtmlClass(newIsDark);
  };

  // Sync language with i18next
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  // Load persisted settings on mount (Firestore)
  useEffect(() => {
    const hydrate = async () => {
      if (!user) return;
      const settings = await getUserSettings(user.uid);
      if (settings) {
        if (settings.language) setLanguage(settings.language);
        if (settings.timezone) setTimezone(settings.timezone);
        if (settings.defaultTaskListId) setMainListId(settings.defaultTaskListId);
        // Load shopping list default if exists (backward compatible)
        if (settings.defaultShoppingListId) {
          setDefaultShoppingListId(settings.defaultShoppingListId);
        }
      }
    };
    hydrate();
  }, [user]);

  /**
   * updateSettings
   * Backward-compatible updater for other user settings, with local state sync and toasts.
   */
  const updateSettings = async (settings: Partial<UserSettings>) => {
    if (!user) return;
    try {
      await updateUserSettings(user.uid, settings);
      if (settings.defaultTaskListId !== undefined) {
        setMainListId(settings.defaultTaskListId);
        showToast("success", "Domyślna lista zadań została zaktualizowana!");
      }
      // Handle new shopping default list id
      if (settings.defaultShoppingListId !== undefined) {
        setDefaultShoppingListId(settings.defaultShoppingListId || null);
        showToast("success", "Domyślna lista zakupów została zaktualizowana!");
      }
      if (settings.language) setLanguage(settings.language);
      if (settings.timezone) setTimezone(settings.timezone);
    } catch (error) {
      console.error("Error updating user settings:", error);
    }
  };

  return (
    <PreferencesContext.Provider
      value={{
        language,
        timezone,
        mainListId,
        setMainListId,
        defaultShoppingListId,
        setDefaultShoppingListId,
        updateSettings,
        isDark,
        toggleDark,
      }}>
      {children}
    </PreferencesContext.Provider>
  );
}
