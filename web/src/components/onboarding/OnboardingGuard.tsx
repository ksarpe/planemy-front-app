import { useAuthContext } from "@shared/hooks/context/useAuthContext";
import { OnboardingFlow } from "../onboarding/OnboardingFlow";

export const OnboardingGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthContext();

  // Sprawdzamy, czy użytkownik jest zalogowany i czy nie przeszedł onboardingu
  if (user && user.is_onboarded) {
    return <OnboardingFlow />;
  }

  // Jeśli użytkownik jest zalogowany i przeszedł onboarding, renderujemy właściwą zawartość
  return <>{children}</>;
};