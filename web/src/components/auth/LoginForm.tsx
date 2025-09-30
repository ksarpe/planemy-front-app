import { useState } from "react";
import { useToast } from "@shared/hooks/toasts/useToast";
import { useLogin, useRegister } from "@shared/hooks/auth/useAuth";
import { useT } from "@shared/hooks/utils/useT";
import { Toaster } from "sonner";
import { APIError } from "@shared/data/Auth/interfaces";
import { LoaderCircleIcon } from "lucide-react";
import { Button } from "../ui/shadcn/button";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { t } = useT();

  const { showSuccess, showError } = useToast();
  const login = useLogin();
  const register = useRegister();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (isLoginMode) {
        await login.mutateAsync({ username: email, password: password });
        showSuccess("Logowanie udane");
      } else {
        await register.mutateAsync({ username: email, password: password });
        showSuccess("Rejestracja udana");
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
    <div className="bg-white p-8 rounded-md w-full max-w-md mx-auto">
      <Toaster position="bottom-center" richColors />
      <h1 className="text-2xl font-semibold">
        Your Life asisstant
      </h1>
      <h2 className="text-xl font-normal text-left mb-6 text-text-muted-more">
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

        <Button
          type="submit"
          disabled={isLoading}
          data-loading={isLoading || undefined}
          className="w-full text-black py-2 px-4 rounded-md hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors group relative">
          <span className="group-data-loading:text-transparent">
            {isLoading
              ? isLoginMode
                ? t("auth.loggingIn")
                : t("auth.registering")
              : isLoginMode
              ? t("auth.login")
              : t("auth.register")}
          </span>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoaderCircleIcon className="animate-spin" size={16} aria-hidden="true" />
            </div>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">{isLoginMode ? t("auth.noAccount") : t("auth.hasAccount")}</p>
        <button
          onClick={() => setIsLoginMode(!isLoginMode)}
          className="text-lg mt-2 text-primary hover:text-primary/80 cursor-pointer font-medium transition-colors">
          {isLoginMode ? t("auth.register") : t("auth.login")}
        </button>
      </div>
    </div>
  );
};
