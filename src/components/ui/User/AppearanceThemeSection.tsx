import { Palette } from "lucide-react";
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
    colors: ["bg-[#F5BECD]", "bg-[#D486A1]", "bg-[#6B2D5C]", "bg-[#ec4899]"],
  },
  {
    name: "Productive Business",
    description: "Profesjonalne, skupione kolory",
    colors: ["bg-[#e2e8f0]", "bg-[#cad8eb]", "bg-[#64748b]", "bg-[#1e40af]"],
  },
  {
    name: "Dark Mode",
    description: "Głębokie, kontrastowe tony",
    colors: ["bg-[#0f172a]", "bg-[#1e293b]", "bg-[#374151]", "bg-[#4b5563]"],
  },
];

export default function AppearanceThemeSection({
  selectedTheme,
  setSelectedTheme,
}: AppearanceThemeSectionProps) {
  return (
    <div className="bg-white  rounded-lg p-6 border border-gray-200 ">
      <h3 className="text-lg font-semibold text-gray-900  mb-6 flex items-center gap-2">
        <Palette size={20} className="text-primary" />
        Wygląd i motywy
      </h3>
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
