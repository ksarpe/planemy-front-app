import { Lock } from "lucide-react";

export default function SecuritySection() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
        <Lock size={20} className="text-primary" />
        Bezpieczeństwo
      </h3>
      <div className="space-y-4">
        <button className="w-full md:w-auto px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
          Zmień hasło
        </button>
        <button className="w-full md:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          Skonfiguruj 2FA
        </button>
        <button className="w-full md:w-auto px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors">
          Usuń konto
        </button>
      </div>
    </div>
  );
}
