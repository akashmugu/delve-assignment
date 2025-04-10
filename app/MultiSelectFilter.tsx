"use client";

import { useUrlFilter } from "./hooks";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type MultiSelectFilterProps = {
  paramKey: string;
  allValues: string[];
  labelForValue?: (value: string) => string;
};

export default function MultiSelectFilter({
  paramKey,
  allValues,
  labelForValue = (v) => v,
}: MultiSelectFilterProps) {
  const { selected, setSelected } = useUrlFilter({
    paramKey,
    allValues,
  });

  const toggle = (value: string) => {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];

    setSelected(next);
  };

  return (
    <>
      {allValues.map((value) => (
        <Label key={value} className="flex items-center space-x-1">
          <Checkbox
            checked={selected.includes(value)}
            onClick={() => toggle(value)}
          />
          <span>{labelForValue(value)}</span>
        </Label>
      ))}
    </>
  );
}
