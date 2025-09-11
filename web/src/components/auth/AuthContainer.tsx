import { LoginForm } from "./LoginForm";

export const AuthContainer = () => {
  console.log("Rendering AuthContainer");
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};
