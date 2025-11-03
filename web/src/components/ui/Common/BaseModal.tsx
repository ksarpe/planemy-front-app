import { BaseModalProps } from "@shared/data/Common/interfaces";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function BaseModal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  actions,
}: BaseModalProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      // Prevent scrolling on the body when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="bg-black/60 backdrop-blur-sm p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer">
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            onClick={(e) => e.stopPropagation()}
            className={`bg-bg  text-text  p-6 rounded-xl w-1/5 max-h-[90vh] overflow-y-auto shadow-2xl cursor-default relative`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{title}</h3>
              {showCloseButton && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-text/60  hover:text-text  transition-colors p-1 rounded-2xl hover:bg-bg-alt ">
                  <X size={20} />
                </motion.button>
              )}
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4">
              {children}
            </motion.div>

            {/* Actions */}
            {actions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-2 justify-end border-t border-gray-200 pt-4">
                {actions}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render modal in a portal to ensure it's rendered at the top level
  return createPortal(modalContent, document.body);
}
