import type { UserSettings } from "./interfaces";

export interface PreferencesContextProps {
  mainListId: string | null;
  setMainListId: (listId: string | null) => void;
  defaultShoppingListId: string | null;
  setDefaultShoppingListId: (listId: string | null) => void;
  isDark: boolean;
  toggleDark: () => void;
}
