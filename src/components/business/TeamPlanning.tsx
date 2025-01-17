import React from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmployeeSchedule } from "./EmployeeSchedule";
import { Employee, WeekSchedule } from "@/types/schedule";
import { useToast } from "@/hooks/use-toast";
import { Users, Plus } from "lucide-react";
import { useBusinessStore } from "@/hooks/useBusinessStore";

interface TeamPlanningProps {
  initialBusinessHours: WeekSchedule;
  onBusinessHoursChange: (hours: WeekSchedule) => void;
}

// Available colors for new employees
const AVAILABLE_COLORS = [
  '#8B5CF6', // Vivid Purple
  '#D946EF', // Magenta Pink
  '#F97316', // Bright Orange
  '#0EA5E9', // Ocean Blue
  '#9b87f5', // Primary Purple
  '#7E69AB', // Secondary Purple
  '#6E59A5', // Tertiary Purple
];

const createDefaultEmployeeSchedule = (businessHours: WeekSchedule) => {
  const schedule: { [key: string]: any } = {};
  Object.entries(businessHours).forEach(([day, hours]) => {
    schedule[day] = {
      isAvailable: hours.isOpen,
      workStart: hours.openTime,
      workEnd: hours.closeTime,
      lunchStart: "12:00",
      lunchEnd: "13:00"
    };
  });
  return schedule;
};

// Function to find the most different color from existing ones
const findMostDifferentColor = (existingColors: string[], availableColors: string[]): string => {
  if (availableColors.length === 0) return '#AA3FFF'; // Fallback color
  
  // Filter out colors that are already in use
  const unusedColors = availableColors.filter(color => !existingColors.includes(color));
  if (unusedColors.length === 0) return availableColors[0]; // If all colors are used, start over
  
  return unusedColors[Math.floor(Math.random() * unusedColors.length)];
};

export const TeamPlanning: React.FC<TeamPlanningProps> = ({
  initialBusinessHours,
  onBusinessHoursChange
}) => {
  const { toast } = useToast();
  const { employees, updateEmployees } = useBusinessStore();

  const handleAddEmployee = () => {
    const existingColors = employees.map(emp => emp.color);
    const newColor = findMostDifferentColor(existingColors, AVAILABLE_COLORS);
    
    const newEmployee: Employee = {
      id: `employee-${Date.now()}`,
      name: `Stylist ${employees.length + 1}`,
      color: newColor,
      schedule: createDefaultEmployeeSchedule(initialBusinessHours),
    };
    
    const updatedEmployees = [...employees, newEmployee];
    updateEmployees(updatedEmployees);
    
    toast({
      title: "Employee added",
      description: `${newEmployee.name} has been added to the team.`,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = employees.findIndex((emp) => emp.id === active.id);
      const newIndex = employees.findIndex((emp) => emp.id === over.id);
      
      const reorderedEmployees = arrayMove(employees, oldIndex, newIndex);
      updateEmployees(reorderedEmployees);
      
      toast({
        title: "Team order updated",
        description: "The team order has been updated successfully.",
      });
    }
  };

  const handleRemoveEmployee = (employeeId: string) => {
    const updatedEmployees = employees.filter((emp) => emp.id !== employeeId);
    updateEmployees(updatedEmployees);
    toast({
      title: "Employee removed",
      description: "The employee has been removed from the team.",
    });
  };

  const handleUpdateEmployeeSchedule = (employeeId: string, newSchedule: Employee['schedule']) => {
    const updatedEmployees = employees.map((emp) =>
      emp.id === employeeId ? { ...emp, schedule: newSchedule } : emp
    );
    updateEmployees(updatedEmployees);
  };

  const handleUpdateEmployee = (employeeId: string, updates: Partial<Employee>) => {
    const updatedEmployees = employees.map((emp) =>
      emp.id === employeeId ? { ...emp, ...updates } : emp
    );
    updateEmployees(updatedEmployees);
  };

  return (
    <Card>
      <CardHeader className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-muted-foreground" />
          <CardTitle>Team Planning</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage your team's schedule and availability
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={employees.map(emp => emp.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {employees.map((employee) => (
                <EmployeeSchedule
                  key={employee.id}
                  employee={employee}
                  onRemove={() => handleRemoveEmployee(employee.id)}
                  onUpdateSchedule={(schedule) => handleUpdateEmployeeSchedule(employee.id, schedule)}
                  onUpdateEmployee={(updates) => handleUpdateEmployee(employee.id, updates)}
                  businessHours={initialBusinessHours}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <Button onClick={handleAddEmployee} className="w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </CardContent>
    </Card>
  );
};