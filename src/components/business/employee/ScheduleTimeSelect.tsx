import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ScheduleTimeSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  const minutes = ["00", "30"];
  return minutes.map(minute => ({
    value: `${hour}:${minute}`,
    label: `${hour}:${minute}`,
  }));
}).flat();

export const ScheduleTimeSelect = ({
  label,
  value,
  onChange,
  disabled = false
}: ScheduleTimeSelectProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select time" />
        </SelectTrigger>
        <SelectContent>
          {HOURS.map((hour) => (
            <SelectItem key={hour.value} value={hour.value}>
              {hour.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};