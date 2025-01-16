import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";

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
  const minutes = ["00", "30"];
  return minutes.map(minute => ({
    value: `${hour}:${minute}`,
    label: `${hour}:${minute}`,
  }));
}).flat();

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
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(employee.name);
  const [tempColor, setTempColor] = useState(employee.color);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: employee.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
    // Validate against business hours
    const dayBusinessHours = businessHours[day];
    if (!dayBusinessHours.isOpen) {
      return; // Don't allow changes if business is closed
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

  const handleSaveEdit = () => {
    onUpdateEmployee({ 
      name: tempName,
      color: tempColor 
    });
    setIsEditing(false);
  };

  return (
    <div ref={setNodeRef} style={style} className="border rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between p-4"
        style={{ borderLeft: `4px solid ${employee.color}` }}
      >
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="cursor-grab" 
            {...attributes} 
            {...listeners}
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </Button>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="w-32"
              />
              <Input
                type="color"
                value={tempColor}
                onChange={(e) => setTempColor(e.target.value)}
                className="w-12"
              />
              <Button onClick={handleSaveEdit} size="sm">Save</Button>
            </div>
          ) : (
            <>
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: employee.color }}
              />
              <span 
                className="font-medium cursor-pointer hover:underline"
                onClick={() => setIsEditing(true)}
              >
                {employee.name}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-destructive hover:text-destructive"
            disabled={employee.id === "manager"}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <Accordion type="single" collapsible className="w-full">
          {DAYS.map((day) => (
            <AccordionItem value={day.value} key={day.value}>
              <AccordionTrigger className="flex justify-between py-2 px-4 hover:bg-accent/50">
                <div className="flex items-center gap-4">
                  <Switch
                    checked={employee.schedule[day.value].isAvailable}
                    onCheckedChange={() => handleToggleDay(day.value)}
                    onClick={(e) => e.stopPropagation()}
                    disabled={!businessHours[day.value].isOpen}
                  />
                  <span className={employee.schedule[day.value].isAvailable ? "font-medium" : "text-muted-foreground"}>
                    {day.label}
                  </span>
                </div>
                {employee.schedule[day.value].isAvailable && (
                  <span className="text-sm text-muted-foreground w-32 text-right">
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
      )}
    </div>
  );
};
