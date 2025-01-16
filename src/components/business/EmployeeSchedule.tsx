import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Employee, WeekSchedule } from "@/types/schedule";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateTimeOptions } from "@/lib/utils";

interface EmployeeScheduleProps {
  employee: Employee;
  onRemove: () => void;
  onUpdateSchedule: (schedule: Employee['schedule']) => void;
  onUpdateEmployee: (updates: Partial<Employee>) => void;
  businessHours: WeekSchedule;
  isDefault: boolean;
}

export const EmployeeSchedule: React.FC<EmployeeScheduleProps> = ({
  employee,
  onRemove,
  onUpdateSchedule,
  onUpdateEmployee,
  businessHours,
  isDefault
}) => {
  const timeOptions = generateTimeOptions();
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateEmployee({ name: event.target.value });
  };

  const handleAvailabilityChange = (day: string, isAvailable: boolean) => {
    const updatedSchedule = {
      ...employee.schedule,
      [day]: {
        ...employee.schedule[day],
        isAvailable,
      },
    };
    onUpdateSchedule(updatedSchedule);
  };

  const handleTimeChange = (day: string, field: string, value: string) => {
    const updatedSchedule = {
      ...employee.schedule,
      [day]: {
        ...employee.schedule[day],
        [field]: value,
      },
    };
    onUpdateSchedule(updatedSchedule);
  };

  return (
    <Card className="relative p-4 border-l-4" style={{ borderLeftColor: employee.color }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: employee.color }} />
          <Input
            value={employee.name}
            onChange={handleNameChange}
            className="h-8 w-[200px]"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className={`h-8 w-8 ${isDefault ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-100'}`}
          disabled={isDefault}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-4 space-y-4">
        {daysOfWeek.map((day) => (
          <div key={day} className="grid grid-cols-6 gap-4 items-center">
            <div className="col-span-1 flex items-center gap-2">
              <Switch
                checked={employee.schedule[day]?.isAvailable ?? false}
                onCheckedChange={(checked) => handleAvailabilityChange(day, checked)}
              />
              <Label className="capitalize">{day}</Label>
            </div>

            {employee.schedule[day]?.isAvailable && (
              <>
                <Select
                  value={employee.schedule[day]?.workStart}
                  onValueChange={(value) => handleTimeChange(day, 'workStart', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={employee.schedule[day]?.workEnd}
                  onValueChange={(value) => handleTimeChange(day, 'workEnd', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="End time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={employee.schedule[day]?.lunchStart}
                  onValueChange={(value) => handleTimeChange(day, 'lunchStart', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Lunch start" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={employee.schedule[day]?.lunchEnd}
                  onValueChange={(value) => handleTimeChange(day, 'lunchEnd', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Lunch end" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};