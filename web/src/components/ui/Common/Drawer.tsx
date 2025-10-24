import { X } from "lucide-react";
import { ReactNode } from "react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: "sm" | "md" | "lg" | "full"; // Different width options
  position?: "left" | "right"; // Slide from left or right
  showOverlay?: boolean;
  headerActions?: ReactNode; // Optional actions in header (e.g., delete button)
}

const widthClasses = {
  sm: "w-80 sm:w-96",
  md: "w-96 sm:w-[32rem]",
  lg: "w-full sm:w-[40rem]",
  full: "w-full",
};

export function Drawer({
  isOpen,
  onClose,
  title = "",
  children,
  width = "sm",
  position = "right",
  showOverlay = true,
  headerActions,
}: DrawerProps) {
  const slideDirection = position === "right" ? "translate-x-full" : "-translate-x-full";

  return (
    <>
      {/* Overlay */}
      {showOverlay && (
        <div
          className={`fixed inset-0 z-40 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden={isOpen ? "false" : "true"}
          onClick={onClose}>
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      {/* Drawer */}
      <div
        role="dialog"
        aria-label={title}
        className={`fixed ${position}-0 h-9/10 ${
          widthClasses[width]
        } border-0 rounded-l-2xl max-w-full bg-bg-alt border-${
          position === "right" ? "l" : "r"
        } border-bg-hover shadow-xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : slideDirection
        }`}
        style={{
          top: "calc(50% - (90vh / 2))", // 90vh is h-9/10, so half the remaining space
        }}
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-2 border-b border-bg-muted-light rounded-tl-2xl bg-bg-alt sticky top-0 z-10">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text hover:bg-bg-muted-light cursor-pointer rounded-lg p-2 transition-colors"
              aria-label="Close panel">
              <X size={24} />
            </button>
            {headerActions}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto scrollbar-hide">{children}</div>
      </div>
    </>
  );
}
