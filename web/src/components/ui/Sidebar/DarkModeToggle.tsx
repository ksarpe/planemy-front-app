import { usePreferencesContext } from "@shared/hooks/context/usePreferencesContext";
import { FiMoon, FiSun } from "react-icons/fi";

export function DarkModeToggle() {
  const { isDark, toggleDark } = usePreferencesContext();

  return (
    <button
      onClick={toggleDark}
      className="w-10 h-10 rounded-2xl cursor-pointer  dark:hover:text-yellow-400 flex items-center justify-center text-text hover:text-primary transition-all"
      title={isDark ? "Light mode" : "Dark mode"}
      aria-label={isDark ? "Light mode" : "Dark mode"}>
      {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  );
}
