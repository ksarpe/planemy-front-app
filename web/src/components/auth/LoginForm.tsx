import { APIError } from "@shared/data/Auth/interfaces";
import { useLogin, useRegister } from "@shared/hooks/auth";
import { useToast } from "@shared/hooks/toasts/useToast";
import { useT } from "@shared/hooks/utils/useT";
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import { Toaster } from "sonner";
import { Button } from "../ui/shadcn/button";
import { Input } from "../ui/shadcn/input";

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
        switch (error.status) {
          case 401:
            showError(t("auth.errors.wrongPassword"));
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
    <div>
      <Toaster position="bottom-center" richColors />
      <h1 className="text-2xl font-semibold text-text">Your Life Assistant</h1>
      <h2 className="text-xl font-normal text-left mb-6 text-text-muted">
        {isLoginMode ? t("auth.login") : t("auth.register")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="E-mail"
          type="email"
          placeholder="E-mail"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          autoComplete="email"
        />

        <Input
          label={t("auth.password")}
          type="password"
          placeholder={t("auth.password")}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          autoComplete={isLoginMode ? "current-password" : "new-password"}
        />

        <Button
          type="submit"
          disabled={isLoading}
          data-loading={isLoading || undefined}
          variant={"primary"}
          className="w-full">
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
        <p className="text-sm text-gray-600 ">{isLoginMode ? t("auth.noAccount") : t("auth.hasAccount")}</p>
        <button
          onClick={() => setIsLoginMode(!isLoginMode)}
          className="text-lg mt-2 text-primary hover:text-primary/80 cursor-pointer font-medium transition-colors">
          {isLoginMode ? t("auth.register") : t("auth.login")}
        </button>
      </div>
    </div>
  );
};
