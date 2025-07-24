import { useState } from "react";
import { EventInterface } from "@/data/types";

export const useEvents = (): EventInterface[] => {
  const [events] = useState<EventInterface[]>([]);
  return events;
};
