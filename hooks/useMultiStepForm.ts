import { useState } from "react";

export function useMultiStepForm(steps: string[]) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const previousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return {
    currentStep,
    nextStep,
    previousStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
    steps,
  };
}
