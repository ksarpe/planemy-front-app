import { usePreferencesContext } from "@/hooks/context/usePreferencesContext";

export function useTheme() {
  const ctx = usePreferencesContext();
  // Fallbacks if context not ready
  const isDark = ctx?.isDark ?? false;
  const toggleTheme = ctx?.toggleTheme ?? (() => {});
  return { isDark, toggleTheme };
}
