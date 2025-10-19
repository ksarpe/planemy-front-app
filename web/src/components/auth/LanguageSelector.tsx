import { useId } from "react";
import { usePreferencesContext } from "@shared/hooks/context/usePreferencesContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/shadcn/select";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
] as const;

export const LanguageSelector = () => {
  const id = useId();
  const { language, setLanguage } = usePreferencesContext();

  const currentLanguage = languages.find((lang) => lang.code === language);

  return (
    <div>
      <Select value={language} onValueChange={(value) => setLanguage(value as "en" | "pl" | "de")}>
        <SelectTrigger
          id={id}
          className="px-2 transition-colors duration-200 cursor-pointer outline-none focus:outline-none focus:ring-0">
          <SelectValue>
            <span className="text-sm text-text">{currentLanguage?.flag}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem
              key={lang.code}
              value={lang.code}
              className="hover:bg-bg-alt transition-colors duration-150 cursor-pointer outline-none focus:outline-none focus:ring-0 text-text-muted">
              <span className="text-sm">{lang.flag}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
