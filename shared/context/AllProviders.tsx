import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // <-- 1. Import
import { PropsWithChildren } from "react";
import { queryClient } from "../lib/queryClient";
import { AuthProvider } from "./AuthContext";
import { LabelProvider } from "./LabelContext";
import { PaymentsProvider } from "./PaymentsContext";
import { PreferencesProvider } from "./PreferencesContext";
import { ShoppingProvider } from "./ShoppingContext";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PreferencesProvider>
          <LabelProvider>
            <ShoppingProvider>
              <PaymentsProvider>{children}</PaymentsProvider>
            </ShoppingProvider>
          </LabelProvider>
        </PreferencesProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
