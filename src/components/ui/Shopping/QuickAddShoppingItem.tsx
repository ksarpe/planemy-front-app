import { useState, useRef, useEffect } from "react";
import { Plus, X, Check } from "lucide-react";
import { useAddShoppingItem } from "@/hooks/shopping/useShoppingItems";
import type { QuickAddShoppingItemProps } from "@/data/Shopping/Components/ShoppingComponentInterfaces";

export default function QuickAddShoppingItem({ listId, onCancel }: QuickAddShoppingItemProps) {
  const addItem = useAddShoppingItem();
  const [itemName, setItemName] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };

    // Add listener to document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup - remove listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCancel]);

  const handleSubmit = async () => {
    if (!itemName.trim() || !listId) return;

    try {
      await addItem.mutateAsync({
        listId,
        item: {
          name: itemName.trim(),
          quantity: 1,
          unit: "szt",
          category: "Inne",
          price: 0,
          isFavorite: false,
          isCompleted: false,
          notes: "",
        },
      });
      // Clear and close immediately - optimistic mutation will handle visibility
      setItemName("");
      onCancel();
    } catch (error) {
      console.error("Error adding shopping item:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div ref={containerRef} className="border-l-4 border-success rounded-md p-4 bg-green-50 dark:bg-green-900/20 hover:shadow-md mb-3">
      <div className="flex items-center gap-3">
        {/* Plus Icon */}
        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
          <Plus size={16} className="text-success" />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Wpisz nazwę produktu..."
          autoFocus
          className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Confirm Button */}
          <button 
            onClick={handleSubmit} 
            className="p-1 text-success cursor-pointer hover:text-success-hover" 
            title="Dodaj produkt (Enter)"
          >
            <Check size={16} />
          </button>

          {/* Cancel Button */}
          <button 
            onClick={onCancel} 
            className="p-1 text-red-400 cursor-pointer hover:text-red-500" 
            title="Anuluj (Escape)"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}