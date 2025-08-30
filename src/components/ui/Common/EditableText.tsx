import { useState, useRef, useEffect } from "react";
import { Check, X, Edit3 } from "lucide-react";
import type { EditableTextProps } from "@/data/Utils/Components/UtilComponentInterfaces";

export const EditableText = ({
  value,
  onSave,
  type = "text",
  suffix,
  className = "",
  placeholder,
  disabled = false,
  displayValue,
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEdit = () => {
    if (disabled) return;
    setIsEditing(true);
    setEditValue(value);
  };

  const handleSave = async () => {
    if (editValue.trim() === "" || editValue === value) {
      setIsEditing(false);
      setEditValue(value);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(editValue);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving:", error);
      setEditValue(value); // Reset to original value on error
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1 min-w-0">
        <input
          ref={inputRef}
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="flex-1 min-w-0 px-1 py-0.5 text-sm border rounded bg-white"
          placeholder={placeholder}
          disabled={isSaving}
          step={type === "number" ? "0.01" : undefined}
        />
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="p-0.5 text-green-600 hover:text-green-700 disabled:opacity-50"
            title="Zapisz">
            <Check size={12} />
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="p-0.5 text-red-600 hover:text-red-700 disabled:opacity-50"
            title="Anuluj">
            <X size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleEdit}
      className={`group cursor-pointer rounded px-1 py-0.5 transition-colors ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      } ${className}`}
      title={disabled ? "" : "Kliknij aby edytować"}>
      <div className="flex items-center gap-1 justify-between min-w-0">
        <span className="font-semibold text-gray-800 text-sm truncate">
          {displayValue || value}
          {suffix && <span className="text-gray-500 ml-1">{suffix}</span>}
        </span>
        {!disabled && (
          <Edit3
            size={10}
            className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          />
        )}
      </div>
    </div>
  );
};