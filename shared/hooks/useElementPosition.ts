import { useEffect, useState, useCallback } from "react";
import type { UseElementPositionProps } from "@/data/Utils/interfaces";

export type { ElementPosition } from "@/data/Utils/interfaces";

export function useElementPosition({
  isOpen,
  elementPosition,
  modalWidth = 320,
  modalHeight = 400,
  offset = 4,
}: UseElementPositionProps) {
  const calculatePosition = useCallback((): React.CSSProperties => {
    if (!isOpen) {
      return {};
    }

    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1024;
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 768;

    let x = elementPosition.x;
    let y = elementPosition.y;

    // If not fit on the left side
    if (x + elementPosition.width + modalWidth + offset > viewportWidth) {
      x = elementPosition.x - modalWidth - offset;
      // keep right side
    } else {
      x = elementPosition.x + elementPosition.width + offset;
    }

    //below check
    if (y + modalHeight + elementPosition.height + offset > viewportHeight) {
      y = elementPosition.y - modalHeight + elementPosition.height;
    // keep below
    } else {
      y = elementPosition.y;
    }

    // Upewnij się że modal nie wyjdzie poza krawędzie viewport
    x = Math.max(offset, x);
    y = Math.max(offset, y);

    return {
      position: "fixed",
      left: x,
      top: y,
      zIndex: 50,
      maxWidth: Math.min(modalWidth, viewportWidth - 2 * offset),
      maxHeight: Math.min(modalHeight, viewportHeight - 2 * offset),
    };
  }, [isOpen, elementPosition, modalWidth, modalHeight, offset]);

  // Inicjalizacja z obliczoną pozycją aby uniknąć przeskakiwania
  const [position, setPosition] = useState<React.CSSProperties>(calculatePosition);

  useEffect(() => {
    setPosition(calculatePosition());
  }, [calculatePosition]);

  return {
    positionStyles: position,
  };
}
