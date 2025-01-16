import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmployeeSchedule } from "./EmployeeSchedule";
import { Employee, WeekSchedule } from "@/types/schedule";
import { useToast } from "@/hooks/use-toast";
import { Users } from "lucide-react";

export const DEFAULT_BUSINESS_HOURS: WeekSchedule = {
  monday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  tuesday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  wednesday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  thursday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  friday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  saturday: { isOpen: false, openTime: "09:00", closeTime: "17:00" },
  sunday: { isOpen: false, openTime: "09:00", closeTime: "17:00" },
};

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

interface TeamPlanningProps {
  initialBusinessHours: WeekSchedule;
  onBusinessHoursChange: (schedule: WeekSchedule) => void;
}

const DEFAULT_EMPLOYEE_COLORS = ['#6557FF', '#AA3FFF', '#F8522E', '#2ECC71'];

export const TeamPlanning: React.FC<TeamPlanningProps> = ({
  initialBusinessHours,
  onBusinessHoursChange
}) => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "manager",
      name: "Manager",
      color: DEFAULT_EMPLOYEE_COLORS[0],
      schedule: createDefaultEmployeeSchedule(initialBusinessHours),
    },
  ]);
  const [colorIndex, setColorIndex] = useState(1);

  const handleAddEmployee = () => {
    const newEmployee: Employee = {
      id: `employee-${Date.now()}`,
      name: `Employee ${employees.length + 1}`,
      color: DEFAULT_EMPLOYEE_COLORS[colorIndex % DEFAULT_EMPLOYEE_COLORS.length],
      schedule: createDefaultEmployeeSchedule(initialBusinessHours),
    };
    setEmployees([...employees, newEmployee]);
    setColorIndex(prev => prev + 1);
  };

  const handleRemoveEmployee = (employeeId: string) => {
    setEmployees(employees.filter((emp) => emp.id !== employeeId));
  };

  const handleUpdateEmployeeSchedule = (employeeId: string, newSchedule: Employee['schedule']) => {
    setEmployees(employees.map((emp) =>
      emp.id === employeeId ? { ...emp, schedule: newSchedule } : emp
    ));
  };

  const handleUpdateEmployee = (employeeId: string, updates: Partial<Employee>) => {
    setEmployees(employees.map((emp) =>
      emp.id === employeeId ? { ...emp, ...updates } : emp
    ));
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
        <DndContext>
          <SortableContext items={employees.map(emp => emp.id)}>
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
        <Button onClick={handleAddEmployee}>
          <Plus className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </CardContent>
    </Card>
  );
};
