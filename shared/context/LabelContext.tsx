import { createContext, ReactNode } from "react";
import { LabelInterface, LabelContextType } from "../data/Utils/interfaces";
import {
  useLabels,
  //useLabelConnections,
  useCreateLabel,
  useUpdateLabel,
  useDeleteLabel,
  useCreateLabelConnection,
  useRemoveLabelConnection,
  useRemoveAllLabelConnections,
} from "../hooks/labels";

const LabelContext = createContext<LabelContextType | undefined>(undefined);

export const LabelProvider = ({ children }: { children: ReactNode }) => {
  // Używamy nowych hooków React Query
  const { data: labels = [], isLoading: loading, error: queryError } = useLabels();
  //const labelConnectionsByType = useLabelConnections();

  // Mutations
  const createLabelMutation = useCreateLabel();
  const updateLabelMutation = useUpdateLabel();
  const deleteLabelMutation = useDeleteLabel();
  const createConnectionMutation = useCreateLabelConnection();
  const removeConnectionMutation = useRemoveLabelConnection();
  const removeAllConnectionsMutation = useRemoveAllLabelConnections();

  const error = queryError?.message || null;

  // Create new label
  const createLabel = async (name: string, color: string, description?: string): Promise<void> => {
    await createLabelMutation.mutateAsync({ name, color, description });
  };

  // Update label
  const updateLabel = async (labelId: string, updates: Partial<LabelInterface>): Promise<void> => {
    await updateLabelMutation.mutateAsync({ labelId, updates });
  };

  // Delete label
  const deleteLabel = async (labelId: string): Promise<void> => {
    await deleteLabelMutation.mutateAsync(labelId);
  };

  // Create label connection
  const createLabelConnection = async (objectId: string, objectType: string, labelId: string): Promise<void> => {
    await createConnectionMutation.mutateAsync({ objectId, objectType, labelId });
  };

  // Remove label connection
  const removeLabelConnection = async (objectId: string, objectType: string, labelId: string): Promise<void> => {
    await removeConnectionMutation.mutateAsync({ objectId, objectType, labelId });
  };

  // Remove all labels from object
  const removeAllLabelsFromObject = async (objectId: string, objectType: string): Promise<void> => {
    await removeAllConnectionsMutation.mutateAsync({ objectId, objectType });
  };

  // Get label by ID from current labels
  const getLabelById = (labelId: string): LabelInterface | undefined => {
    return labels.find((label) => label.id === labelId);
  };

  // Get labels for a specific object
  // const getLabelsForObject = (objectId: string, objectType: string): LabelInterface[] => {
  //   const typeMap = labelConnectionsByType.get(objectType);
  //   if (!typeMap) return [];
  //   return typeMap.get(objectId) || [];
  // };

  // Check if object has a specific label
  // const hasLabel = (objectId: string, objectType: string, labelId: string): boolean => {
  //   const objectLabels = getLabelsForObject(objectId, objectType);
  //   return objectLabels.some((label) => label.id === labelId);
  // };

  // Manually refresh labels (jeśli potrzebne)
  const refreshLabels = () => {
    // W React Query to nie jest potrzebne, ale zostawiamy dla kompatybilności API
  };

  const contextValue: LabelContextType = {
    // Data
    labels,
    loading: loading || createLabelMutation.isPending || updateLabelMutation.isPending || deleteLabelMutation.isPending,
    error,

    // CRUD Operations
    createLabel,
    updateLabel,
    deleteLabel,

    // Label Connections
    createLabelConnection,
    removeLabelConnection,
    removeAllLabelsFromObject,
    //labelConnectionsByType,

    // Utilities
    getLabelById,
    //getLabelsForObject,
    //hasLabel,
    refreshLabels,
  };

  return <LabelContext.Provider value={contextValue}>{children}</LabelContext.Provider>;
};

export { LabelContext };
