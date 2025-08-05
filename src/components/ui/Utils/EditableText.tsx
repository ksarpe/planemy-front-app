import { useState, useRef, useEffect } from "react";

interface EditableTextProps {
  value: string; //taskTitle from taskDetails
  onSave: (newValue: string) => void; //taskTitle change handler
  className?: string;
  placeholder?: string;
}

export default function EditableText({ value, onSave, className, placeholder }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      onSave(tempValue.trim());
      setTempValue(tempValue.trim());
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setTempValue(value); // przywróć poprzednią wartość
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (tempValue.trim() !== value) {
      onSave(tempValue.trim());
      setTempValue(tempValue.trim());
    }
  };

  return isEditing ? (
    <input
      ref={inputRef}
      value={tempValue}
      onChange={(e) => setTempValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-white border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
    />
  ) : (
    <div
      onClick={() => setIsEditing(true)}
      className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-colors min-h-[42px] flex items-center ${className}`}>
      <span className="text-base">
        {tempValue || <span className="text-gray-400 italic">{placeholder || "Kliknij, aby edytować"}</span>}
      </span>
    </div>
  );
}
