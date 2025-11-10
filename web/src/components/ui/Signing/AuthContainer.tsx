import { InteractiveBackground } from "./InteractiveBackground";
import { LanguageSelector } from "./LanguageSelector";
import { LoginForm } from "./LoginForm";
import { ThemeToggle } from "./ThemeToggle";

export const AuthContainer = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary px-4 py-4 relative overflow-hidden">
      <InteractiveBackground />

      {/* Header with Logo and Controls */}
      <div className="flex items-center justify-between w-full relative z-10">
        <h1 className="text-2xl font-medium text-text">🪐Planemy</h1>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>

      {/* Login Form - centered vertically in remaining space */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>

      {/* Footer */}
      <div>
        <p className="text-xs text-gray-600 text-center">© 2024 Planemy. All rights reserved. v0.2.0</p>
      </div>
    </div>
  );
};
