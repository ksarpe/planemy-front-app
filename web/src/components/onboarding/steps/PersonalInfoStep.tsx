import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useT } from "@shared/hooks/useT";
import type { OnboardingStepBaseProps } from "@shared/data/User/interfaces";

export const PersonalInfoStep = ({ onboardingData, updateOnboardingData }: OnboardingStepBaseProps) => {
  const { t } = useT();
  const [nickname, setNickname] = useState(onboardingData?.nickname || "");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(nickname.trim().length >= 2);
  }, [nickname]);

  useEffect(() => {
    if (isValid) {
      updateOnboardingData?.({ nickname: nickname.trim() });
    }
  }, [nickname, isValid, updateOnboardingData]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div className=" space-y-8" variants={containerVariants} initial="hidden" animate="visible">
      {/* Form */}
      <motion.div className="space-y-6" variants={itemVariants}>
        <div>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={t("onboarding.personalInfo.nicknamePlaceholder", "np. Anna, Tomek...")}
            className="w-full px-4 py-3 border border-gray-300 rounded-md  bg-bg text-text placeholder-text/50 text-lg"
            maxLength={50}
            autoComplete="given-name"
            autoFocus
          />
          <div className="mt-2 flex justify-between items-center">
            <p className="text-sm text-text/60">
              {nickname.length >= 2 ? (
                <span className="text-green-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t("onboarding.personalInfo.nicknameValid", "Wygląda dobrze!")}
                </span>
              ) : (
                t("onboarding.personalInfo.nicknameMinLength", "Minimum 2 znaki")
              )}
            </p>
            <span className="text-xs text-text/40">{nickname.length}/50</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
