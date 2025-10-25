import { createContext, useMemo, type PropsWithChildren } from "react";
import type { LabelInterface } from "../data/Utils/interfaces";
import { useLabels } from "../hooks/labels/useLabels";

interface LabelContextType {
  labels: LabelInterface[];
  isLoadingLabels: boolean;
}

export const LabelContext = createContext<LabelContextType | undefined>(undefined);

export function LabelProvider({ children }: PropsWithChildren) {
  const { data: labelsData, isLoading: isLoadingLabels } = useLabels();

  const labels = useMemo(() => {
    // Check if labelsData exists and has items array
    if (labelsData && Array.isArray(labelsData.items)) {
      return labelsData.items;
    }
    return [];
  }, [labelsData]);

  return (
    <LabelContext.Provider
      value={{
        labels,
        isLoadingLabels,
      }}>
      {children}
    </LabelContext.Provider>
  );
}
