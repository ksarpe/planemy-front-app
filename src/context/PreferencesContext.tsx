import { createContext, useState, useContext, ReactNode } from "react";
import { useTheme } from "@/hooks/useTheme";
import type { PreferencesContextProps } from "@/data/typesProps";

const PreferencesContext = createContext<PreferencesContextProps | undefined>(undefined);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [dayStartTime, setDayStartTime] = useState("07:00");
  const [showWeekends, setShowWeekends] = useState(true);
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <PreferencesContext.Provider
      value={{
        dayStartTime,
        setDayStartTime,
        showWeekends,
        setShowWeekends,
        isDark,
        toggleTheme,
        isSidebarClosed,
        setIsSidebarClosed,
      }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferencesContext() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferencesContext must be used within PreferencesProvider");
  }
  return context;
}
