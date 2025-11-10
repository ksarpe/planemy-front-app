import { ChevronDownIcon, PlusIcon } from "lucide-react";
import { useId, useState } from "react";

import { Button } from "@/components/ui/Utils/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/Utils/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Utils/popover";

interface MultiselectProps {
  options: { label: string; value: string; color?: string }[];
  placeholder: string;
  openedPlaceholder: string;
  addButtonText: string;
  onSelect: (value: string) => void;
}

export default function Multiselect({
  options,
  placeholder,
  openedPlaceholder,
  addButtonText,
  onSelect,
}: MultiselectProps) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="*:not-first:mt-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="default"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between border-bg-muted-light px-3 font-medium hover:border-text">
            <span className="truncate text-text-muted">{placeholder}</span>
            <ChevronDownIcon size={16} className="shrink-0 text-text-muted" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full min-w-[var(--radix-popper-anchor-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder={openedPlaceholder} />
            <CommandList>
              <CommandEmpty>No search results.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onSelect(currentValue);
                      setOpen(false);
                    }}>
                    {option.label}
                    {/* {value === option.value && <CheckIcon size={16} className="ml-auto" />}  */}
                    {/*TODO: Add excluded items here to prevent from choosing the same item  */}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <Button variant="ghost" className="w-full justify-start font-normal">
                  <PlusIcon size={16} className="-ms-2 opacity-60" aria-hidden="true" />
                  {addButtonText}
                </Button>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
