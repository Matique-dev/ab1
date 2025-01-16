import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ScheduleDay {
  isAvailable: boolean;
  workStart: string;
  workEnd: string;
  lunchStart: string;
  lunchEnd: string;
}

interface Employee {
  id: string;
  name: string;
  color: string;
  schedule: {
    [key: string]: ScheduleDay;
  };
}

interface Props {
  employee: Employee;
  onRemove: () => void;
  onUpdateSchedule: (schedule: Employee['schedule']) => void;
}

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
  const minutes = ["00", "30"];
  return minutes.map(minute => ({
    value: `${hour}:${minute}`,
    label: `${hour}:${minute}`,
  }));
}).flat();

export const EmployeeSchedule: React.FC<Props> = ({ employee, onRemove, onUpdateSchedule }) => {
  const handleToggleDay = (day: string) => {
    onUpdateSchedule({
      ...employee.schedule,
      [day]: {
        ...employee.schedule[day],
        isAvailable: !employee.schedule[day].isAvailable,
      },
    });
  };

  const handleTimeChange = (
    day: string,
    type: 'workStart' | 'workEnd' | 'lunchStart' | 'lunchEnd',
    value: string
  ) => {
    onUpdateSchedule({
      ...employee.schedule,
      [day]: {
        ...employee.schedule[day],
        [type]: value,
      },
    });
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between p-4"
        style={{ borderLeft: `4px solid ${employee.color}` }}
      >
        <div className="flex items-center space-x-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: employee.color }}
          />
          <span className="font-medium">{employee.name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {DAYS.map((day) => (
          <AccordionItem value={day.value} key={day.value}>
            <AccordionTrigger className="flex justify-between py-2 px-4 hover:bg-accent/50">
              <div className="flex items-center gap-4">
                <Switch
                  checked={employee.schedule[day.value].isAvailable}
                  onCheckedChange={() => handleToggleDay(day.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className={employee.schedule[day.value].isAvailable ? "font-medium" : "text-muted-foreground"}>
                  {day.label}
                </span>
              </div>
              {employee.schedule[day.value].isAvailable && (
                <span className="text-sm text-muted-foreground">
                  {employee.schedule[day.value].workStart} - {employee.schedule[day.value].workEnd}
                </span>
              )}
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Work Start</label>
                    <Select
                      value={employee.schedule[day.value].workStart}
                      onValueChange={(value) => handleTimeChange(day.value, 'workStart', value)}
                      disabled={!employee.schedule[day.value].isAvailable}
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
                  <div>
                    <label className="block text-sm font-medium mb-2">Work End</label>
                    <Select
                      value={employee.schedule[day.value].workEnd}
                      onValueChange={(value) => handleTimeChange(day.value, 'workEnd', value)}
                      disabled={!employee.schedule[day.value].isAvailable}
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
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Lunch Start</label>
                    <Select
                      value={employee.schedule[day.value].lunchStart}
                      onValueChange={(value) => handleTimeChange(day.value, 'lunchStart', value)}
                      disabled={!employee.schedule[day.value].isAvailable}
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
                  <div>
                    <label className="block text-sm font-medium mb-2">Lunch End</label>
                    <Select
                      value={employee.schedule[day.value].lunchEnd}
                      onValueChange={(value) => handleTimeChange(day.value, 'lunchEnd', value)}
                      disabled={!employee.schedule[day.value].isAvailable}
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
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};