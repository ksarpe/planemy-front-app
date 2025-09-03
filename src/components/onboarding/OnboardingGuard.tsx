import { useEffect, useState } from "react";
import { useOnboardingStatus } from "@/hooks/onboarding/useOnboarding";
import { OnboardingFlow } from "./OnboardingFlow";
import Spinner from "../ui/Utils/Spinner";

interface OnboardingGuardProps {
  userId: string;
  children: React.ReactNode;
}

export const OnboardingGuard = ({ userId, children }: OnboardingGuardProps) => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { data: onboardingStatus, isLoading, error } = useOnboardingStatus(userId);

  useEffect(() => {
    if (!isLoading && !error && onboardingStatus) {
      setShowOnboarding(!onboardingStatus.isOnboarded);
    }
  }, [onboardingStatus, isLoading, error]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  // Show loading state while checking onboarding status
  if (isLoading) {
    return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
              <Spinner />
              <p className="mt-4 text-gray-600">Ładowanie...</p>
            </div>
          </div>
        );
  }

  // Show onboarding if user is not onboarded
  if (showOnboarding) {
    return <OnboardingFlow userId={userId} onComplete={handleOnboardingComplete} />;
  }

  // User is onboarded, show the app
  return <>{children}</>;
};
