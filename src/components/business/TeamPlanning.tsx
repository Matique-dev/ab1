import React from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

// Default employee with new color
const defaultEmployee: Employee = {
  id: "employee-1",
  name: "Stylist 1",
  color: EMPLOYEE_COLORS.SECONDARY, // This is #AA3FFF
  schedule: {},
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
  const [defaultEmployeeId, setDefaultEmployeeId] = React.useState<string>("employee-1");

  // Initialize with default employee if no employees exist
  React.useEffect(() => {
    if (employees.length === 0) {
      const initialEmployee = {
        ...defaultEmployee,
        schedule: createDefaultEmployeeSchedule(initialBusinessHours)
      };
      updateEmployees([initialEmployee]);
    }
  }, []);

  const handleAddEmployee = () => {
    const colors = [
      EMPLOYEE_COLORS.SECONDARY,
      EMPLOYEE_COLORS.TERTIARY,
      EMPLOYEE_COLORS.QUATERNARY
    ];
    
    const newEmployee: Employee = {
      id: `employee-${Date.now()}`,
      name: `Stylist ${employees.length + 1}`,
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

  const isDefaultEmployee = (employeeId: string) => employeeId === defaultEmployeeId;

  const handleRemoveEmployee = (employeeId: string) => {
    if (isDefaultEmployee(employeeId)) {
      toast({
        title: "Cannot remove default employee",
        description: "Please select a new default employee first.",
        variant: "destructive",
      });
      return;
    }
    
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

  const handleDefaultEmployeeChange = (employeeId: string) => {
    setDefaultEmployeeId(employeeId);
    toast({
      title: "Default employee updated",
      description: `${employees.find(emp => emp.id === employeeId)?.name} is now the default employee.`,
    });
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
                  isDefault={isDefaultEmployee(employee.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <div className="flex justify-between items-center">
          <Button onClick={handleAddEmployee} className="w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Employee
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Main:</span>
            <Select value={defaultEmployeeId} onValueChange={handleDefaultEmployeeChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ 
                        backgroundColor: employees.find(emp => emp.id === defaultEmployeeId)?.color 
                      }} 
                    />
                    <span>
                      {employees.find(emp => emp.id === defaultEmployeeId)?.name}
                    </span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: employee.color }} 
                      />
                      <span>{employee.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};