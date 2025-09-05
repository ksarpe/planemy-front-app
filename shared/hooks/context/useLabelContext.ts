import { useContext } from "react";
import { LabelContext } from "../../context/LabelContext";

export const useLabelContext = () => {
  const context = useContext(LabelContext);
  if (!context) {
    throw new Error("useLabelContext must be used within a LabelProvider");
  }
  return context;
};
