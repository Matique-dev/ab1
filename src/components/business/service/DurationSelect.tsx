import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DurationSelectProps {
  value: number;
  onChange: (value: number) => void;
}

export const DurationSelect = ({ value, onChange }: DurationSelectProps) => {
  const durations = Array.from({ length: 24 }, (_, i) => (i + 1) * 5);

  return (
    <Select
      value={value.toString()}
      onValueChange={(value) => onChange(parseInt(value))}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Duration" />
      </SelectTrigger>
      <SelectContent>
        {durations.map((duration) => (
          <SelectItem key={duration} value={duration.toString()}>
            {duration} min
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};