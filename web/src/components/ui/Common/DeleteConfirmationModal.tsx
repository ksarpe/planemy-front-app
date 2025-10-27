import { DeleteConfirmationModalProps } from "@shared/data/Common/interfaces";
import { AlertTriangle } from "lucide-react";
import { Button } from "../shadcn/button";
import BaseModal from "./BaseModal";

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
      <Button onClick={onClose} disabled={isLoading} variant="default">
        {cancelButtonText}
      </Button>
      <Button onClick={onConfirm} disabled={isLoading} variant="delete">
        {isLoading ? "Removing..." : confirmButtonText}
      </Button>
    </>
  );

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} showCloseButton={false} actions={actions}>
      <div className="flex items-start gap-3">
        <AlertTriangle size={24} className="text-red-500 flex-shrink-0 mt-1" />
        <div>
          <p className="text-text-muted-more mb-2">
            {message} <span className="font-semibold">"{itemName}"</span>?
          </p>

          {additionalInfo && <p className="text-sm text-red-600">{additionalInfo}</p>}
        </div>
      </div>
    </BaseModal>
  );
}
