import { createContext, useState, ReactNode } from "react";
import { useTheme } from "@/hooks/useTheme";
import type { PreferencesContextProps } from "@/data/typesProps";

const PreferencesContext = createContext<PreferencesContextProps | undefined>(undefined);
export { PreferencesContext };

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [showWeekends, setShowWeekends] = useState(true);
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);
  const [mainListId, setMainListId] = useState<string | null>(null);
  const { isDark, toggleTheme } = useTheme();

  return (
    <PreferencesContext.Provider
      value={{
        showWeekends,
        setShowWeekends,
        isDark,
        toggleTheme,
        isSidebarClosed,
        setIsSidebarClosed,
        mainListId,
        setMainListId,
      }}>
      {children}
    </PreferencesContext.Provider>
  );
}

