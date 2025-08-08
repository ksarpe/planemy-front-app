import { Globe } from "lucide-react";
import type { LanguageRegionSectionProps } from "@/data/User/interfaces";

export default function LanguageRegionSection({
  language,
  setLanguage,
  timezone,
  setTimezone,
}: LanguageRegionSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
        <Globe size={20} className="text-primary" />
        Język i region
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Język</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary">
            <option value="pl">Polski</option>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
            <option value="es">Español</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Strefa czasowa</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary">
            <option value="Europe/Warsaw">Europa/Warszawa (GMT+1)</option>
            <option value="Europe/London">Europa/Londyn (GMT+0)</option>
            <option value="Europe/Berlin">Europa/Berlin (GMT+1)</option>
            <option value="America/New_York">Ameryka/Nowy Jork (GMT-5)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
