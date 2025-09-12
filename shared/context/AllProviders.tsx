import { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { AuthProvider } from "./AuthContext";
import { PreferencesProvider } from "./PreferencesContext";
//import { LabelProvider } from "./LabelContext";
import { ShoppingProvider } from "./ShoppingContext";
import { CalendarProvider } from "./CalendarContext";
import { TaskProvider } from "./TaskContext";
import { PaymentsProvider } from "./PaymentsContext";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PreferencesProvider>
          {/* <LabelProvider> */}
            <ShoppingProvider>
              <CalendarProvider>
                <TaskProvider>
                  <PaymentsProvider>{children}</PaymentsProvider>
                </TaskProvider>
              </CalendarProvider>
            </ShoppingProvider>
          {/* </LabelProvider> */}
        </PreferencesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
