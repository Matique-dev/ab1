import React from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmployeeSchedule } from "./EmployeeSchedule";
import { Employee, EMPLOYEE_COLORS, WeekSchedule } from "@/types/schedule";
import { useToast } from "@/hooks/use-toast";
import { Users, Plus } from "lucide-react";
import { useBusinessStore } from "@/hooks/useBusinessStore";

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

export const TeamPlanning: React.FC<TeamPlanningProps> = ({
  initialBusinessHours,
  onBusinessHoursChange
}) => {
  const { toast } = useToast();
  const { employees, updateEmployees } = useBusinessStore();
  const [colorIndex, setColorIndex] = React.useState(1);

  const handleAddEmployee = () => {
    const colors = [
      EMPLOYEE_COLORS.SECONDARY,
      EMPLOYEE_COLORS.TERTIARY,
      EMPLOYEE_COLORS.QUATERNARY
    ];
    
    const newEmployee: Employee = {
      id: `employee-${Date.now()}`,
      name: `Employee ${employees.length}`,
      color: colors[colorIndex % colors.length],
      schedule: createDefaultEmployeeSchedule(initialBusinessHours),
    };
    
    const updatedEmployees = [...employees, newEmployee];
    updateEmployees(updatedEmployees);
    setColorIndex(prev => prev + 1);
    
    toast({
      title: "Employee added",
      description: `${newEmployee.name} has been added to the team.`,
    });
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
        <div className="flex justify-start">
          <Button onClick={handleAddEmployee} className="w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Employee
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};