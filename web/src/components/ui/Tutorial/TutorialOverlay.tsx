import { Button } from "@/components/ui/shadcn/button";
import { useTutorial } from "@/context/TutorialContext";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";

export function TutorialOverlay() {
  const { isActive, currentStep, steps, nextStep, previousStep, skipTutorial } = useTutorial();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const currentStepData = steps[currentStep];

  console.log("TutorialOverlay render - isActive:", isActive, "steps:", steps.length, "currentStep:", currentStep);

  useEffect(() => {
    if (!isActive || !currentStepData) {
      setTargetRect(null);
      return;
    }

    const updateTargetPosition = () => {
      const element = document.querySelector(currentStepData.target);
      console.log("Tutorial - Looking for:", currentStepData.target, "Found:", element);
      if (element) {
        const rect = element.getBoundingClientRect();
        console.log("Tutorial - Element rect:", rect);
        setTargetRect(rect);
      } else {
        console.warn("Tutorial - Element not found:", currentStepData.target);
        setTargetRect(null);
      }
    };

    updateTargetPosition();

    // Update on scroll or resize
    window.addEventListener("resize", updateTargetPosition);
    window.addEventListener("scroll", updateTargetPosition, true);

    return () => {
      window.removeEventListener("resize", updateTargetPosition);
      window.removeEventListener("scroll", updateTargetPosition, true);
    };
  }, [isActive, currentStep, currentStepData]);

  if (!isActive || !currentStepData) {
    console.log("Tutorial - Not showing overlay:", { isActive, hasStepData: !!currentStepData });
    return null;
  }

  const padding = currentStepData.highlightPadding || 8;

  // Calculate tooltip position with smart positioning
  const getTooltipPosition = () => {
    let position = currentStepData.position || "auto";
    const tooltipWidth = 320;
    const tooltipHeight = 200; // Approximate height
    const tooltipOffset = 16;
    const screenPadding = 20; // Padding from screen edges

    // If no target element found, center on screen
    if (!targetRect) {
      return {
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
        tooltipWidth,
        position: "bottom" as const,
      };
    }

    // Auto position: choose best position based on available space
    if (position === "auto") {
      const spaceAbove = targetRect.top;
      const spaceBelow = window.innerHeight - targetRect.bottom;
      const spaceLeft = targetRect.left;
      const spaceRight = window.innerWidth - targetRect.right;

      // Find position with most space
      const spaces = {
        top: spaceAbove,
        bottom: spaceBelow,
        left: spaceLeft,
        right: spaceRight,
      };

      position = Object.entries(spaces).reduce((a, b) =>
        spaces[a[0] as keyof typeof spaces] > spaces[b[0] as keyof typeof spaces] ? a : b,
      )[0] as "top" | "bottom" | "left" | "right";

      console.log("Tutorial - Auto position selected:", position, "spaces:", spaces);
    }

    let top = 0;
    let left = 0;

    // Calculate initial position based on preference
    const calculatePosition = (pos: "top" | "bottom" | "left" | "right") => {
      switch (pos) {
        case "top":
          return {
            top: targetRect.top - tooltipOffset,
            left: targetRect.left + targetRect.width / 2,
            transform: "translate(-50%, -100%)",
          };
        case "bottom":
          return {
            top: targetRect.bottom + tooltipOffset,
            left: targetRect.left + targetRect.width / 2,
            transform: "translate(-50%, 0)",
          };
        case "left":
          return {
            top: targetRect.top + targetRect.height / 2,
            left: targetRect.left - tooltipOffset,
            transform: "translate(-100%, -50%)",
          };
        case "right":
          return {
            top: targetRect.top + targetRect.height / 2,
            left: targetRect.right + tooltipOffset,
            transform: "translate(0, -50%)",
          };
        default:
          // Fallback to bottom
          return {
            top: targetRect.bottom + tooltipOffset,
            left: targetRect.left + targetRect.width / 2,
            transform: "translate(-50%, 0)",
          };
      }
    };

    const initialPos = calculatePosition(position as "top" | "bottom" | "left" | "right");
    top = initialPos.top;
    left = initialPos.left;

    // Check if tooltip fits on screen and adjust position if needed
    const checkAndAdjustPosition = () => {
      // For top/bottom positions, check vertical space
      if (position === "top") {
        // Not enough space above? Try bottom
        if (top - tooltipHeight < screenPadding) {
          position = "bottom";
          const newPos = calculatePosition("bottom");
          top = newPos.top;
          left = newPos.left;
          console.log("Tutorial - Adjusted from top to bottom (not enough space above)");
        }
      } else if (position === "bottom") {
        // Not enough space below? Try top
        if (top + tooltipHeight > window.innerHeight - screenPadding) {
          position = "top";
          const newPos = calculatePosition("top");
          top = newPos.top;
          left = newPos.left;
          console.log("Tutorial - Adjusted from bottom to top (not enough space below)");
        }
      }

      // For left/right positions, check horizontal space
      if (position === "left") {
        // Not enough space on left? Try right
        if (left - tooltipWidth < screenPadding) {
          position = "right";
          const newPos = calculatePosition("right");
          top = newPos.top;
          left = newPos.left;
          console.log("Tutorial - Adjusted from left to right (not enough space on left)");
        }
      } else if (position === "right") {
        // Not enough space on right? Try left
        if (left + tooltipWidth > window.innerWidth - screenPadding) {
          position = "left";
          const newPos = calculatePosition("left");
          top = newPos.top;
          left = newPos.left;
          console.log("Tutorial - Adjusted from right to left (not enough space on right)");
        }
      }

      // Final check: ensure horizontal centering doesn't go off-screen
      if (position === "top" || position === "bottom") {
        const halfWidth = tooltipWidth / 2;
        if (left - halfWidth < screenPadding) {
          left = screenPadding + halfWidth;
          console.log("Tutorial - Adjusted horizontal position (too far left)");
        } else if (left + halfWidth > window.innerWidth - screenPadding) {
          left = window.innerWidth - screenPadding - halfWidth;
          console.log("Tutorial - Adjusted horizontal position (too far right)");
        }
      }

      // Final check: ensure vertical centering doesn't go off-screen
      if (position === "left" || position === "right") {
        const halfHeight = tooltipHeight / 2;
        if (top - halfHeight < screenPadding) {
          top = screenPadding + halfHeight;
          console.log("Tutorial - Adjusted vertical position (too high)");
        } else if (top + halfHeight > window.innerHeight - screenPadding) {
          top = window.innerHeight - screenPadding - halfHeight;
          console.log("Tutorial - Adjusted vertical position (too low)");
        }
      }
    };

    checkAndAdjustPosition();

    return { top, left, tooltipWidth, position };
  };

  const { top, left, tooltipWidth, position } = getTooltipPosition();

  const getTooltipTransform = () => {
    switch (position) {
      case "top":
        return "translate(-50%, -100%)";
      case "bottom":
        return "translate(-50%, 0)";
      case "left":
        return "translate(-100%, -50%)";
      case "right":
        return "translate(0, -50%)";
      default:
        return "translate(-50%, 0)";
    }
  };

  // Get animation direction based on tooltip position
  const getAnimationClass = () => {
    if (currentStep === 0) {
      // First step: gentle fade-in without slide
      return "animate-in fade-in duration-500";
    }

    // Subsequent steps: slide from opposite direction of tooltip position
    switch (position) {
      case "top":
        return "animate-in fade-in-0 slide-in-from-bottom-3 duration-300";
      case "bottom":
        return "animate-in fade-in-0 slide-in-from-top-3 duration-300";
      case "left":
        return "animate-in fade-in-0 slide-in-from-right-3 duration-300";
      case "right":
        return "animate-in fade-in-0 slide-in-from-left-3 duration-300";
      default:
        return "animate-in fade-in-0 slide-in-from-top-3 duration-300";
    }
  };

  return (
    <>
      {/* Dark Overlay - only show cutout if target element exists */}
      {targetRect ? (
        <>
          {/* Dark Overlay with cutout */}
          <div
            className={`fixed inset-0 z-50 pointer-events-none ${
              currentStep === 0 ? "animate-in fade-in duration-500" : ""
            }`}
            style={{
              background: "rgba(0, 0, 0, 0.7)",
              clipPath: `polygon(
                0 0,
                0 100%,
                100% 100%,
                100% 0,
                0 0,
                ${targetRect.left - padding}px ${targetRect.top - padding}px,
                ${targetRect.left - padding}px ${targetRect.bottom + padding}px,
                ${targetRect.right + padding}px ${targetRect.bottom + padding}px,
                ${targetRect.right + padding}px ${targetRect.top - padding}px,
                ${targetRect.left - padding}px ${targetRect.top - padding}px
              )`,
            }}
          />

          {/* Highlight Border */}
          <div
            className={`fixed z-50 pointer-events-none border-2 border-primary rounded-2xl animate-pulse ${
              currentStep === 0 ? "animate-in fade-in duration-500" : ""
            }`}
            style={{
              top: targetRect.top - padding,
              left: targetRect.left - padding,
              width: targetRect.width + padding * 2,
              height: targetRect.height + padding * 2,
            }}
          />
        </>
      ) : (
        // Fallback - simple dark overlay without cutout
        <div
          className={`fixed inset-0 z-50 bg-black/70 pointer-events-none ${
            currentStep === 0 ? "animate-in fade-in duration-500" : ""
          }`}
        />
      )}

      {/* Tooltip */}
      <div
        key={currentStep} // Force re-render on step change for animation
        className={`fixed z-50 bg-bg-alt border border-border rounded-2xl shadow-2xl p-4 ${getAnimationClass()}`}
        style={{
          top: `${top}px`,
          left: `${left}px`,
          width: `${tooltipWidth}px`,
          transform: getTooltipTransform(),
        }}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-text">{currentStepData.title}</h3>
          <button onClick={skipTutorial} className="text-text-muted hover:text-text transition-colors p-1 -mr-1 -mt-1">
            <X size={20} />
          </button>
        </div>

        <p className="text-text-muted text-sm mb-4">{currentStepData.content}</p>

        <div className="flex items-center justify-between">
          <div className="text-xs text-text-muted">
            Step {currentStep + 1} of {steps.length}
          </div>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="default" size="sm" onClick={previousStep}>
                <ChevronLeft size={16} />
                Previous
              </Button>
            )}
            <Button variant="default" size="sm" onClick={nextStep}>
              {currentStep === steps.length - 1 ? "Finish" : "Next"}
              {currentStep !== steps.length - 1 && <ChevronRight size={16} />}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
