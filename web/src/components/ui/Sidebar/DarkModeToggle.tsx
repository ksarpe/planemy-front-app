import { usePreferencesContext } from "@shared/hooks/context/usePreferencesContext";
import { motion } from "framer-motion";
import { FiMoon, FiSun } from "react-icons/fi";

const TOGGLE_CLASSES =
  "text-sm font-medium flex items-center gap-2 px-3 py-2 transition-colors relative z-10 cursor-pointer";

interface DarkModeToggleProps {
  collapsed?: boolean;
}

export function DarkModeToggle({ collapsed = false }: DarkModeToggleProps) {
  const { isDark, toggleDark } = usePreferencesContext();

  if (collapsed) {
    return (
      <button
        onClick={toggleDark}
        className="w-10 h-10 rounded-2xl cursor-pointer bg-bg-hover hover:bg-primary/10 flex items-center justify-center text-text hover:text-primary transition-all duration-200"
        title={isDark ? "Przełącz na tryb jasny" : "Przełącz na tryb ciemny"}
        aria-label={isDark ? "Przełącz na tryb jasny" : "Przełącz na tryb ciemny"}>
        {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
      </button>
    );
  }

  return (
    <div className="relative flex w-fit items-center rounded-2xl bg-bg-alt overflow-hidden">
      <button className={`${TOGGLE_CLASSES} ${isDark ? "text-white" : "text-text-muted"}`} onClick={() => toggleDark()}>
        <FiMoon className="relative z-10 text-sm" />
      </button>
      <button className={`${TOGGLE_CLASSES} ${isDark ? "text-white" : "text-text-muted"}`} onClick={() => toggleDark()}>
        <FiSun className="relative z-10 text-sm" />
      </button>
      <div className={`absolute inset-0 z-0 flex ${!isDark ? "justify-end" : "justify-start"}`}>
        <motion.span
          layout
          transition={{ type: "spring", damping: 15, stiffness: 250 }}
          className={`h-full w-1/2 rounded-2xl bg-gradient-to-r ${
            isDark ? "from-primary to-bg-alt" : "from-bg-alt to-primary"
          }`}
        />
      </div>
    </div>
  );
}
