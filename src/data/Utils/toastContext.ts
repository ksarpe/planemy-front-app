export interface ToastContextProps {
  showToast: (type: "success" | "error" | "warning", message: string) => void;
}
