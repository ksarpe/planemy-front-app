import { useState, useEffect } from "react";
import BaseModal from "./BaseModal";

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newName: string) => void;
  title: string;
  currentName: string;
  placeholder?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isLoading?: boolean;
  validateName?: (name: string) => boolean;
}

export default function RenameModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  currentName,
  placeholder = "Nowa nazwa",
  confirmButtonText = "Zapisz",
  cancelButtonText = "Anuluj",
  isLoading = false,
  validateName = (name) => name.trim().length > 0,
}: RenameModalProps) {
  const [newName, setNewName] = useState("");

  // Reset name when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setNewName(currentName);
    } else {
      setNewName("");
    }
  }, [isOpen, currentName]);

  const handleConfirm = () => {
    if (newName.trim() && newName.trim() !== currentName) {
      onConfirm(newName.trim());
    }
  };

  const handleClose = () => {
    setNewName("");
    onClose();
  };

  const isValid = validateName(newName) && newName.trim() !== currentName;

  const actions = (
    <>
      <button
        onClick={handleClose}
        disabled={isLoading}
        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50">
        {cancelButtonText}
      </button>
      <button
        onClick={handleConfirm}
        disabled={!isValid || isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
        {isLoading ? "Zapisywanie..." : confirmButtonText}
      </button>
    </>
  );

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} title={title} actions={actions} centered={false}>
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
        autoFocus
        disabled={isLoading}
        onKeyDown={(e) => {
          if (e.key === "Enter" && isValid) {
            handleConfirm();
          }
          if (e.key === "Escape") {
            handleClose();
          }
        }}
      />
    </BaseModal>
  );
}
