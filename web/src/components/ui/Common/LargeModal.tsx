import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface LargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
  height?: string;
  showOverlay?: boolean;
  preventCloseOnOutsideClick?: boolean;
}

/**
 * LargeModal - Reusable large modal component for complex UIs
 *
 * Use this for:
 * - Settings panels with tabs
 * - Complex forms with multiple sections
 * - Any modal that needs custom header/footer/layout
 *
 * For simple modals with title/content/actions, use BaseModal instead.
 */
export default function LargeModal({
  isOpen,
  onClose,
  children,
  maxWidth = "max-w-5xl",
  height = "h-[85vh]",
  showOverlay = true,
  preventCloseOnOutsideClick = false,
}: LargeModalProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !preventCloseOnOutsideClick) {
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
  }, [isOpen, onClose, preventCloseOnOutsideClick]);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    if (!preventCloseOnOutsideClick) {
      onClose();
    }
  };

  const modalContent = (
    <>
      {/* Overlay */}
      {showOverlay && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`bg-bg-alt rounded-2xl shadow-2xl w-full ${maxWidth} ${height} overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true">
          {children}
        </div>
      </div>
    </>
  );

  // Render modal in a portal to escape parent containers
  return createPortal(modalContent, document.body);
}

// Subcomponents for structured modal layout
export function LargeModalHeader({ children, onClose }: { children: ReactNode; onClose?: () => void }) {
  return (
    <div className="flex items-center justify-between px-8 py-6 border-b border-bg-muted-light flex-shrink-0">
      {children}
      {onClose && (
        <button
          onClick={onClose}
          className="p-2.5 rounded-lg hover:bg-bg-muted-light transition-all text-text-muted hover:text-text"
          aria-label="Close modal">
          <X size={24} />
        </button>
      )}
    </div>
  );
}

export function LargeModalContent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex-1 overflow-hidden ${className}`}>{children}</div>;
}

export function LargeModalFooter({ children, show = true }: { children: ReactNode; show?: boolean }) {
  if (!show) return null;

  return (
    <div className="border-t border-bg-muted-light p-6 bg-bg flex items-center justify-between flex-shrink-0">
      {children}
    </div>
  );
}
