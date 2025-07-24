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
      className="focus:outline-none border-b focus:border-b-amber-600 px-1 focus:border-transparent focus:border-1 p-1"
    />
  ) : (
    <span
      onClick={() => setIsEditing(true)}
      className={`cursor-pointer ${className} px-1 border border-transparent border-b-gray-300 hover:border-gray-400 focus:border-primary text-base`}>
      {tempValue || placeholder || "Click to edit"}
    </span>
  );
}
