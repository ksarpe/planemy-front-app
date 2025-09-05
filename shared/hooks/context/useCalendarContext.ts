import { use } from "react";
import { CalendarContext } from "../../context/CalendarContext";

export const useCalendarContext = () => {
  const context = use(CalendarContext);
  if (!context) {
    throw new Error("useLabelContext must be used within a LabelProvider");
  }
  return context;
};
