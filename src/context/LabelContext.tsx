import { createContext, useState, useEffect, ReactNode } from "react";
import { useAuthContext } from "@/hooks/context/useAuthContext";
import { useToastContext } from "@/hooks/context/useToastContext";
import { LabelInterface, LabelContextType } from "@/data/Utils/interfaces";
import {
  createLabel as createLabelFirebase,
  updateLabel as updateLabelFirebase,
  deleteLabel as deleteLabelFirebase,
  subscribeToUserLabels,
  createLabelConnectionFirebase,
  removeLabelConnectionFirebase,
  removeAllLabelConnectionsForObject,
  useLabelConnections as useLabelConnectionsFirebase,
} from "@/api/labels";

const LabelContext = createContext<LabelContextType | undefined>(undefined);

export const LabelProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  const { showToast } = useToastContext();

  const [labels, setLabels] = useState<LabelInterface[]>([]);
  const labelConnectionsByType = useLabelConnectionsFirebase();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to labels when user changes
  useEffect(() => {
    if (!user) {
      setLabels([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToUserLabels(user.uid, (newLabels) => {
      setLabels(newLabels);
      setLoading(false);
      setError(null);
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  // Create new label
  const createLabel = async (name: string, color: string, description?: string): Promise<void> => {
    if (!user) {
      showToast("error", "Musisz być zalogowany, aby utworzyć etykietę");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await createLabelFirebase(name, color, user.uid, description);
      showToast("success", "Etykieta została utworzona!");
    } catch (error) {
      console.error("Error creating label:", error);
      const errorMessage = error instanceof Error ? error.message : "Błąd podczas tworzenia etykiety";
      setError(errorMessage);
      showToast("error", errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update label
  const updateLabel = async (labelId: string, updates: Partial<LabelInterface>): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await updateLabelFirebase(labelId, updates);
      showToast("success", "Etykieta została zaktualizowana!");
    } catch (error) {
      console.error("Error updating label:", error);
      const errorMessage = error instanceof Error ? error.message : "Błąd podczas aktualizacji etykiety";
      setError(errorMessage);
      showToast("error", errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete label
  const deleteLabel = async (labelId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await deleteLabelFirebase(labelId);
      showToast("success", "Etykieta została usunięta!");
    } catch (error) {
      console.error("Error deleting label:", error);
      const errorMessage = error instanceof Error ? error.message : "Błąd podczas usuwania etykiety";
      setError(errorMessage);
      showToast("error", errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createLabelConnection = async (objectId: string, objectType: string, labelId: string): Promise<void> => {
    if (!user) {
      showToast("error", "Musisz być zalogowany, aby dodać etykietę");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log(user.uid);
      // Implement the logic to create a label connection in your database
      // This is a placeholder function, replace with actual implementation
      await createLabelConnectionFirebase(user.uid, objectId, objectType, labelId);
      showToast("success", "Etykieta została dodana do obiektu!");
    } catch (error) {
      console.error("Error creating label connection:", error);
      const errorMessage = error instanceof Error ? error.message : "Błąd podczas dodawania etykiety";
      setError(errorMessage);
      showToast("error", errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeLabelConnection = async (objectId: string, objectType: string, labelId: string): Promise<void> => {
    if (!user) {
      showToast("error", "Musisz być zalogowany, aby usunąć etykietę");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await removeLabelConnectionFirebase(user.uid, objectId, objectType, labelId);
      showToast("success", "Etykieta została usunięta z obiektu!");
    } catch (error) {
      console.error("Error removing label connection:", error);
      const errorMessage = error instanceof Error ? error.message : "Błąd podczas usuwania etykiety";
      setError(errorMessage);
      showToast("error", errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeAllLabelsFromObject = async (objectId: string, objectType: string): Promise<void> => {
    if (!user) {
      showToast("error", "Musisz być zalogowany, aby usunąć etykiety");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await removeAllLabelConnectionsForObject(user.uid, objectId, objectType);
      showToast("success", "Wszystkie etykiety zostały usunięte z obiektu!");
    } catch (error) {
      console.error("Error removing all label connections:", error);
      const errorMessage = error instanceof Error ? error.message : "Błąd podczas usuwania etykiet";
      setError(errorMessage);
      showToast("error", errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get label by ID from current labels
  const getLabelById = (labelId: string): LabelInterface | undefined => {
    return labels.find((label) => label.id === labelId);
  };

  // Get labels for a specific object
  const getLabelsForObject = (objectId: string, objectType: string): LabelInterface[] => {
    const typeMap = labelConnectionsByType.get(objectType);
    if (!typeMap) return [];
    return typeMap.get(objectId) || [];
  };

  // Check if object has a specific label
  const hasLabel = (objectId: string, objectType: string, labelId: string): boolean => {
    const objectLabels = getLabelsForObject(objectId, objectType);
    return objectLabels.some((label) => label.id === labelId);
  };

  // Manually refresh labels (if needed)
  const refreshLabels = () => {
    if (!user) return;

    setLoading(true);
    // The subscription will automatically update labels
    // This is just to show loading state if needed
    setTimeout(() => setLoading(false), 500);
  };

  const contextValue: LabelContextType = {
    // Data
    labels,
    loading,
    error,

    // CRUD Operations
    createLabel,
    updateLabel,
    deleteLabel,

    //Label Connections
    createLabelConnection,
    removeLabelConnection,
    removeAllLabelsFromObject,
    labelConnectionsByType,

    // Utilities
    getLabelById,
    getLabelsForObject,
    hasLabel,
    refreshLabels,
  };

  return <LabelContext.Provider value={contextValue}>{children}</LabelContext.Provider>;
};

export { LabelContext };
