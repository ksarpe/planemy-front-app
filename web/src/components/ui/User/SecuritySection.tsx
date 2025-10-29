import { APIError } from "@shared/data/Auth";
import { useChangePassword } from "@shared/hooks/auth";
import { useToast } from "@shared/hooks/toasts/useToast";
import { useT } from "@shared/hooks/utils/useT";
import { useState } from "react";
import { InputModal } from "../Common";
import { Button } from "../shadcn/button";

export default function SecuritySection() {
  const { t } = useT();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const { showError, showSuccess } = useToast();

  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword({
    onSuccess: () => {
      setIsChangePasswordModalOpen(false);
      showSuccess("Hasło zostało pomyślnie zmienione!");
    },
    onError: (error: APIError) => {
      //const errorMessage = getErrorMessage(error);
      if (error.status === 401) {
        showError("Obecne hasło jest niepoprawne.");
      }
    },
  });

  const handleChangePassword = (values: Record<string, string>) => {
    // Validate passwords match
    if (values.newPassword !== values.confirmPassword) {
      showError("Nowe hasło i potwierdzenie nie są zgodne.");
      return;
    }

    // Call mutation with React Query callbacks
    changePassword({
      currentPassword: values.oldPassword,
      newPassword: values.newPassword,
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex gap-4 items-center flex-wrap">
          <Button onClick={() => setIsChangePasswordModalOpen(true)} variant="default_light">
            {t("security.changePassword")}
          </Button>
          <Button variant="delete">{t("security.deleteAccount")}</Button>
        </div>
      </div>

      <InputModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSubmit={handleChangePassword}
        title="Zmień hasło"
        inputs={[
          {
            name: "oldPassword",
            label: "Obecne hasło",
            type: "password",
            placeholder: "Wprowadź obecne hasło",
            required: true,
            autoFocus: true,
          },
          {
            name: "newPassword",
            label: "Nowe hasło",
            type: "password",
            placeholder: "Wprowadź nowe hasło",
            required: true,
            helperText: "Hasło powinno mieć minimum 8 znaków",
          },
          {
            name: "confirmPassword",
            label: "Potwierdź nowe hasło",
            type: "password",
            placeholder: "Potwierdź nowe hasło",
            required: true,
          },
        ]}
        submitButtonText="Zmień hasło"
        cancelButtonText="Anuluj"
        isLoading={isChangingPassword}
      />
    </>
  );
}
