import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // <-- 1. Import
import { PropsWithChildren } from "react";
import { queryClient } from "../lib/queryClient";
import { AuthProvider } from "./AuthContext";
import { LabelProvider } from "./LabelContext";
import { PreferencesProvider } from "./PreferencesContext";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PreferencesProvider>
          <LabelProvider>{children}</LabelProvider>
        </PreferencesProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
