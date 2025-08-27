import { useEffect, useState, useRef, RefObject } from "react";

interface ModalPosition {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  maxWidth?: number;
  maxHeight?: number;
}

interface UseSmartPositionProps {
  isOpen: boolean;
  triggerRef: RefObject<HTMLElement> | null;
  modalWidth?: number;
  modalHeight?: number;
  offset?: number;
}

export function useSmartPosition({
  isOpen,
  triggerRef,
  modalWidth = 384,
  modalHeight = 400,
  offset = 8,
}: UseSmartPositionProps) {
  const [position, setPosition] = useState<ModalPosition>(() => {
    if (!isOpen || !triggerRef || !triggerRef.current) {
      return {
        top: typeof window !== "undefined" ? window.innerHeight / 2 - modalHeight / 2 : 200,
        left: typeof window !== "undefined" ? window.innerWidth / 2 - modalWidth / 2 : 200,
        maxWidth: modalWidth,
        maxHeight: modalHeight,
      };
    }

    const triggerElement = triggerRef.current;
    const triggerRect = triggerElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - triggerRect.bottom;
    const preferBelow = spaceBelow >= modalHeight + offset;

    return {
      top: preferBelow ? triggerRect.bottom + offset : Math.max(offset, triggerRect.top - modalHeight - offset),
      left: Math.max(offset, Math.min(triggerRect.left, viewportWidth - modalWidth - offset)),
      maxWidth: Math.min(modalWidth, viewportWidth - 2 * offset),
      maxHeight: Math.min(modalHeight, viewportHeight - 2 * offset),
    };
  });

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !triggerRef || !triggerRef.current) {
      return;
    }

    const updatePosition = () => {
      if (!triggerRef || !triggerRef.current) return;
      const triggerElement = triggerRef.current;

      const triggerRect = triggerElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;

      const newPosition: ModalPosition = {};

      const preferBelow = spaceBelow >= modalHeight + offset;
      const canFitAbove = spaceAbove >= modalHeight + offset;

      if (preferBelow) {
        newPosition.top = triggerRect.bottom + offset;
      } else if (canFitAbove) {
        newPosition.top = triggerRect.top - modalHeight - offset;
      } else {
        const centerY = triggerRect.top + triggerRect.height / 2;
        newPosition.top = Math.max(offset, Math.min(centerY - modalHeight / 2, viewportHeight - modalHeight - offset));
      }

      newPosition.left = Math.max(offset, Math.min(triggerRect.left, viewportWidth - modalWidth - offset));
      newPosition.maxWidth = Math.min(modalWidth, viewportWidth - 2 * offset);
      newPosition.maxHeight = Math.min(modalHeight, viewportHeight - 2 * offset);

      setPosition(newPosition);
    };

    updatePosition();

    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updatePosition, 100);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, modalWidth, modalHeight, offset, triggerRef]);

  const getPositionStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      position: "fixed",
      zIndex: 50,
    };

    if (position.top !== undefined) {
      styles.top = position.top;
    }
    if (position.left !== undefined) {
      styles.left = position.left;
    }
    if (position.maxWidth !== undefined) {
      styles.maxWidth = position.maxWidth;
      styles.minWidth = Math.min(320, position.maxWidth);
    }
    if (position.maxHeight !== undefined) {
      styles.maxHeight = position.maxHeight;
    }

    return styles;
  };

  return {
    modalRef,
    positionStyles: getPositionStyles(),
    isPositioned: Object.keys(position).length > 0,
  };
}
