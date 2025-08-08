import { createContext, useState, ReactNode, useEffect, useMemo } from "react";
import { useTheme } from "@/hooks/useTheme";
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
  const [colorTheme, setColorTheme] = useState(0); // Default to Cozy Room (index 0)
  const { isDark, toggleTheme } = useTheme();

  // Theme class names corresponding to the themes in ProfileView
  const themeClassNames = useMemo(
    () => [
      "", // Default (Cozy Room) - no extra class
      "theme-sweet-factory",
      "theme-productive-business",
      "theme-dark-mode",
    ],
    [],
  );

  // Apply theme class to body
  useEffect(() => {
    const body = document.body;
    // Remove all theme classes
    themeClassNames.forEach((className) => {
      if (className) body.classList.remove(className);
    });
    // Add current theme class
    if (themeClassNames[colorTheme]) {
      body.classList.add(themeClassNames[colorTheme]);
    }
  }, [colorTheme, themeClassNames]);

  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!user) return;
      const settings = await getUserSettings(user!.uid);
      if (settings) {
        setMainListId(settings.defaultTaskListId || null);
      }
    };

    fetchUserSettings();
  }, [user]);

  const updateSettings = async (settings: Partial<UserSettings>) => {
    if (!user) return;
    console.log("Updating user settings:", settings);
    try {
      await updateUserSettings(user.uid, settings);
      if (settings.defaultTaskListId !== undefined) {
        setMainListId(settings.defaultTaskListId);
        showToast("success", "Domyślna lista zadań została zaktualizowana!");
      }
      //TODO: change to actually save theme preference not just toggle it
      // if (settings.theme !== undefined) {
      //   toggleTheme();
      // }
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
        mainListId,
        setMainListId,
        updateSettings,
      }}>
      {children}
    </PreferencesContext.Provider>
  );
}
