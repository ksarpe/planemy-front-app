import { APIError } from "@shared/data/Auth/interfaces";
import { useLogin, useRegister } from "@shared/hooks/auth";
import { useToast } from "@shared/hooks/toasts/useToast";
import { useT } from "@shared/hooks/utils/useT";
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import { Toaster } from "sonner";
import { Button } from "../Utils/button";
import { Input } from "../Utils/input";
import { LabeledSwitch } from "../Utils/labeled-switch";
import { PasswordInput } from "../Utils/password-input";
import { AnimatedTagline } from "./AnimatedTagline";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
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
      <AnimatedTagline />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="E-mail"
          placeholder="Enter your email address"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          autoComplete="email"
        />

        <PasswordInput
          label={t("auth.password")}
          placeholder={isLoginMode ? "Enter your password" : "Create a password"}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          autoComplete={isLoginMode ? "current-password" : "new-password"}
        />
        <div className="flex items-center justify-between">
          <LabeledSwitch id="remember-me" label="Remember me" checked={rememberMe} onCheckedChange={setRememberMe} />
          <Button type="button" onClick={() => showError("Coming soon")} variant="link">
            Forgot password?
          </Button>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          data-loading={isLoading || undefined}
          variant={"primary"}
          size="lg"
          className="w-full">
          <span className="group-data-loading:text-transparent">{isLoginMode ? "Sign in" : t("auth.register")}</span>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoaderCircleIcon className="animate-spin" size={16} aria-hidden="true" />
            </div>
          )}
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 border-t border-bg-muted-light"></div>
          <span className="text-sm text-text-muted">Or continue with</span>
          <div className="flex-1 border-t border-bg-muted-light"></div>
        </div>

        {/* Google Sign In Button */}
        <Button
          type="button"
          variant="primary_reverse"
          size="lg"
          className="w-full gap-3"
          onClick={() => {
            showError("Coming soon");
          }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"></path>
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"></path>
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"></path>
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"></path>
          </svg>
          Continue with Google
        </Button>
      </form>

      <div className="mt-4 text-center flex items-center justify-center">
        <p className="text-sm text-gray-600 ">{isLoginMode ? t("auth.noAccount") : t("auth.hasAccount")}</p>
        <Button
          onClick={() => (isLoginMode ? setIsLoginMode(false) : setIsLoginMode(true))}
          variant="link"
          className="ml-1">
          {isLoginMode ? t("auth.register") : t("auth.login")}
        </Button>
      </div>
    </div>
  );
};
