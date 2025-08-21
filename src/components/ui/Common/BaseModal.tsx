import { createPortal } from "react-dom";
import { useEffect } from "react";
import { X } from "lucide-react";
import { BaseModalProps } from "@/data/Common/interfaces";

export default function BaseModal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  maxWidth = "w-96",
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

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay/Background */}
      <div className="fixed inset-0 bg-black/60 transition-opacity" onClick={onClose} aria-hidden="true" />

      {/* Modal Content */}
      <div className={`relative bg-white rounded-lg shadow-xl ${maxWidth} max-h-[90vh] overflow-y-auto m-4`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            {showCloseButton && (
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            )}
          </div>

          <div className="mb-4">{children}</div>

          {actions && <div className="flex gap-2 justify-end border-t border-gray-100 pt-4">{actions}</div>}
        </div>
      </div>
    </div>
  );

  // Render modal in a portal to ensure it's rendered at the top level
  return createPortal(modalContent, document.body);
}
