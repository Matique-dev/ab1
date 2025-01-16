import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { WeekSchedule } from "@/types/schedule";

const DAYS = [
  { value: "monday", label: "Mon" },
  { value: "tuesday", label: "Tue" },
  { value: "wednesday", label: "Wed" },
  { value: "thursday", label: "Thu" },
  { value: "friday", label: "Fri" },
  { value: "saturday", label: "Sat" },
  { value: "sunday", label: "Sun" },
];

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return { value: `${hour}:00`, label: `${hour}:00` };
});

interface BusinessHoursProps {
  initialSchedule: WeekSchedule;
  onScheduleChange: (schedule: WeekSchedule) => void;
}

export const BusinessHours: React.FC<BusinessHoursProps> = ({ 
  initialSchedule,
  onScheduleChange 
}) => {
  const { toast } = useToast();
  const [schedule, setSchedule] = React.useState<WeekSchedule>(initialSchedule);

  const handleTimeChange = (day: string, type: 'openTime' | 'closeTime', value: string) => {
    const newSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        [type]: value
      }
    };
    setSchedule(newSchedule);
    onScheduleChange(newSchedule);
  };

  const handleToggleDay = (day: string) => {
    const newSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        isOpen: !schedule[day].isOpen
      }
    };
    setSchedule(newSchedule);
    onScheduleChange(newSchedule);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <Accordion type="single" collapsible className="w-full">
        {DAYS.map((day) => (
          <AccordionItem value={day.value} key={day.value} className="border-b-0 [&:not(:last-child)]:mb-1">
            <AccordionTrigger className="flex justify-between py-3 px-4 hover:bg-accent/50 rounded-lg">
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
                <span className="text-sm text-muted-foreground w-32 text-right">
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
    </div>
  );
};
