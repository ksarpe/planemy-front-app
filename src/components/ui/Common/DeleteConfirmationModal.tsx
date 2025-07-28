import { AlertTriangle } from "lucide-react";
import BaseModal from "./BaseModal";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName: string;
  additionalInfo?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isLoading?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  additionalInfo,
  confirmButtonText = "Usuń",
  cancelButtonText = "Anuluj",
  isLoading = false,
}: DeleteConfirmationModalProps) {
  const actions = (
    <>
      <button
        onClick={onClose}
        disabled={isLoading}
        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50">
        {cancelButtonText}
      </button>
      <button
        onClick={onConfirm}
        disabled={isLoading}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50">
        {isLoading ? "Usuwanie..." : confirmButtonText}
      </button>
    </>
  );

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} showCloseButton={false} actions={actions}>
      <div className="flex items-start gap-3">
        <AlertTriangle size={24} className="text-red-500 flex-shrink-0 mt-1" />
        <div>
          <p className="text-gray-600 mb-2">
            {message} <span className="font-semibold">"{itemName}"</span>?
          </p>

          {additionalInfo && <p className="text-sm text-red-600">{additionalInfo}</p>}
        </div>
      </div>
    </BaseModal>
  );
}
