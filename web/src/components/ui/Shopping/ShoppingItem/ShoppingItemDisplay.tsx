import { Check, Edit2, Heart, Trash2 } from "lucide-react";
import { CategoryEmoji } from "../Common/CategoryEmoji";
import { QtyStepper } from "../Common/QtyStepper";
import type { ShoppingItemDisplayProps } from "@shared/data/Shopping/UI/ShoppingItemInterfaces";

export function ShoppingItemDisplay({
  item,
  isFavorited,
  totalPrice,
  onToggleComplete,
  onContainerClick,
  onQuantityChange,
  onEdit,
  onToggleFavorite,
  onDelete,
  favoriteLoading = false,
  deleteLoading = false,
}: ShoppingItemDisplayProps) {
  return (
    // Main container
    <div className="flex items-center gap-2 cursor-pointer" onClick={onContainerClick}>
      {/* Checkbox */}
      <button
        onClick={onToggleComplete}
        className={[
          "h-5 w-5 rounded-full border-2 flex items-center justify-center", //centering for checkmark inside
          item.isCompleted ? "border-success bg-success text-white" : "text-text-light hover:border-success-hover",
        ].join(" ")}
        aria-label={item.isCompleted ? "Odznacz jako niekupione" : "Zaznacz jako kupione"}>
        {item.isCompleted && <Check size={12} />}
      </button>

      {/* Category Emoji */}
      <CategoryEmoji category={item.category} />

      {/* Main Content (flex-1 to fill whole container) */}
      {/* FOR COMPLETED ITEM, only name */}
      <div className="flex-1">
        {item.isCompleted ? (
          // Completed item: Only show name with line-through
          <div className="flex gap-2 items-center">
            <h4 className="text-sm md:text-base line-through text-text-light" title={item.name}>
              {item.name}
            </h4>
          </div>
        ) : (
          // Active item: Show all details
          <>
            {/* div for first part (text + qty + price) */}
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              {/* Name (and favorite for mobile)*/}
              <div className="flex gap-2 items-center">
                <h4 className="font-medium text-sm md:text-base text-text" title={item.name}>
                  {item.name}
                </h4>
                {isFavorited && <Heart size={14} className="text-yellow-500 flex sm:hidden" />}
              </div>

              {/* Quantity, unit, and price */}
              <div className="mt-2 md:mt-0 flex items-center gap-x-2 text-text-light flex-shrink-0">
                {/* Desktop quantity stepper */}
                <span className="">
                  <QtyStepper
                    value={item.quantity}
                    onDecrease={() => onQuantityChange(item.quantity - 1)}
                    onIncrease={() => onQuantityChange(item.quantity + 1)}
                    disabledDecrease={item.quantity <= 1}
                  />
                </span>
                {/* Quantity and unit display */}
                <span className="whitespace-nowrap text-xs md:text-sm text-text-light">{item.unit}</span>
                {/* Total price */}
                {totalPrice && <span className="text-xs md:text-sm text-text-light">{totalPrice}</span>}
              </div>
            </div>

            {/* Notes */}
            {item.notes && <div className="mt-2 text-xs text-text-light">{item.notes}</div>}
          </>
        )}
      </div>

      {/* Actions column - only show when not completed */}
      {!item.isCompleted && (
        <div>
          {/* Desktop actions */}
          <div className="hidden md:flex gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              disabled={favoriteLoading}
              className=" text-text-light hover:text-yellow-500 disabled:opacity-50 cursor-pointer"
              title={isFavorited ? "Usuń z ulubionych" : "Dodaj do ulubionych"}>
              <Heart
                size={16}
                fill={isFavorited ? "currentColor" : "none"}
                className={isFavorited ? "text-yellow-600" : ""}
              />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className=" text-text-light hover:text-text-muted  cursor-pointer"
              title="Edytuj">
              <Edit2 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              disabled={deleteLoading}
              className=" text-text-light hover:text-negative disabled:opacity-50  cursor-pointer"
              title="Usuń">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
