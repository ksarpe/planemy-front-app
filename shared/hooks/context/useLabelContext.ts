import { useContext } from "react";
import { LabelContext } from "../../context/LabelContext";

export function useLabelContext() {
  const context = useContext(LabelContext);
  if (!context) {
    throw new Error("useLabelContext must be used within LabelProvider");
  }
  return context;
}
