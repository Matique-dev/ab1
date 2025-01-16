import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmployeeSchedule } from "./EmployeeSchedule";
import { Employee, WeekSchedule } from "@/types/schedule";
import { useToast } from "@/hooks/use-toast";
import { BusinessHours } from "./BusinessHours";

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

const adjustEmployeeSchedule = (employeeSchedule: Employee['schedule'], businessHours: WeekSchedule) => {
  const newSchedule = { ...employeeSchedule };
  Object.entries(businessHours).forEach(([day, hours]) => {
    // If business is closed, employee can't work
    if (!hours.isOpen) {
      newSchedule[day].isAvailable = false;
    }
    
    // Adjust start time if employee starts before business opens
    if (newSchedule[day].workStart < hours.openTime) {
      newSchedule[day].workStart = hours.openTime;
    }
    
    // Adjust end time if employee ends after business closes
    if (newSchedule[day].workEnd > hours.closeTime) {
      newSchedule[day].workEnd = hours.closeTime;
    }
  });
  return newSchedule;
};

export const TeamPlanning: React.FC = () => {
  const { toast } = useToast();
  const [businessHours, setBusinessHours] = useState<WeekSchedule>(DEFAULT_BUSINESS_HOURS);
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "manager",
      name: "Manager",
      color: "#FF0000",
      schedule: createDefaultEmployeeSchedule(DEFAULT_BUSINESS_HOURS),
    },
  ]);

  const handleBusinessHoursChange = (newBusinessHours: WeekSchedule) => {
    setBusinessHours(newBusinessHours);
    
    // Update all employees' schedules to respect new business hours
    setEmployees(prevEmployees => 
      prevEmployees.map(employee => ({
        ...employee,
        schedule: adjustEmployeeSchedule(employee.schedule, newBusinessHours)
      }))
    );
  };

  const handleAddEmployee = () => {
    const newEmployee: Employee = {
      id: `employee-${employees.length + 1}`,
      name: `Employee ${employees.length + 1}`,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      schedule: createDefaultEmployeeSchedule(businessHours),
    };
    setEmployees([...employees, newEmployee]);
  };

  const handleRemoveEmployee = (employeeId: string) => {
    setEmployees(employees.filter((emp) => emp.id !== employeeId));
  };

  const handleUpdateEmployeeSchedule = (employeeId: string, newSchedule: Employee['schedule']) => {
    // Ensure the new schedule respects business hours
    const adjustedSchedule = adjustEmployeeSchedule(newSchedule, businessHours);
    
    setEmployees(employees.map((emp) =>
      emp.id === employeeId ? { ...emp, schedule: adjustedSchedule } : emp
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
        <Card>
          <CardHeader>
            <CardTitle>Business Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <BusinessHours 
              initialSchedule={businessHours}
              onScheduleChange={handleBusinessHoursChange}
            />
          </CardContent>
        </Card>

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
                  businessHours={businessHours}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <Button onClick={handleAddEmployee} className="w-full">
          Add Employee
        </Button>
      </CardContent>
    </Card>
  );
};