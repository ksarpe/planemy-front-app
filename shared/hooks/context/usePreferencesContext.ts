import { use } from "react";
import { PreferencesContext } from "@shared/context/PreferencesContext";

export function usePreferencesContext() {
  const context = use(PreferencesContext);
  if (!context) {
    throw new Error("usePreferencesContext must be used within PreferencesProvider");
  }
  return context;
}