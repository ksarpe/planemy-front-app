import { Palette, Moon, Sun } from "lucide-react";

interface ColorTheme {
  name: string;
  description: string;
  colors: string[];
}

interface AppearanceThemeSectionProps {
  isDark: boolean;
  toggleTheme: () => void;
  selectedTheme: number;
  setSelectedTheme: (index: number) => void;
  colorThemes: ColorTheme[];
}

export default function AppearanceThemeSection({
  isDark,
  toggleTheme,
  selectedTheme,
  setSelectedTheme,
  colorThemes,
}: AppearanceThemeSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
        <Palette size={20} className="text-primary" />
        Wygląd i motywy
      </h3>

      {/* Dark Mode Toggle */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDark ? <Moon size={20} /> : <Sun size={20} />}
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Tryb ciemny</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Przełącz między jasnym i ciemnym motywem</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isDark ? "bg-primary" : "bg-gray-200"
            }`}>
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDark ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Color Themes */}
      <div>
        <p className="font-medium text-gray-900 dark:text-gray-100 mb-4">Wybierz schemat kolorów</p>
        <div className="space-y-4">
          {colorThemes.map((theme, index) => (
            <button
              key={theme.name}
              onClick={() => setSelectedTheme(index)}
              className={`w-full p-4 rounded-lg border-2 transition-all hover:scale-[1.02] ${
                selectedTheme === index
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
              }`}>
              <div className="flex items-center gap-4">
                <div className="flex gap-1 min-w-0">
                  {theme.colors.map((color, colorIndex) => (
                    <div key={colorIndex} className={`w-8 h-8 rounded ${color} shadow-sm`}></div>
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{theme.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{theme.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
