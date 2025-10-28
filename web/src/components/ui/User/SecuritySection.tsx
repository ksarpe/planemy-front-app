import { useT } from "@shared/hooks/utils/useT";
import { useState } from "react";
import { InputModal } from "../Common";
import { Button } from "../shadcn/button";

export default function SecuritySection() {
  const { t } = useT();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async (values: Record<string, string>) => {
    // Validate passwords match
    if (values.newPassword !== values.confirmPassword) {
      alert("Hasła nie są zgodne!");
      return;
    }

    setIsChangingPassword(true);
    try {
      // TODO: Call API to change password
      console.log("Changing password:", {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsChangePasswordModalOpen(false);
      alert("Hasło zostało zmienione!");
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Błąd podczas zmiany hasła");
    } finally {
      setIsChangingPassword(false);
    }
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
