import { createContext, useMemo, type PropsWithChildren } from "react";
import type { LabelInterface } from "../data/Utils/interfaces";
import { useAuthContext } from "../hooks/context/useAuthContext";
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
  // Helper function to get label for specific object (returns single label since max 1 per object)
  getLabelForObject: (objectType: string, objectId: string) => LabelInterface | undefined;
  // Helper to check if object has a label connection
  hasLabel: (objectType: string, objectId: string) => boolean;
}

export const LabelContext = createContext<LabelContextType | undefined>(undefined);

export function LabelProvider({ children }: PropsWithChildren) {
  // Sprawdź czy użytkownik jest zalogowany - jeśli nie, nie wykonuj queries
  const { user } = useAuthContext();

  // Wykonaj queries TYLKO gdy user jest zalogowany (enabled: !!user)
  const { data: labelsData, isLoading: isLoadingLabels } = useLabels({ enabled: !!user });
  // Fetch ALL label connections (no filters) - tylko gdy user zalogowany
  const { data: connectionsData, isLoading: isLoadingConnections } = useLabelConnections(undefined, undefined, { enabled: !!user });

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
        // Find the first labelId for this specific object (should only be one)
        const connection = connectionsForType.find((conn) => conn.objectId === objectId);
        if (!connection) return undefined;

        // Return the full label object
        return labels.find((label) => label.id === connection.labelId);
      },
    [labelConnections, labels],
  );

  const hasLabel = useMemo(
    () =>
      (objectType: string, objectId: string): boolean => {
        const connectionsForType = labelConnections[objectType];
        if (!connectionsForType) return false;
        return connectionsForType.some((conn) => conn.objectId === objectId);
      },
    [labelConnections],
  );

  return (
    <LabelContext.Provider
      value={{
        labels,
        isLoadingLabels,
        labelConnections,
        isLoadingConnections,
        getLabelForObject,
        hasLabel,
      }}>
      {children}
    </LabelContext.Provider>
  );
}
