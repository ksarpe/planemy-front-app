import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface ToastProps {
  type: "success" | "error" | "warning";
  message: string;
  onClose: () => void;
  duration?: number;
}

const toastColors = {
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
  warning: "bg-yellow-500 text-black",
};

export default function Toast({
  type,
  message,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timeout);
  }, [onClose, duration]);
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-tl-xl rounded-tr-xl shadow-lg ${toastColors[type]} max-w-xs w-full`}
      >
        <div className="flex justify-between items-center">
          <span>{message}</span>
          <button
            onClick={onClose}
            className="text-xl font-bold ml-4 hover:opacity-80"
          >
            ✖️
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
