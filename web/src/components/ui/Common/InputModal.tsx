import { InputModalProps } from "@shared/data/Common/interfaces";
import { useEffect, useState } from "react";
import { Button } from "../shadcn/button";
import BaseModal from "./BaseModal";

/**
 * Reusable modal for forms with one or more input fields.
 *
 * Use cases:
 * - Create task list (single input)
 * - Change password (multiple inputs: old password, new password, confirm)
 * - Rename items (single input)
 * - Any form with 1-5 input fields
 *
 * @example
 * // Single input (create task list)
 * <InputModal
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   onSubmit={(values) => createList(values.name)}
 *   title="Utwórz nową listę"
 *   inputs={[{ name: 'name', label: 'Nazwa listy', placeholder: 'np. Zadania domowe' }]}
 *   submitButtonText="Utwórz"
 * />
 *
 * @example
 * // Multiple inputs (change password)
 * <InputModal
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   onSubmit={(values) => changePassword(values)}
 *   title="Zmień hasło"
 *   inputs={[
 *     { name: 'oldPassword', label: 'Stare hasło', type: 'password' },
 *     { name: 'newPassword', label: 'Nowe hasło', type: 'password' },
 *     { name: 'confirmPassword', label: 'Potwierdź hasło', type: 'password' }
 *   ]}
 *   submitButtonText="Zmień hasło"
 *   isLoading={isChangingPassword}
 * />
 */
export default function InputModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  inputs,
  submitButtonText = "Zapisz",
  cancelButtonText = "Anuluj",
  isLoading = false,
}: InputModalProps) {
  // Initialize state for all inputs
  const [values, setValues] = useState<Record<string, string>>(() =>
    inputs.reduce((acc, input) => ({ ...acc, [input.name]: input.defaultValue || "" }), {}),
  );

  // Reset values when modal closes
  useEffect(() => {
    if (!isOpen) {
      setValues(inputs.reduce((acc, input) => ({ ...acc, [input.name]: input.defaultValue || "" }), {}));
    }
  }, [isOpen, inputs]);

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all required inputs are filled
    const allFilled = inputs.every((input) => !input.required || values[input.name]?.trim());
    if (!allFilled) return;

    onSubmit(values);
  };

  const handleClose = () => {
    onClose();
  };

  // Check if form is valid
  const isValid = inputs.every((input) => !input.required || values[input.name]?.trim());

  const actions = (
    <>
      <Button onClick={handleClose} disabled={isLoading} variant="default">
        {cancelButtonText}
      </Button>
      <Button onClick={handleSubmit} disabled={!isValid || isLoading} variant="primary">
        {isLoading ? "Ładowanie..." : submitButtonText}
      </Button>
    </>
  );

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} title={title} showCloseButton={true} actions={actions}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {inputs.map((input) => (
            <div key={input.name}>
              <label className="block text-sm font-medium text-text-muted mb-2">
                {input.label}
                {input.required && <span className="text-negative ml-1">*</span>}
              </label>
              <input
                type={input.type || "text"}
                value={values[input.name] || ""}
                onChange={(e) => handleChange(input.name, e.target.value)}
                className="w-full px-3 py-2 border border-bg-muted-light bg-bg-alt text-text rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder={input.placeholder}
                disabled={isLoading}
                autoFocus={input.autoFocus}
              />
              {input.helperText && <p className="text-xs text-text-muted mt-1">{input.helperText}</p>}
            </div>
          ))}
        </div>
      </form>
    </BaseModal>
  );
}
