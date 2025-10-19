import { usePreferencesContext } from "@shared/hooks/context/usePreferencesContext";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const { isDark, toggleDark } = usePreferencesContext();

  return (
    <button
      onClick={toggleDark}
      className="relative w-16 h-8 rounded-full transition-colors duration-200"
      style={{
        backgroundColor: "var(--color-bg-alt)",
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
      {/* Background Icons - Always Visible */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <Moon
          className="w-3 h-3"
          style={{
            color: isDark ? "var(--color-text)" : "var(--color-text-muted)",
            opacity: isDark ? 1 : 0.4,
          }}
        />
        <Sun
          className="w-3 h-3"
          style={{
            color: isDark ? "#fbbf24" : "#fbbf24",
            opacity: isDark ? 0.4 : 1,
          }}
        />
      </div>

      {/* Switch Thumb */}
      <div
        className="absolute top-1 w-6 h-6 rounded-full shadow-md transition-transform duration-200 flex items-center justify-center"
        style={{
          backgroundColor: "var(--color-bg)",
          transform: isDark ? "translateX(4px)" : "translateX(36px)",
        }}>
        {isDark ? (
          <Moon className="w-3 h-3" style={{ color: "var(--color-text)" }} />
        ) : (
          <Sun className="w-3 h-3" style={{ color: "#fbbf24" }} />
        )}
      </div>
    </button>
  );
};
