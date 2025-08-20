import React, { useEffect, useMemo, useState } from "react";
import { X, Plus, Minus, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useShoppingContext } from "@/hooks/context/useShoppingContext";
import { useAddShoppingItem } from "@/hooks/shopping/useShoppingItems";
import type { FavoriteProductInterface, AddItemModalProps } from "@/data/Shopping";
import { SHOPPING_UNITS } from "@/data/Shopping/types";

function normalizeNumber(input: string): number | null {
  if (!input.trim()) return null;
  const n = Number(input.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function unitStepMin(unit: string) {
  const fractional = ["kg", "l", "L", "ml", "g"];
  if (fractional.includes(unit)) return { step: 0.1, min: 0.1 };
  if (unit === "szt") return { step: 1, min: 1 };
  return { step: 1, min: 0 }; // fallback
}

export function AddItemModal({ isOpen, onClose, listId }: AddItemModalProps) {
  const { categories, favoriteProducts } = useShoppingContext();
  const addItem = useAddShoppingItem();

  const [form, setForm] = useState({
    name: "",
    quantity: "1", // <-- string!
    unit: "szt",
    category: "Inne",
    price: "", // <-- string!
    notes: "",
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { step, min } = useMemo(() => unitStepMin(form.unit), [form.unit]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
        setForm({
          name: "",
          quantity: "1",
          unit: "szt",
          category: "Inne",
          price: "",
          notes: "",
        });
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFavorite = (fav: FavoriteProductInterface) => {
    setForm((s) => ({
      ...s,
      name: fav.name,
      category: fav.category,
      unit: fav.unit,
      price: fav.price ? String(fav.price) : "",
    }));
  };

  const bumpQty = (delta: number) => {
    const n = normalizeNumber(form.quantity) ?? (min || 1);
    const next = Math.max(min ?? 0, Math.round((n + delta * step) * 100) / 100);
    setForm((s) => ({ ...s, quantity: String(next) }));
  };

  const onQtyChange = (v: string) => {
    // pozwól na pusty string w trakcie edycji
    setForm((s) => ({ ...s, quantity: v }));
  };

  const onQtyBlur = () => {
    const n = normalizeNumber(form.quantity);
    if (n == null) {
      setForm((s) => ({ ...s, quantity: String(min ?? 1) }));
    } else {
      setForm((s) => ({ ...s, quantity: String(Math.max(min ?? 0, n)) }));
    }
  };

  const submit = async (e: React.FormEvent, closeAfter = true) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const qty = normalizeNumber(form.quantity);
    const price = normalizeNumber(form.price || "");

    const safeQty = qty == null ? min || 1 : Math.max(min ?? 0, qty);
    const safePrice = price == null ? 0 : Math.max(0, price);

    setSubmitting(true);
    try {
      await addItem.mutateAsync({
        listId,
        item: {
          name: form.name.trim(),
          quantity: safeQty,
          unit: form.unit,
          category: form.category,
          price: safePrice,
          isFavorite: false,
          isCompleted: false,
          notes: form.notes?.trim() || "",
        },
      });

      // reset lub przygotuj do kolejnego dodania
      setForm({ name: "", quantity: String(min || 1), unit: form.unit, category: "Inne", price: "", notes: "" });
      if (closeAfter) onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const cancel = () => {
    setForm({ name: "", quantity: "1", unit: "szt", category: "Inne", price: "", notes: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 grid place-items-center">
      <div className="bg-white rounded-xl p-4 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-gray-800">Dodaj przedmiot</h2>
          <button onClick={cancel} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        {favoriteProducts.length > 0 && (
          <div className="mb-3">
            <div className="text-xs text-gray-600 mb-1">Ulubione</div>
            <div className="flex gap-2 overflow-x-auto py-1">
              {favoriteProducts.slice(0, 5).map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleFavorite(f)}
                  className="shrink-0 px-2 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200 flex items-center gap-1">
                  <Star size={12} className="text-yellow-500" />
                  {f.name} <span className="text-gray-500">({f.unit})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={(e) => submit(e, true)} className="space-y-4">
          {/* Row 1: name */}
          <div>
            <input
              autoFocus
              placeholder="Nazwa produktu"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-[15px]
                         hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                         placeholder:text-gray-400 transition-colors"
              required
            />
          </div>

          {/* Row 2: qty controls + unit + price per unit */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-6 flex items-stretch gap-1">
              <button
                type="button"
                onClick={() => bumpQty(-1)}
                className="px-2 border border-gray-300 rounded-md bg-white text-gray-600
                           hover:bg-gray-50 active:bg-gray-100 transition-colors"
                aria-label="Zmniejsz ilość">
                <Minus size={16} />
              </button>
              <input
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                value={form.quantity}
                onChange={(e) => onQtyChange(e.target.value)}
                onBlur={onQtyBlur}
                className="w-full text-center px-2 py-2 border border-gray-300 rounded-md
                           hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                type="button"
                onClick={() => bumpQty(1)}
                className="px-2 border border-gray-300 rounded-md bg-white text-gray-600
                           hover:bg-gray-50 active:bg-gray-100 transition-colors"
                aria-label="Zwiększ ilość">
                <Plus size={16} />
              </button>
            </div>
            <div className="col-span-3">
              <select
                value={form.unit}
                onChange={(e) => setForm((s) => ({ ...s, unit: e.target.value }))}
                className="w-full px-2 py-2 border border-gray-300 rounded-md bg-white text-gray-700
                           hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                {SHOPPING_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-3">
              <input
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                placeholder="Cena/szt. (zł)"
                value={form.price}
                onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white
                           hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Kategorie – najczęstsze jako chipy + select */}
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {categories.slice(0, 6).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setForm((s) => ({ ...s, category: c.name }))}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-colors duration-150
                    ${
                      form.category === c.name
                        ? "bg-primary text-white border-transparent hover:bg-primary/90"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }
                  `}>
                  {c.name}
                </button>
              ))}
            </div>
            <select
              value={form.category}
              onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700
                         hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Advanced */}
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1 transition-colors">
            {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />} Więcej opcji
          </button>

          {showAdvanced && (
            <>
              <textarea
                placeholder="Notatki (opcjonalne)"
                rows={2}
                value={form.notes}
                onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md
                           hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={cancel}
              className="flex-1 border border-gray-300 rounded-md py-2 text-gray-700 hover:bg-gray-50 transition-colors">
              Anuluj
            </button>
            <button
              type="button"
              disabled={submitting || !form.name.trim()}
              onClick={(e) => submit(e, false)} // dodaj i czyść, ale nie zamykaj
              className="px-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              title="Ctrl/Cmd+Enter">
              Dodaj następny
            </button>
            <button
              type="submit"
              disabled={submitting || !form.name.trim()}
              className="flex-1 bg-primary text-white rounded-md py-2 hover:bg-primary/90 disabled:opacity-50">
              {submitting ? "Dodawanie..." : "Dodaj"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
