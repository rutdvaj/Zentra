"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type ComboboxOption = {
  value: string;
  label: string;
};

type ComboboxPopoverProps = {
  options: ComboboxOption[];
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  onSelect?: (selected: ComboboxOption) => void;
  className?: string;
};

export function ComboboxPopover({
  options,
  label = "Select",
  placeholder = "+ Choose option",
  defaultValue,
  onSelect,
  className,
}: ComboboxPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<ComboboxOption | null>(
    options.find((opt) => opt.value === defaultValue) || null
  );

  const handleSelect = (value: string) => {
    const selectedOption = options.find((opt) => opt.value === value) || null;
    setSelected(selectedOption);
    setOpen(false);
    if (selectedOption && onSelect) {
      onSelect(selectedOption);
    }
  };

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <p className="text-muted-foreground text-sm">{label}</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {selected ? selected.label : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.value}
                    onSelect={handleSelect}
                  >
                    {opt.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
