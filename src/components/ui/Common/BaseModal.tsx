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
  centered = true,
}: BaseModalProps) {
  if (!isOpen) return null;

  return (
    <div className={`fixed ${centered ? "inset-0" : ""} flex items-center justify-center z-50`}>
      <div className={`bg-white rounded-lg p-6 ${maxWidth} shadow-xl max-h-[90vh] overflow-y-auto`}>
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
  );
}
