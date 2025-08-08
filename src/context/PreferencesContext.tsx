import { createContext, useState, ReactNode, useEffect, useMemo, useRef } from "react";
// Removed useTheme: dark mode is now controlled only by selected color theme
import type { PreferencesContextProps } from "@/data/typesProps";

import { getUserSettings, updateUserSettings } from "@/api/user_settings";
import { useAuthContext } from "@/hooks/context/useAuthContext";
import { UserSettings } from "@/data/User/interfaces";
import { useToastContext } from "@/hooks/context/useToastContext";

const PreferencesContext = createContext<PreferencesContextProps | undefined>(undefined);
export { PreferencesContext };

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToastContext();
  const { user } = useAuthContext();
  const [showWeekends, setShowWeekends] = useState(true);
  const [mainListId, setMainListId] = useState<string | null>(null);

  // Color theme: 0 Cozy, 1 Sweet, 2 Business, 3 Dark Mode
  const [colorTheme, _setColorTheme] = useState(0);
  const [lastNonDarkTheme, setLastNonDarkTheme] = useState(0);

  // Locale settings
  const [language, setLanguage] = useState("pl");
  const [timezone, setTimezone] = useState("Europe/Warsaw");

  // Debounce timer refs
  const themeDebounceRef = useRef<number | null>(null);
  const localeDebounceRef = useRef<number | null>(null);

  // Derived dark mode from selected theme
  const isDark = colorTheme === 3;

  /**
   * setColorTheme
   * Updates the selected color theme and remembers the last non-dark selection.
   * Persists the new value to Firestore (debounced separately).
   */
  const setColorTheme = (index: number) => {
    _setColorTheme(index);
    if (index !== 3) setLastNonDarkTheme(index);
  };

  /**
   * toggleTheme
   * Toggles between Dark Mode (index 3) and the last selected non-dark theme.
   */
  const toggleTheme = () => {
    if (isDark) {
      setColorTheme(lastNonDarkTheme);
    } else {
      setColorTheme(3); // Dark Mode
    }
  };

  /**
   * persistThemeDebounced
   * Debounced persistence of colorThemeIndex to Firestore to avoid rapid writes.
   */
  useEffect(() => {
    if (!user) return;
    if (themeDebounceRef.current) window.clearTimeout(themeDebounceRef.current);
    themeDebounceRef.current = window.setTimeout(() => {
      updateUserSettings(user.uid, { colorThemeIndex: colorTheme }).catch(() => {
        // ignore persistence errors
      });
    }, 400);
    return () => {
      if (themeDebounceRef.current) window.clearTimeout(themeDebounceRef.current);
    };
  }, [colorTheme, user]);

  /**
   * persistLocaleDebounced
   * Debounced persistence of language and timezone to Firestore.
   */
  useEffect(() => {
    if (!user) return;
    if (localeDebounceRef.current) window.clearTimeout(localeDebounceRef.current);
    localeDebounceRef.current = window.setTimeout(() => {
      const payload: Partial<UserSettings> = { language };
      if (timezone) payload.timezone = timezone;
      updateUserSettings(user.uid, payload).catch(() => {
        // ignore persistence errors
      });
    }, 500);
    return () => {
      if (localeDebounceRef.current) window.clearTimeout(localeDebounceRef.current);
    };
  }, [language, timezone, user]);

  // Load persisted settings on mount (Firestore)
  useEffect(() => {
    const hydrate = async () => {
      if (!user) return;
      const settings = await getUserSettings(user.uid);
      if (settings) {
        if (settings.colorThemeIndex !== undefined) {
          const idx = settings.colorThemeIndex;
          _setColorTheme(idx);
          if (idx !== 3) setLastNonDarkTheme(idx);
        }
        if (settings.language) setLanguage(settings.language);
        if (settings.timezone) setTimezone(settings.timezone);
        if (settings.defaultTaskListId) setMainListId(settings.defaultTaskListId);
      }
    };
    hydrate();
  }, [user]);

  // Theme class names corresponding to color themes
  const themeClassNames = useMemo(
    () => [
      "", // Cozy Room
      "theme-sweet-factory",
      "theme-productive-business",
      "theme-dark-mode",
    ],
    [],
  );

  // Apply theme classes and Tailwind dark class
  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;

    // Clear previous theme classes
    themeClassNames.forEach((className) => {
      if (className) body.classList.remove(className);
    });

    // Apply current theme class
    if (themeClassNames[colorTheme]) {
      const className = themeClassNames[colorTheme];
      if (className) body.classList.add(className);
    }

    // Tailwind dark variant only for explicit Dark Mode theme
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [colorTheme, isDark, themeClassNames]);

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
    } catch (error) {
      console.error("Error updating user settings:", error);
    }
  };

  return (
    <PreferencesContext.Provider
      value={{
        showWeekends,
        setShowWeekends,
        isDark,
        toggleTheme,
        colorTheme,
        setColorTheme,
        language,
        setLanguage,
        timezone,
        setTimezone,
        mainListId,
        setMainListId,
        updateSettings,
      }}>
      {children}
    </PreferencesContext.Provider>
  );
}
