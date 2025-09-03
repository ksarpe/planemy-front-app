import { useT } from "@/hooks/useT";
import type { OnboardingStepBaseProps } from "@/data/User/interfaces";

export const CompletionStep = ({ onboardingData }: OnboardingStepBaseProps) => {
  const { t } = useT();

  return (
    <div className="max-w-md mx-auto space-y-8 text-center">
      {/* Content */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-text ">{t("onboarding.completion.title", "Wszystko gotowe!")}</h2>
      </div>

      {/* Summary */}
      <div className="p-6 bg-bg-alt  rounded-lg space-y-4 text-left">
        <h3 className="font-semibold text-text  text-center mb-4">
          {t("onboarding.completion.summary", "Twoje ustawienia:")}
        </h3>

        <div className="space-y-3">
          {onboardingData?.nickname && (
            <div className="flex items-center justify-between">
              <span className="text-text/70  flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {t("onboarding.completion.nickname", "Nick")}
              </span>
              <span className="font-medium text-text ">{onboardingData.nickname}</span>
            </div>
          )}

          {onboardingData?.language && (
            <div className="flex items-center justify-between">
              <span className="text-text/70  flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
                {t("onboarding.completion.language", "Język")}
              </span>
              <span className="font-medium text-text ">
                {onboardingData.language === "pl" ? "Polski" : "Angielski"}
              </span>
            </div>
          )}

          {/* {onboardingData?.theme && (
            <div className="flex items-center justify-between">
              <span className="text-text/70  flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
                {t("onboarding.completion.theme", "Motyw")}
              </span>
              <span className="font-medium text-text ">
                {onboardingData.theme === "light"
                  ? t("onboarding.completion.lightTheme", "Jasny")
                  : t("onboarding.completion.darkTheme", "Ciemny")}
              </span>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};
