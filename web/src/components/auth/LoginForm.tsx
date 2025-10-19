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

    // Basic validation
    if (!email.trim() || !password.trim()) {
      showError(t("auth.fillAllFields"));
      return;
    }

    try {
      if (isLoginMode) {
        await login.mutateAsync({ username: email, password: password });
        showSuccess(t("auth.loginSuccess"));
      } else {
        await register.mutateAsync({ username: email, password: password });
        showSuccess(t("auth.registerSuccess"));
      }
    } catch (error) {
      if (error instanceof APIError) {
        // Map API error codes to i18n messages
        switch (error.status) {
          case 401:
            showError(t("auth.errors.wrongPassword"));
            break;
          case 404:
            showError(t("auth.errors.userNotFound"));
            break;
          case 409:
            showError(t("auth.errors.emailAlreadyInUse"));
            break;
          case 400:
            if (error.body?.message?.includes("password")) {
              showError(t("auth.errors.weakPassword"));
            } else if (error.body?.message?.includes("email")) {
              showError(t("auth.errors.invalidEmail"));
            } else {
              showError(error.body?.message || t("auth.errors.unknownError"));
            }
            break;
          case 403:
            showError(t("auth.errors.userDisabled"));
            break;
          case 429:
            showError(t("auth.errors.tooManyRequests"));
            break;
          default:
            showError(error.body?.message || t("auth.errors.unknownError"));
        }
      } else {
        showError(t("auth.errors.networkRequestFailed"));
      }
    }
  };

  const isLoading = login.isPending || register.isPending;

  return (
    <div className="p-8 rounded-md w-full max-w-md mx-auto bg-bg">
      <Toaster position="bottom-center" richColors />
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Your Life Assistant</h1>
      <h2 className="text-xl font-normal text-left mb-6 text-gray-600 dark:text-gray-300">
        {isLoginMode ? t("auth.login") : t("auth.register")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("auth.email")}
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder={t("auth.emailPlaceholder")}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("auth.password")}
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isLoginMode ? t("auth.noAccount") : t("auth.hasAccount")}
        </p>
        <button
          onClick={() => setIsLoginMode(!isLoginMode)}
          className="text-lg mt-2 text-primary hover:text-primary/80 cursor-pointer font-medium transition-colors">
          {isLoginMode ? t("auth.register") : t("auth.login")}
        </button>
      </div>
    </div>
  );
};
