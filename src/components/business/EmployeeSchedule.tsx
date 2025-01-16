import React, { useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { Employee, WeekSchedule } from "@/types/schedule";
import { EmployeeHeader } from "./employee/EmployeeHeader";
import { DaySchedule } from "./employee/DaySchedule";

const DAYS = [
  { value: "monday", label: "Mon" },
  { value: "tuesday", label: "Tue" },
  { value: "wednesday", label: "Wed" },
  { value: "thursday", label: "Thu" },
  { value: "friday", label: "Fri" },
  { value: "saturday", label: "Sat" },
  { value: "sunday", label: "Sun" },
];

interface Props {
  employee: Employee;
  onRemove: () => void;
  onUpdateSchedule: (schedule: Employee['schedule']) => void;
  onUpdateEmployee: (updates: Partial<Employee>) => void;
  businessHours: WeekSchedule;
}

export const EmployeeSchedule: React.FC<Props> = ({ 
  employee, 
  onRemove, 
  onUpdateSchedule, 
  onUpdateEmployee,
  businessHours 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
    const dayBusinessHours = businessHours[day];
    if (!dayBusinessHours.isOpen) {
      return;
    }

    let newValue = value;
    if (type === 'workStart' && value < dayBusinessHours.openTime) {
      newValue = dayBusinessHours.openTime;
    }
    if (type === 'workEnd' && value > dayBusinessHours.closeTime) {
      newValue = dayBusinessHours.closeTime;
    }

    onUpdateSchedule({
      ...employee.schedule,
      [day]: {
        ...employee.schedule[day],
        [type]: newValue,
      },
    });
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <EmployeeHeader
        id={employee.id}
        name={employee.name}
        color={employee.color}
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
        onRemove={onRemove}
        onUpdateEmployee={onUpdateEmployee}
      />

      {isExpanded && (
        <Accordion type="single" collapsible className="w-full">
          {DAYS.map((day) => (
            <DaySchedule
              key={day.value}
              day={day}
              schedule={employee.schedule[day.value]}
              onToggleDay={() => handleToggleDay(day.value)}
              onTimeChange={(type, value) => handleTimeChange(day.value, type, value)}
              isBusinessOpen={businessHours[day.value].isOpen}
            />
          ))}
        </Accordion>
      )}
    </div>
  );
};