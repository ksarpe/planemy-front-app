import { useEffect, useState } from "react";

interface MousePosition {
  x: number;
  y: number;
}

interface UseMousePositionProps {
  isOpen: boolean;
  mousePosition: MousePosition;
  modalWidth?: number;
  modalHeight?: number;
  offset?: number;
}

export function useMousePosition({
  isOpen,
  mousePosition,
  modalWidth = 320,
  modalHeight = 200,
  offset = 8,
}: UseMousePositionProps) {
  // Inicjalizacja z obliczoną pozycją aby uniknąć przeskakiwania
  const [position, setPosition] = useState<React.CSSProperties>(() => {
    if (!isOpen) {
      return {};
    }

    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1024;
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 768;

    let x = mousePosition.x;
    let y = mousePosition.y;

    // Sprawdź czy modal zmieści się po prawej stronie kursora
    if (x + modalWidth + offset > viewportWidth) {
      x = mousePosition.x - modalWidth - offset;
    } else {
      x = mousePosition.x + offset;
    }

    // Sprawdź czy modal zmieści się poniżej kursora
    if (y + modalHeight + offset > viewportHeight) {
      y = mousePosition.y - modalHeight - offset;
    } else {
      y = mousePosition.y + offset;
    }

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
  });

  useEffect(() => {
    if (!isOpen) {
      setPosition({});
      return;
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = mousePosition.x;
    let y = mousePosition.y;

    // Sprawdź czy modal zmieści się po prawej stronie kursora
    if (x + modalWidth + offset > viewportWidth) {
      // Przenieś na lewą stronę
      x = mousePosition.x - modalWidth - offset;
    } else {
      // Zostaw po prawej stronie
      x = mousePosition.x + offset;
    }

    // Sprawdź czy modal zmieści się poniżej kursora
    if (y + modalHeight + offset > viewportHeight) {
      // Przenieś powyżej kursora
      y = mousePosition.y - modalHeight - offset;
    } else {
      // Zostaw poniżej kursora
      y = mousePosition.y + offset;
    }

    // Upewnij się że modal nie wyjdzie poza lewą krawędź
    x = Math.max(offset, x);
    // Upewnij się że modal nie wyjdzie poza górną krawędź
    y = Math.max(offset, y);

    setPosition({
      position: "fixed",
      left: x,
      top: y,
      zIndex: 50,
      maxWidth: Math.min(modalWidth, viewportWidth - 2 * offset),
      maxHeight: Math.min(modalHeight, viewportHeight - 2 * offset),
    });
  }, [isOpen, mousePosition, modalWidth, modalHeight, offset]);

  return {
    positionStyles: position,
  };
}
