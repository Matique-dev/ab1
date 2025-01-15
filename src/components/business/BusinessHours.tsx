import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

const DAYS = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return { value: `${hour}:00`, label: `${hour}:00` };
});

export const BusinessHours = () => {
  const { toast } = useToast();
  const [openTime, setOpenTime] = React.useState("09:00");
  const [closeTime, setCloseTime] = React.useState("20:00");
  const [workingDays, setWorkingDays] = React.useState<string[]>(["tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]);

  const handleDayToggle = (day: string) => {
    setWorkingDays((current) =>
      current.includes(day)
        ? current.filter((d) => d !== day)
        : [...current, day]
    );
  };

  const handleSave = () => {
    // Here you would typically save to your backend
    toast({
      title: "Business hours updated",
      description: "Your business hours have been saved successfully.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Opening Time</label>
          <Select value={openTime} onValueChange={setOpenTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select opening time" />
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

        <div>
          <label className="block text-sm font-medium mb-2">Closing Time</label>
          <Select value={closeTime} onValueChange={setCloseTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select closing time" />
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
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium mb-4">Working Days</label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAYS.map((day) => (
            <div key={day.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={day.value}
                checked={workingDays.includes(day.value)}
                onChange={() => handleDayToggle(day.value)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor={day.value} className="text-sm">
                {day.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Save Changes
      </button>
    </div>
  );
};