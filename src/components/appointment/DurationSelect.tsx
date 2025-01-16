import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface DurationSelectProps {
  duration: string;
  customDuration: boolean;
  onDurationChange: (duration: string) => void;
  onCustomDurationChange: (isCustom: boolean) => void;
}

export const DurationSelect = ({
  duration,
  customDuration,
  onDurationChange,
  onCustomDurationChange,
}: DurationSelectProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="duration">Duration (minutes)</Label>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="customDuration"
            checked={customDuration}
            onChange={(e) => onCustomDurationChange(e.target.checked)}
            className="rounded border-gray-300"
          />
          <Label htmlFor="customDuration" className="text-sm">Custom duration</Label>
        </div>
      </div>
      
      {customDuration ? (
        <Select
          value={duration}
          onValueChange={onDurationChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="60">60 minutes</SelectItem>
            <SelectItem value="90">90 minutes</SelectItem>
            <SelectItem value="120">120 minutes</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <Input
          type="text"
          value={duration}
          disabled
          className="bg-gray-50"
        />
      )}
    </div>
  );
};