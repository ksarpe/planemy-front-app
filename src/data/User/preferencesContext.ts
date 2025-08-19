import type { UserSettings } from "./interfaces";

export interface PreferencesContextProps {
  colorTheme: number;
  setColorTheme: (themeIndex: number) => void;
  setColorThemePreview?: (themeIndex: number) => void;
  suspendThemePersistence?: () => void;
  resumeThemePersistence?: () => void;
  language: string;
  timezone: string;
  mainListId: string | null;
  setMainListId: (listId: string | null) => void;
  defaultShoppingListId: string | null;
  setDefaultShoppingListId: (listId: string | null) => void;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
}
