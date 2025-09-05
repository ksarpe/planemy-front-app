import { use } from "react";
import { ShoppingContext } from "../../context/ShoppingContext";

export const useShoppingContext = () => {
  const context = use(ShoppingContext);
  if (!context) {
    throw new Error("useShoppingContext must be used within a ShoppingProvider");
  }
  return context;
};
