export interface PreferencesContextProps {
  defaultTaskListId: string | null;
  setDefaultTaskListId: (listId: string | null) => void;
  defaultShoppingListId: string | null;
  setDefaultShoppingListId: (listId: string | null) => void;
  isDark: boolean;
  toggleDark: () => void;
  language: "en" | "pl" | "de";
  setLanguage: (language: "en" | "pl" | "de") => void;
}
