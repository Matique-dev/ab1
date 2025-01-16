import React, { useState } from "react";
import { DragDropContext, Droppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmployeeSchedule } from "./EmployeeSchedule";
import { Employee, WeekSchedule } from "@/types/schedule";
import { useToast } from "@/hooks/use-toast";

export const DEFAULT_BUSINESS_HOURS: WeekSchedule = {
  monday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  tuesday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  wednesday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  thursday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  friday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  saturday: { isOpen: false, openTime: "09:00", closeTime: "17:00" },
  sunday: { isOpen: false, openTime: "09:00", closeTime: "17:00" },
};

const DEFAULT_EMPLOYEE_SCHEDULE = {
  monday: { isAvailable: true, workStart: "09:00", workEnd: "17:00", lunchStart: "12:00", lunchEnd: "13:00" },
  tuesday: { isAvailable: true, workStart: "09:00", workEnd: "17:00", lunchStart: "12:00", lunchEnd: "13:00" },
  wednesday: { isAvailable: true, workStart: "09:00", workEnd: "17:00", lunchStart: "12:00", lunchEnd: "13:00" },
  thursday: { isAvailable: true, workStart: "09:00", workEnd: "17:00", lunchStart: "12:00", lunchEnd: "13:00" },
  friday: { isAvailable: true, workStart: "09:00", workEnd: "17:00", lunchStart: "12:00", lunchEnd: "13:00" },
  saturday: { isAvailable: false, workStart: "09:00", workEnd: "17:00", lunchStart: "12:00", lunchEnd: "13:00" },
  sunday: { isAvailable: false, workStart: "09:00", workEnd: "17:00", lunchStart: "12:00", lunchEnd: "13:00" },
};

export const TeamPlanning: React.FC = () => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "manager",
      name: "Manager",
      color: "#FF0000",
      schedule: DEFAULT_EMPLOYEE_SCHEDULE,
    },
  ]);
  const [businessHours, setBusinessHours] = useState<WeekSchedule>(DEFAULT_BUSINESS_HOURS);

  const handleAddEmployee = () => {
    const newEmployee: Employee = {
      id: `employee-${employees.length + 1}`,
      name: `Employee ${employees.length + 1}`,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      schedule: DEFAULT_EMPLOYEE_SCHEDULE,
    };
    setEmployees([...employees, newEmployee]);
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
        <CardTitle>Team Planning</CardTitle>
        <p className="text-sm text-salon-gray">
          Manage your team's schedule and availability.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {employees.map((employee) => (
            <EmployeeSchedule
              key={employee.id}
              employee={employee}
              onRemove={() => handleRemoveEmployee(employee.id)}
              onUpdateSchedule={(schedule) => handleUpdateEmployeeSchedule(employee.id, schedule)}
              onUpdateEmployee={(updates) => handleUpdateEmployee(employee.id, updates)}
              businessHours={businessHours}
            />
          ))}
        </div>
        <Button onClick={handleAddEmployee} className="w-full">
          Add Employee
        </Button>
      </CardContent>
    </Card>
  );
};