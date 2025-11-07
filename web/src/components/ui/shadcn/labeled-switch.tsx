import { cn } from "@/lib/shadcn/utils";
import * as React from "react";
import { Label } from "./label";
import { Switch } from "./switch";

interface LabeledSwitchProps extends React.ComponentProps<typeof Switch> {
  label?: string;
  labelClassName?: string;
  containerClassName?: string;
}

function LabeledSwitch({ label, labelClassName, containerClassName, id, ...props }: LabeledSwitchProps) {
  // If no label, return just the switch
  if (!label) {
    return <Switch id={id} {...props} />;
  }

  // With label, return switch + label in a container
  return (
    <div className={cn("flex items-center gap-3", containerClassName)}>
      <Switch id={id} {...props} />
      <Label htmlFor={id} className={cn("font-normal text-sm", labelClassName)}>
        {label}
      </Label>
    </div>
  );
}

export { LabeledSwitch };
