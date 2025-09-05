import { motion } from "framer-motion";
import { useEffect } from "react";

// --- Lepsze Ikony dla każdego typu powiadomienia ---
const ICONS = {
  success: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  warning: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
};

// --- Bardziej nowoczesna i czytelna paleta kolorów ---
const TOAST_CONFIG = {
  success: {
    bgColor: "bg-green-600",
    textColor: "text-white",
    icon: ICONS.success,
  },
  error: {
    bgColor: "bg-red-600",
    textColor: "text-white",
    icon: ICONS.error,
  },
  warning: {
    // Użyłem pomarańczowego dla lepszego kontrastu w dark mode
    bgColor: "bg-orange-500",
    textColor: "text-white",
    icon: ICONS.warning,
  },
};

import type { ToastProps } from "@shared/data/Utils/Components/UtilComponentInterfaces";

export default function Toast({ type, message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timeout = setTimeout(onClose, duration);
    return () => clearTimeout(timeout);
  }, [onClose, duration]);

  const config = TOAST_CONFIG[type];

  return (
    <motion.div
      layout // `layout` pomaga w płynnym animowaniu, gdyby tosty się układały jeden na drugim
      initial={{ y: 50, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 50, opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 150, damping: 20 }}
      // Zmieniona pozycja i wygląd
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-4 py-3 rounded-xl shadow-lg ${config.bgColor} ${config.textColor} max-w-sm w-full`}>
      {/* Ikona */}
      <div>{config.icon}</div>

      {/* Wiadomość */}
      <span className="flex-grow">{message}</span>

      {/* Przycisk zamknięcia z ikoną */}
      <button onClick={onClose} className="p-1 rounded-full hover:bg-black/20 transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
}
