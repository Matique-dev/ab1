import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";

type DaySchedule = {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
};

type WeekSchedule = {
  [key: string]: DaySchedule;
};

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

const DEFAULT_SCHEDULE: WeekSchedule = {
  monday: { isOpen: false, openTime: "09:00", closeTime: "20:00" },
  tuesday: { isOpen: true, openTime: "09:00", closeTime: "20:00" },
  wednesday: { isOpen: true, openTime: "09:00", closeTime: "20:00" },
  thursday: { isOpen: true, openTime: "09:00", closeTime: "20:00" },
  friday: { isOpen: true, openTime: "09:00", closeTime: "20:00" },
  saturday: { isOpen: true, openTime: "09:00", closeTime: "20:00" },
  sunday: { isOpen: true, openTime: "09:00", closeTime: "20:00" },
};

export const BusinessHours = () => {
  const { toast } = useToast();
  const [schedule, setSchedule] = React.useState<WeekSchedule>(DEFAULT_SCHEDULE);

  const handleTimeChange = (day: string, type: 'openTime' | 'closeTime', value: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value
      }
    }));
  };

  const handleToggleDay = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isOpen: !prev[day].isOpen
      }
    }));
  };

  const handleSave = () => {
    // Here you would typically save to your backend
    toast({
      title: "Business hours updated",
      description: "Your business hours have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Accordion type="single" collapsible className="w-full">
        {DAYS.map((day) => (
          <AccordionItem value={day.value} key={day.value}>
            <AccordionTrigger className="flex justify-between py-4 px-4 hover:bg-accent/50 rounded-lg">
              <div className="flex items-center gap-4">
                <Switch
                  checked={schedule[day.value].isOpen}
                  onCheckedChange={() => handleToggleDay(day.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className={schedule[day.value].isOpen ? "font-medium" : "text-muted-foreground"}>
                  {day.label}
                </span>
              </div>
              {schedule[day.value].isOpen && (
                <span className="text-sm text-muted-foreground">
                  {schedule[day.value].openTime} - {schedule[day.value].closeTime}
                </span>
              )}
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Opening Time</label>
                  <Select
                    value={schedule[day.value].openTime}
                    onValueChange={(value) => handleTimeChange(day.value, 'openTime', value)}
                    disabled={!schedule[day.value].isOpen}
                  >
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
                  <Select
                    value={schedule[day.value].closeTime}
                    onValueChange={(value) => handleTimeChange(day.value, 'closeTime', value)}
                    disabled={!schedule[day.value].isOpen}
                  >
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
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <button
        onClick={handleSave}
        className="w-full mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Save Changes
      </button>
    </div>
  );
};