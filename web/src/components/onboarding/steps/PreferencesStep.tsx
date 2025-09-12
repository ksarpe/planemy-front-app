import { useState, useEffect } from "react";
//import { useT } from "@shared/hooks/utils/useT";
import type { OnboardingStepBaseProps } from "@shared/data/User/interfaces";
import ReactCountryFlag from "react-country-flag";

export const PreferencesStep = ({ onboardingData, updateOnboardingData }: OnboardingStepBaseProps) => {
  //const { t } = useT();
  const [language, setLanguage] = useState(onboardingData.language || "pl");

  useEffect(() => {
    updateOnboardingData({ language });
  }, [language, updateOnboardingData]);

  const languages = [
    { code: "pl", name: "Polski", countryCode: "PL" },
    { code: "en", name: "Angielski", countryCode: "GB" },
  ];

  return (
    <div className="">
      {/* Language Selection */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`p-4 rounded-lg border-2 transition-all ${
                language === lang.code
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-200  bg-bg-alt  hover:border-primary/50 text-text"
              }`}>
              <div className="flex items-center space-x-3">
                <ReactCountryFlag countryCode={lang.countryCode} svg style={{ width: "2em", height: "2em" }} />
                <span className="font-medium">{lang.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
