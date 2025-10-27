import { createContext, useMemo, type PropsWithChildren } from "react";
import type { LabelInterface } from "../data/Utils/interfaces";
import { useLabelConnections, useLabels } from "../hooks/labels/useLabels";

// Simplified connection structure for efficient lookups
interface LabelConnectionItem {
  objectId: string;
  labelId: string;
}

// Dictionary organized by object_type (e.g., "events", "tasks")
type LabelConnectionsByType = Record<string, LabelConnectionItem[]>;

interface LabelContextType {
  labels: LabelInterface[];
  isLoadingLabels: boolean;
  labelConnections: LabelConnectionsByType;
  isLoadingConnections: boolean;
  // Helper function to get labels for specific object
  getLabelForObject: (objectType: string, objectId: string) => LabelInterface | undefined;
}

export const LabelContext = createContext<LabelContextType | undefined>(undefined);

export function LabelProvider({ children }: PropsWithChildren) {
  const { data: labelsData, isLoading: isLoadingLabels } = useLabels();
  // Fetch ALL label connections (no filters)
  const { data: connectionsData, isLoading: isLoadingConnections } = useLabelConnections();

  // Get ALL Labels (NO PAGINATION)
  const labels = useMemo(() => {
    // Check if labelsData exists and has items array
    if (labelsData && Array.isArray(labelsData.items)) {
      return labelsData.items;
    }
    return [];
  }, [labelsData]);

  // Transform connections into organized dictionary by object_type
  // EASY ACCESS THEN, example:
  // labelConnections["event"] => [{ objectId: "event1", labelId: "labelA" }, ...]
  const labelConnections = useMemo(() => {
    const connectionsByType: LabelConnectionsByType = {};

    // Check if connectionsData exists and has items array
    if (connectionsData && Array.isArray(connectionsData.items)) {
      connectionsData.items.forEach((connection) => {
        const { entity_type, entity_id, label_id } = connection;

        // Initialize array for this entity_type if it doesn't exist
        if (!connectionsByType[entity_type]) {
          connectionsByType[entity_type] = [];
        }

        // Add simplified connection
        connectionsByType[entity_type].push({
          objectId: entity_id,
          labelId: label_id,
        });
      });
    }

    return connectionsByType;
  }, [connectionsData]);

  //Todo: CHECK IF NEEDED?
  const getLabelForObject = useMemo(
    () =>
      (objectType: string, objectId: string): LabelInterface | undefined => {
        const connectionsForType = labelConnections[objectType];
        if (!connectionsForType) return undefined;
        // Find the first labelId for this specific object
        const connection = connectionsForType.find((conn) => conn.objectId === objectId);
        if (!connection) return undefined;

        // Return the full label object
        console.log(labels.find((label) => label.id === connection.labelId));
        return labels.find((label) => label.id === connection.labelId);
      },
    [labelConnections, labels],
  );

  return (
    <LabelContext.Provider
      value={{
        labels,
        isLoadingLabels,
        labelConnections,
        isLoadingConnections,
        getLabelForObject,
      }}>
      {children}
    </LabelContext.Provider>
  );
}
