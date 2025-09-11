import { useState } from "react";
import { useToast } from "@shared/hooks/toasts/useToast";
import { useLogin, useRegister } from "@shared/hooks/auth/useAuth";
import { useT } from "@shared/hooks/useT";
import { Toaster } from "sonner";
import { APIError } from "@shared/data/Auth/interfaces";
import { useAuthContext } from "@shared/hooks/context/useAuthContext";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { t } = useT();
  const { refetchUser } = useAuthContext();

  const { showSuccess, showError } = useToast();
  const login = useLogin();
  const register = useRegister();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (isLoginMode) {
        await login.mutateAsync({ username: email, password: password });
        await refetchUser();
        showSuccess("Logowanie udane");
      } else {
        await register.mutateAsync({ username: email, password: password });
        showSuccess("Rejestracja udana");
        setIsLoginMode(true);
      }
    } catch (error) {
      if (error instanceof APIError) {
        if (error.status === 401) {
          showError("Nieprawidłowa nazwa użytkownika lub hasło");
        } else if (error.status === 409) {
          showError("Użytkownik z tym adresem e-mail już istnieje");
        } else if (error.body?.message) {
          showError(error.body.message);
        } else {
          showError("Wystąpił nieznany błąd podczas uwierzytelniania");
        }
      } else {
        showError("Błąd połączenia z siecią");
      }
    }
  };

  const isLoading = login.isPending || register.isPending;

  return (
    <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-md mx-auto">
      <Toaster position="bottom-center" richColors />
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        {isLoginMode ? t("auth.login") : t("auth.register")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {t("auth.email")}
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder={t("auth.emailPlaceholder")}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            {t("auth.password")}
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder={t("auth.passwordPlaceholder")}
            required
            autoComplete={isLoginMode ? "current-password" : "new-password"}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-black py-2 px-4 rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {isLoading
            ? isLoginMode
              ? t("auth.loggingIn")
              : t("auth.registering")
            : isLoginMode
            ? t("auth.login")
            : t("auth.register")}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">{isLoginMode ? t("auth.noAccount") : t("auth.hasAccount")}</p>
        <button
          onClick={() => setIsLoginMode(!isLoginMode)}
          className="mt-2 text-blue-600 hover:text-blue-800 font-medium transition-colors">
          {isLoginMode ? t("auth.register") : t("auth.login")}
        </button>
      </div>
    </div>
  );
};
