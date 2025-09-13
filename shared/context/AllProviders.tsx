import { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { AuthProvider } from "./AuthContext";
import { PreferencesProvider } from "./PreferencesContext";
import { ShoppingProvider } from "./ShoppingContext";
import { CalendarProvider } from "./CalendarContext";
import { PaymentsProvider } from "./PaymentsContext";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PreferencesProvider>
          <ShoppingProvider>
            <CalendarProvider>
              <PaymentsProvider>{children}</PaymentsProvider>
            </CalendarProvider>
          </ShoppingProvider>
        </PreferencesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
