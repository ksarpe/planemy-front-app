import { LoginForm } from "./LoginForm";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSelector } from "./LanguageSelector";

export const AuthContainer = () => {
  console.log("Rendering AuthContainer");

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative bg-bg">
      {/* Theme Toggle and Language Selector */}
      <div className="absolute top-6 right-6 flex items-center gap-2">
        <LanguageSelector />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};
