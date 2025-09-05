import type { UserSettings } from "./interfaces";

export interface PreferencesContextProps {
  language: string;
  timezone: string;
  mainListId: string | null;
  setMainListId: (listId: string | null) => void;
  defaultShoppingListId: string | null;
  setDefaultShoppingListId: (listId: string | null) => void;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  isDark: boolean;
  toggleDark: () => void;
}
