import { useEffect, useState } from "react";
import type { UseElementPositionProps } from "@/data/Utils/interfaces";

export type { ElementPosition } from "@/data/Utils/interfaces";

export function useElementPosition({
  isOpen,
  elementPosition,
  modalWidth = 320,
  modalHeight = 200,
  offset = 8,
}: UseElementPositionProps) {
  // Inicjalizacja z obliczoną pozycją aby uniknąć przeskakiwania
  const [position, setPosition] = useState<React.CSSProperties>(() => {
    if (!isOpen) {
      return {};
    }

    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1024;
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 768;

    let x = elementPosition.x;
    let y = elementPosition.y;

    // Sprawdź czy modal zmieści się po prawej stronie kursora
    if (x + modalWidth + offset > viewportWidth) {
      x = elementPosition.x - modalWidth / 2 ;
    } else {
      x = elementPosition.x + elementPosition.width + offset;
    }

    // Sprawdź czy modal zmieści się poniżej kursora
    if (y + modalHeight + offset > viewportHeight) {
      y = elementPosition.y - modalHeight - offset;
    } else {
      y = elementPosition.y + offset;
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

    let x = elementPosition.x;
    let y = elementPosition.y;

    // Sprawdź czy modal zmieści się po prawej stronie kursora
    if (x + modalWidth + offset > viewportWidth) {
      // Przenieś na lewą stronę
      x = elementPosition.x - elementPosition.width
    } else {
      // Zostaw po prawej stronie
      x = elementPosition.x + elementPosition.width + offset;
    }

    // Sprawdź czy modal zmieści się poniżej kursora
    if (y + modalHeight + offset > viewportHeight) {
      // Przenieś powyżej kursora
      y = elementPosition.y - modalHeight - offset;
    } else {
      // Zostaw poniżej kursora
      y = elementPosition.y + offset;
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
  }, [isOpen, elementPosition, modalWidth, modalHeight, offset]);

  return {
    positionStyles: position,
  };
}
