import { useAuthContext } from "../../hooks/context/useAuthContext";
import { AuthContainer } from "./AuthContainer";
import { OnboardingGuard } from "../onboarding/OnboardingGuard";
import Spinner from "../ui/Utils/Spinner";
import type { ProtectedRouteProps } from "@/data/Auth/interfaces";

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <AuthContainer />;
  }

  // Wrap authenticated content with onboarding guard
  return <OnboardingGuard userId={user.uid}>{children}</OnboardingGuard>;
};
