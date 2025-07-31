import { PropsWithChildren } from "react";
import { AuthProvider } from "./AuthContext";
import { ToastProvider } from "./ToastContext";
import { PreferencesProvider } from "./PreferencesContext";
import { LabelProvider } from "./LabelContext";
import { ShoppingProvider } from "./ShoppingContext";
import { CalendarProvider } from "./CalendarContext";
import { TaskProvider } from "./TaskContext";
import { PaymentsProvider } from "./PaymentsContext";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <ToastProvider>
        <PreferencesProvider>
          <LabelProvider>
            <ShoppingProvider>
              <CalendarProvider>
                <TaskProvider>
                  <PaymentsProvider>{children}</PaymentsProvider>
                </TaskProvider>
              </CalendarProvider>
            </ShoppingProvider>
          </LabelProvider>
        </PreferencesProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
