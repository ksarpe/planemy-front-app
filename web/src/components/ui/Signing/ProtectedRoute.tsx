import type { ProtectedRouteProps } from "@shared/data/Auth/interfaces";
import { useAuthContext } from "@shared/hooks/context/useAuthContext";
import Spinner from "../Loaders/Spinner";
import { OnboardingGuard } from "../Onboarding/OnboardingGuard";
import { AuthContainer } from "./AuthContainer";

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return <AuthContainer />;
  }

  return <OnboardingGuard>{children}</OnboardingGuard>;
};
