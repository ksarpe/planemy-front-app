import { createContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuthContext";
import { useToast } from "@/hooks/useToastContext";
import { LabelInterface } from "@/data/Utils/interfaces";
import {
  createLabel as createLabelFirebase,
  updateLabel as updateLabelFirebase,
  deleteLabel as deleteLabelFirebase,
  subscribeToUserLabels,
  searchLabels,
  getLabelsByColor,
  bulkDeleteLabels,
} from "@/api/labels";

interface LabelContextType {
  // Data
  labels: LabelInterface[];
  loading: boolean;
  error: string | null;

  // CRUD Operations
  createLabel: (name: string, color: string, description?: string) => Promise<void>;
  updateLabel: (labelId: string, updates: Partial<LabelInterface>) => Promise<void>;
  deleteLabel: (labelId: string) => Promise<void>;
  bulkDelete: (labelIds: string[]) => Promise<void>;

  // Search & Filter
  searchLabelsByName: (searchTerm: string) => Promise<LabelInterface[]>;
  filterByColor: (color: string) => Promise<LabelInterface[]>;

  // Utilities
  getLabelById: (labelId: string) => LabelInterface | undefined;
  refreshLabels: () => void;
}

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

  // Bulk delete labels
  const bulkDelete = async (labelIds: string[]): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await bulkDeleteLabels(labelIds);
      showToast("success", `Usunięto ${labelIds.length} etykiet!`);
    } catch (error) {
      console.error("Error bulk deleting labels:", error);
      const errorMessage = error instanceof Error ? error.message : "Błąd podczas usuwania etykiet";
      setError(errorMessage);
      showToast("error", errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Search labels by name
  const searchLabelsByName = async (searchTerm: string): Promise<LabelInterface[]> => {
    if (!user) return [];

    try {
      setError(null);
      return await searchLabels(user.uid, searchTerm);
    } catch (error) {
      console.error("Error searching labels:", error);
      const errorMessage = error instanceof Error ? error.message : "Błąd podczas wyszukiwania etykiet";
      setError(errorMessage);
      return [];
    }
  };

  // Filter labels by color
  const filterByColor = async (color: string): Promise<LabelInterface[]> => {
    if (!user) return [];

    try {
      setError(null);
      return await getLabelsByColor(user.uid, color);
    } catch (error) {
      console.error("Error filtering labels by color:", error);
      const errorMessage = error instanceof Error ? error.message : "Błąd podczas filtrowania etykiet";
      setError(errorMessage);
      return [];
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
    bulkDelete,

    // Search & Filter
    searchLabelsByName,
    filterByColor,

    // Utilities
    getLabelById,
    refreshLabels,
  };

  return <LabelContext.Provider value={contextValue}>{children}</LabelContext.Provider>;
};

export { LabelContext };
