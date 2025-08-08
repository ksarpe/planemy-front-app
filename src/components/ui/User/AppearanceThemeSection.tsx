import { Palette, Moon, Sun } from "lucide-react";
import type { ColorTheme, AppearanceThemeSectionProps } from "@/data/User";

const colorThemes: ColorTheme[] = [
  {
    name: "Cozy Room",
    description: "Ciepłe, przytulne odcienie",
    colors: ["bg-[#fdf2e4]", "bg-[#f0e4d3]", "bg-[#dcc5b2]", "bg-[#776472]"],
  },
  {
    name: "Sweet Factory",
    description: "Słodkie, pastelowe barwy",
    colors: ["bg-[#fdf4ff]", "bg-[#f3e8ff]", "bg-[#c084fc]", "bg-[#ec4899]"],
  },
  {
    name: "Productive Business",
    description: "Profesjonalne, skupione kolory",
    colors: ["bg-slate-700", "bg-blue-600", "bg-indigo-500", "bg-gray-500"],
  },
  {
    name: "Dark Mode",
    description: "Głębokie, kontrastowe tony",
    colors: ["bg-gray-900", "bg-slate-800", "bg-zinc-700", "bg-gray-600"],
  },
];

export default function AppearanceThemeSection({
  isDark,
  toggleTheme,
  selectedTheme,
  setSelectedTheme,
}: AppearanceThemeSectionProps) {
  return (
    <div className="bg-white  rounded-lg p-6 border border-gray-200 ">
      <h3 className="text-lg font-semibold text-gray-900  mb-6 flex items-center gap-2">
        <Palette size={20} className="text-primary" />
        Wygląd i motywy
      </h3>

      {/* Dark Mode Toggle */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDark ? <Moon size={20} /> : <Sun size={20} />}
            <div>
              <p className="font-medium text-gray-900 ">Tryb ciemny</p>
              <p className="text-sm text-gray-500 ">Przełącz między jasnym i ciemnym motywem</p>
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
        <p className="font-medium text-gray-900  mb-4">Wybierz schemat kolorów</p>
        <div className="space-y-4">
          {colorThemes.map((theme, index) => (
            <button
              key={theme.name}
              onClick={() => setSelectedTheme(index)}
              className={`w-full p-4 rounded-lg border-2 transition-all hover:scale-[1.02] ${
                selectedTheme === index ? "border-primary bg-primary/20" : "border-gray-200  hover:border-gray-300"
              }`}>
              <div className="flex items-center gap-4">
                <div className="flex gap-1 min-w-0">
                  {theme.colors.map((color, colorIndex) => (
                    <div key={colorIndex} className={`w-12 h-9 rounded ${color} shadow-sm`}></div>
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900 ">{theme.name}</p>
                  <p className="text-xs text-gray-500 ">{theme.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
