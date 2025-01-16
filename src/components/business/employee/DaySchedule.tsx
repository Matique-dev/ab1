import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { ScheduleTimeSelect } from "./ScheduleTimeSelect";
import { DaySchedule as DayScheduleType } from "@/types/schedule";

interface DayScheduleProps {
  day: { value: string; label: string };
  schedule: DayScheduleType;
  onToggleDay: () => void;
  onTimeChange: (type: 'workStart' | 'workEnd' | 'lunchStart' | 'lunchEnd', value: string) => void;
  isBusinessOpen: boolean;
}

export const DaySchedule = ({
  day,
  schedule,
  onToggleDay,
  onTimeChange,
  isBusinessOpen
}: DayScheduleProps) => {
  return (
    <AccordionItem value={day.value}>
      <AccordionTrigger className="flex justify-between py-2 px-4 hover:bg-accent/50">
        <div className="flex items-center gap-4">
          <Switch
            checked={schedule.isAvailable}
            onCheckedChange={onToggleDay}
            onClick={(e) => e.stopPropagation()}
            disabled={!isBusinessOpen}
          />
          <span className={schedule.isAvailable ? "font-medium" : "text-muted-foreground"}>
            {day.label}
          </span>
        </div>
        {schedule.isAvailable && (
          <span className="text-sm text-muted-foreground w-32 text-right">
            {schedule.workStart} - {schedule.workEnd}
          </span>
        )}
      </AccordionTrigger>
      <AccordionContent className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-4">
            <ScheduleTimeSelect
              label="Work Start"
              value={schedule.workStart}
              onChange={(value) => onTimeChange('workStart', value)}
              disabled={!schedule.isAvailable}
            />
            <ScheduleTimeSelect
              label="Work End"
              value={schedule.workEnd}
              onChange={(value) => onTimeChange('workEnd', value)}
              disabled={!schedule.isAvailable}
            />
          </div>
          <div className="space-y-4">
            <ScheduleTimeSelect
              label="Lunch Start"
              value={schedule.lunchStart}
              onChange={(value) => onTimeChange('lunchStart', value)}
              disabled={!schedule.isAvailable}
            />
            <ScheduleTimeSelect
              label="Lunch End"
              value={schedule.lunchEnd}
              onChange={(value) => onTimeChange('lunchEnd', value)}
              disabled={!schedule.isAvailable}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};