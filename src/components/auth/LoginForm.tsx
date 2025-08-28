import { useState } from "react";
import { useToastContext } from "@/hooks/context/useToastContext";
import { useLogin, useRegister } from "@/hooks/auth/useAuth";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { showToast } = useToastContext();

  // New API-based auth hooks
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      showToast("error", "Wypełnij wszystkie pola");
      return;
    }

    try {
      if (isLoginMode) {
        // Use new API login
        const result = await loginMutation.mutateAsync({
          username: email,
          password: password,
        });
        showToast("success", "Pomyślnie zalogowano!");
        console.log("Login result:", result);
      } else {
        // Use new API register
        const result = await registerMutation.mutateAsync({
          username: email,
          password: password,
        });
        showToast("success", "Pomyślnie zarejestrowano!");
        console.log("Register result:", result);
        // After successful registration, switch to login mode
        setIsLoginMode(true);
      }
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Błąd operacji");
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        {isLoginMode ? "Zaloguj się" : "Zarejestruj się"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Wprowadź swój email"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Hasło
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Wprowadź swoje hasło"
            required
            autoComplete={isLoginMode ? "current-password" : "new-password"}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {isLoading
            ? isLoginMode
              ? "Logowanie..."
              : "Rejestrowanie..."
            : isLoginMode
            ? "Zaloguj się"
            : "Zarejestruj się"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">{isLoginMode ? "Nie masz konta?" : "Masz już konto?"}</p>
        <button
          onClick={() => setIsLoginMode(!isLoginMode)}
          className="mt-2 text-blue-600 hover:text-blue-800 font-medium transition-colors">
          {isLoginMode ? "Zarejestruj się" : "Zaloguj się"}
        </button>
      </div>
    </div>
  );
};
