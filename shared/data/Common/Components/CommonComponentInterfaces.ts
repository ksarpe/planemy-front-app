// Common feature component interfaces

export interface EditableTextProps {
  value: string; //taskTitle from taskDetails
  onSave: (newValue: string) => void; //taskTitle change handler
  className?: string;
  placeholder?: string;
}