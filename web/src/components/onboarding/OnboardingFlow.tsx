// src/components/onboarding/OnboardingFlow.tsx

import { AnimatePresence, motion } from "framer-motion";
import ReactCountryFlag from "react-country-flag";
import { useCallback, useState, useEffect } from "react";
import { useT } from "@shared/hooks/useT";
import { useUpdateUserProfile } from "@shared/hooks/user/useUserProfile";
import type { OnboardingData, OnboardingStep, User } from "@shared/data/User/interfaces";
import { useAuthContext } from "@shared/hooks/context/useAuthContext";

// Import onboarding steps
import { PersonalInfoStep } from "./steps/PersonalInfoStep";
import { PreferencesStep } from "./steps/PreferencesStep";
import { CompletionStep } from "./steps/CompletionStep";

export const OnboardingFlow = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const { t } = useT();
  const updateUser = useUpdateUserProfile();
  const { user } = useAuthContext();

  const mascottName = onboardingData.nickname && onboardingData.nickname.length > 1 ? onboardingData.nickname : "";
  const flag = onboardingData.language === "pl" ? "PL" : "GB";

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

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    if (!currentStep.isRequired) {
      handleNext();
    }
  };

  const handleComplete = useCallback(async () => {
    if (!user) {
      return;
    }
    try {
      const userUpdateData: Partial<User> = {
        is_onboarded: true,
      }
      await updateUser.mutateAsync(userUpdateData);
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
  }, [user, updateUser]);

  const updateOnboardingData = useCallback((updates: Partial<OnboardingData>) => {
        setOnboardingData((prev) => ({ ...prev, ...updates }));
    }, []);

  // Handle Enter key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (currentStepIndex === steps.length - 1) {
          handleComplete();
        } else {
          handleNext();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentStepIndex, steps.length, handleNext, handleComplete]);

  const variants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { x: "-100%", opacity: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  return (
    <div className="fixed inset-0 bg-bg overflow-auto">
      {/* Progress Bar */}
      <div className="w-full h-3 bg-bg-alt">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
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

        {/* Animated Mascott */}
        <div>
          <div className="blueberry-animation relative">
            {flag && <ReactCountryFlag countryCode={flag} svg style={{ width: "3em", height: "3em" }} className="absolute bottom-3 left-3" />}
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
              className="relative flex justify-between items-center gap-4 mt-8 w-full"
              key={`step-${currentStepIndex}`}
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit">
              {currentStepIndex > 0 ? (
                <button
                  onClick={handlePrev}
                  className="py-2 bg-text-muted w-full text-black font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                  {t("common.previous")}
                </button>
              ) : (
                <div />
              )}
                {!currentStep.isRequired && currentStepIndex < steps.length - 1 && (
                  <button
                    onClick={handleSkip}
                    className="py-2 bg-text-muted w-full text-black font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                    {t("common.skip")}
                  </button>
                )}
                <button
                  onClick={currentStepIndex === steps.length - 1 ? handleComplete : handleNext}
                  disabled={currentStepIndex === steps.length - 1 ? updateUser.isPending : false}
                  className="py-2 bg-primary w-full text-black font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                  {currentStepIndex === steps.length - 1
                    ? updateUser.isPending
                      ? t("common.loading")
                      : t("onboarding.complete")
                    : t("common.next")}
                </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};