import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { EmployeeSchedule } from "./EmployeeSchedule";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Employee {
  id: string;
  name: string;
  color: string;
  schedule: {
    [key: string]: {
      isAvailable: boolean;
      workStart: string;
      workEnd: string;
      lunchStart: string;
      lunchEnd: string;
    };
  };
}

const DEFAULT_SCHEDULE = {
  monday: { isAvailable: true, workStart: "09:00", workEnd: "17:00", lunchStart: "12:00", lunchEnd: "13:00" },
  tuesday: { isAvailable: true, workStart: "09:00", workEnd: "17:00", lunchStart: "12:00", lunchEnd: "13:00" },
  wednesday: { isAvailable: true, workStart: "09:00", workEnd: "17:00", lunchStart: "12:00", lunchEnd: "13:00" },
  thursday: { isAvailable: true, workStart: "09:00", workEnd: "17:00", lunchStart: "12:00", lunchEnd: "13:00" },
  friday: { isAvailable: true, workStart: "09:00", workEnd: "17:00", lunchStart: "12:00", lunchEnd: "13:00" },
  saturday: { isAvailable: false, workStart: "09:00", workEnd: "17:00", lunchStart: "12:00", lunchEnd: "13:00" },
  sunday: { isAvailable: false, workStart: "09:00", workEnd: "17:00", lunchStart: "12:00", lunchEnd: "13:00" },
};

export const TeamPlanning = () => {
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = React.useState({ name: "", color: "#ee9ca7" });
  const { toast } = useToast();

  const handleAddEmployee = () => {
    if (!newEmployee.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter an employee name",
        variant: "destructive",
      });
      return;
    }

    const employee: Employee = {
      id: crypto.randomUUID(),
      name: newEmployee.name.trim(),
      color: newEmployee.color,
      schedule: DEFAULT_SCHEDULE,
    };

    setEmployees([...employees, employee]);
    setNewEmployee({ name: "", color: "#ee9ca7" });
    
    toast({
      title: "Success",
      description: "Team member added successfully",
    });
  };

  const handleRemoveEmployee = (id: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
    toast({
      title: "Success",
      description: "Team member removed successfully",
    });
  };

  const handleUpdateSchedule = (employeeId: string, schedule: Employee['schedule']) => {
    setEmployees(employees.map(emp => 
      emp.id === employeeId 
        ? { ...emp, schedule } 
        : emp
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Planning</CardTitle>
        <CardDescription>
          Manage your team's availability and working hours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Input
              placeholder="Team member name"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              className="flex-1"
            />
            <Input
              type="color"
              value={newEmployee.color}
              onChange={(e) => setNewEmployee({ ...newEmployee, color: e.target.value })}
              className="w-20"
            />
            <Button onClick={handleAddEmployee} className="whitespace-nowrap">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>

          <div className="space-y-4">
            {employees.map((employee) => (
              <EmployeeSchedule
                key={employee.id}
                employee={employee}
                onRemove={() => handleRemoveEmployee(employee.id)}
                onUpdateSchedule={(schedule) => handleUpdateSchedule(employee.id, schedule)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};