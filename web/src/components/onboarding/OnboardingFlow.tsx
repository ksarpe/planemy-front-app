import { useState, useCallback, useEffect } from "react";
import { useCompleteOnboarding } from "@shared/hooks/onboarding/useOnboarding";
import { useToastContext } from "@/hooks/context/useToastContext";
import { useT } from "@shared/hooks/useT";
import type { OnboardingData, OnboardingStep } from "@shared/data/User/interfaces";
import { motion, AnimatePresence } from "framer-motion";

// Import onboarding steps
import { PersonalInfoStep } from "./steps/PersonalInfoStep";
import { PreferencesStep } from "./steps/PreferencesStep";
import { CompletionStep } from "./steps/CompletionStep";
import ReactCountryFlag from "react-country-flag";

interface OnboardingFlowProps {
  userId: string;
  onComplete: () => void;
}

export const OnboardingFlow = ({ userId, onComplete }: OnboardingFlowProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [mascottName, setMascottName] = useState<string>("");
  const [flag, setFlag] = useState<string>("");
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const { showToast } = useToastContext();
  const { t } = useT();
  const completeOnboardingMutation = useCompleteOnboarding();

  // Define onboarding steps
  const steps: OnboardingStep[] = [
    {
      id: "personal-info",
      title: t("onboarding.personalInfo.title"),
      description: t("onboarding.personalInfo.description"),
      component: PersonalInfoStep,
      isRequired: true,
    },
    {
      id: "preferences",
      title: t("onboarding.preferences.title"),
      description: t("onboarding.preferences.description"),
      component: PreferencesStep,
      isRequired: false,
    },
    {
      id: "completion",
      title: t("onboarding.completion.title"),
      description: t("onboarding.completion.description"),
      component: CompletionStep,
      isRequired: true,
    },
  ];

  const currentStep = steps[currentStepIndex];
  const CurrentStepComponent = currentStep.component;

  const handleNext = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  }, [currentStepIndex, steps.length]);

  const handlePrev = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  const handleSkip = useCallback(() => {
    if (!currentStep.isRequired) {
      handleNext();
    }
  }, [currentStep.isRequired, handleNext]);

  const handleComplete = useCallback(async () => {
    try {
      await completeOnboardingMutation.mutateAsync({
        userId,
        data: onboardingData,
      });
      showToast("success", t("onboarding.completionSuccess"));
      onComplete();
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      showToast("error", t("onboarding.completionError"));
    }
  }, [userId, onboardingData, completeOnboardingMutation, showToast, t, onComplete]);

  const updateOnboardingData = useCallback((updates: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    if (onboardingData.nickname && onboardingData.nickname.length >= 2) {
      setMascottName(onboardingData.nickname);
    } else if (onboardingData.nickname && onboardingData.nickname.length < 2) {
      setMascottName("");
    }
  }, [onboardingData]);

  useEffect(() => {
    if (onboardingData.language) {
      setFlag(onboardingData.language === "pl" ? "PL" : "GB");
    }
  }, [onboardingData.language]);

  // Animation variants for step transitions
  const variants = {
    hidden: {
      x: "100%",
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      x: "-100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <div className="fixed inset-0 bg-bg overflow-auto">
      {/* Progress Bar */}
      <div className="w-full h-3 bg-bg-alt">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      {/* Header + content + buttons */}
      <div className="flex flex-col mt-20 justify-center items-center">
        {/* Animated Header */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`header-${currentStepIndex}`}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 px-6 py-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-text mb-2">{currentStep.title}</h1>
            <p className="text-xl md:text-2xl text-text/60 max-w-xl mx-auto">{currentStep.description}</p>
          </motion.div>
        </AnimatePresence>

        {/* Animated Blueberry Character */}
        <div>
          <div className="blueberry-animation relative">
            {flag && (
              <ReactCountryFlag
                countryCode={flag}
                svg
                style={{ width: "3em", height: "3em" }}
                className="absolute bottom-3 left-3"
              />
            )}
          </div>
          {mascottName.length > 1 && (
            <div className="text-center rounded-md border bg-blue-300 shadow-lg">{mascottName}</div>
          )}
        </div>

        {/* Animated Main Content */}
        <div className="z-10 flex flex-col items-center justify-center px-2 py-8 min-w-1/4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`step-${currentStepIndex}`}
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full">
              <CurrentStepComponent onboardingData={onboardingData} updateOnboardingData={updateOnboardingData} />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <AnimatePresence mode="wait">
            <motion.div
              className="relative flex justify-between items-center mt-8 w-full max-w-2xl mx-auto"
              key={`step-${currentStepIndex}`}
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit">
              {/* Previous Button - only show if not first step */}
              {currentStepIndex > 0 ? (
                <button
                  onClick={handlePrev}
                  className="px-6 py-2 text-gray-600 dark:text-gray-400 bg-transparent rounded-md">
                  {t("common.previous")}
                </button>
              ) : (
                <div></div> // Empty div to maintain layout
              )}

              <div className="flex gap-3">
                {!currentStep.isRequired && currentStepIndex < steps.length - 1 && (
                  <button
                    onClick={handleSkip}
                    className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-text dark:hover:text-text-dark transition-colors">
                    {t("common.skip")}
                  </button>
                )}

                <button
                  onClick={currentStepIndex === steps.length - 1 ? handleComplete : handleNext}
                  disabled={currentStepIndex === steps.length - 1 ? completeOnboardingMutation.isPending : false}
                  className="px-8 py-2 bg-primary text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                  {currentStepIndex === steps.length - 1
                    ? completeOnboardingMutation.isPending
                      ? t("common.loading")
                      : t("onboarding.complete")
                    : t("common.next")}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
