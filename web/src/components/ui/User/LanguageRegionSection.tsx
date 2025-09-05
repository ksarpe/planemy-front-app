import { Globe } from "lucide-react";
import type { LanguageRegionSectionProps } from "@/data/User";
import { useT } from "@shared/hooks/useT";

export default function LanguageRegionSection({
  language,
  setLanguage,
  timezone,
  setTimezone,
}: LanguageRegionSectionProps) {
  const { t } = useT();

  return (
    <div className="bg-white  rounded-lg p-6 border border-gray-200 ">
      <h3 className="text-lg font-semibold text-gray-900  mb-6 flex items-center gap-2">
        <Globe size={20} className="text-primary" />
        {t("languageAndRegion.title")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700  mb-2">{t("languageAndRegion.language")}</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300  rounded-md bg-white  text-gray-900  focus:ring-2 focus:ring-primary focus:border-primary">
            <option value="pl">{t("languageAndRegion.polish")}</option>
            <option value="en">{t("languageAndRegion.english")}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700  mb-2">{t("languageAndRegion.timezone")}</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300  rounded-md bg-white  text-gray-900  focus:ring-2 focus:ring-primary focus:border-primary">
            <option value="Europe/Warsaw">{t("languageAndRegion.timezones.warsaw")}</option>
            <option value="Europe/London">{t("languageAndRegion.timezones.london")}</option>
            <option value="Europe/Berlin">{t("languageAndRegion.timezones.berlin")}</option>
            <option value="America/New_York">{t("languageAndRegion.timezones.newYork")}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
