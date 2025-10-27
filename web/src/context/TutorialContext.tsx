import { createContext, type ReactNode, useContext, useState } from "react";

export interface TutorialStep {
  target: string; // CSS selector or element ID
  title: string;
  content: string;
  position?: "top" | "bottom" | "left" | "right" | "auto"; // "auto" will choose best position
  highlightPadding?: number;
}

interface TutorialContextType {
  isActive: boolean;
  currentStep: number;
  startTutorial: () => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTutorial: () => void;
  steps: TutorialStep[];
  setSteps: (steps: TutorialStep[]) => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<TutorialStep[]>([]);

  const startTutorial = () => {
    console.log("Tutorial - startTutorial called, steps:", steps);
    if (steps.length > 0) {
      console.log("Tutorial - Starting with", steps.length, "steps");
      setIsActive(true);
      setCurrentStep(0);
    } else {
      console.warn("Tutorial - No steps available");
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      skipTutorial();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const skipTutorial = () => {
    setIsActive(false);
    setCurrentStep(0);
  };

  return (
    <TutorialContext.Provider
      value={{
        isActive,
        currentStep,
        startTutorial,
        nextStep,
        previousStep,
        skipTutorial,
        steps,
        setSteps,
      }}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error("useTutorial must be used within a TutorialProvider");
  }
  return context;
}
