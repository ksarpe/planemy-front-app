// User feature component interfaces

export interface SaveBarProps {
  visible: boolean;
  onSave: () => void | Promise<void>;
  onDiscard: () => void;
  ping?: number; // increment to trigger attention animation
}