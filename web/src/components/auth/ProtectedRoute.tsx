import { useAuthContext } from "@shared/hooks/context/useAuthContext";
import { AuthContainer } from "./AuthContainer";
import { OnboardingGuard } from "../onboarding/OnboardingGuard";
import Spinner from "../ui/Utils/Spinner";
import type { ProtectedRouteProps } from "@shared/data/Auth/interfaces";

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
