export interface ToastContextProps {
  showToast: (type: "success" | "error" | "warning", message: string) => void;
}

export interface ToastService {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}
