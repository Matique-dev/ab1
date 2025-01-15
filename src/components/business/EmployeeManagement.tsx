import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Employee {
  id: string;
  name: string;
  color: string;
}

export const EmployeeManagement = () => {
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
    };

    setEmployees([...employees, employee]);
    setNewEmployee({ name: "", color: "#ee9ca7" });
    
    toast({
      title: "Success",
      description: "Employee added successfully",
    });
  };

  const handleRemoveEmployee = (id: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
    toast({
      title: "Success",
      description: "Employee removed successfully",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <Input
          placeholder="Employee name"
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
          Add Employee
        </Button>
      </div>

      <div className="space-y-2">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="flex items-center justify-between p-3 rounded-lg border"
            style={{ borderColor: employee.color }}
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: employee.color }}
              />
              <span>{employee.name}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveEmployee(employee.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};