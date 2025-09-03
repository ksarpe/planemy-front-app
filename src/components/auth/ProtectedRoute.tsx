import { useAuthContext } from "../../hooks/context/useAuthContext";
import { AuthContainer } from "./AuthContainer";
import { OnboardingGuard } from "../onboarding/OnboardingGuard";
import Spinner from "../ui/Utils/Spinner";
import type { ProtectedRouteProps } from "@/data/Auth/interfaces";

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-gray-600">Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthContainer />;
  }

  // Wrap authenticated content with onboarding guard
  return <OnboardingGuard userId={user.uid}>{children}</OnboardingGuard>;
};
