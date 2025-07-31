import { createContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuthContext";
import { useToast } from "@/hooks/useToastContext";
import { LabelInterface, LabelContextType } from "@/data/Utils/interfaces";
import {
  createLabel as createLabelFirebase,
  updateLabel as updateLabelFirebase,
  deleteLabel as deleteLabelFirebase,
  subscribeToUserLabels,
} from "@/api/labels";

const LabelContext = createContext<LabelContextType | undefined>(undefined);

export const LabelProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [labels, setLabels] = useState<LabelInterface[]>([]);
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

  // Get label by ID from current labels
  const getLabelById = (labelId: string): LabelInterface | undefined => {
    return labels.find((label) => label.id === labelId);
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
    // Utilities
    getLabelById,
    refreshLabels,
  };

  return <LabelContext.Provider value={contextValue}>{children}</LabelContext.Provider>;
};

export { LabelContext };
