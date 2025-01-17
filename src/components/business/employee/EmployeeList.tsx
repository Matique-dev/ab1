import React from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Employee, WeekSchedule } from "@/types/schedule";
import { EmployeeSchedule } from "../EmployeeSchedule";

interface EmployeeListProps {
  employees: Employee[];
  businessHours: WeekSchedule;
  onDragEnd: (event: DragEndEvent) => void;
  onRemoveEmployee: (employeeId: string) => void;
  onUpdateEmployeeSchedule: (employeeId: string, schedule: Employee['schedule']) => void;
  onUpdateEmployee: (employeeId: string, updates: Partial<Employee>) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  businessHours,
  onDragEnd,
  onRemoveEmployee,
  onUpdateEmployeeSchedule,
  onUpdateEmployee,
}) => {
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={employees.map(emp => emp.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {employees.map((employee) => (
            <EmployeeSchedule
              key={employee.id}
              employee={employee}
              onRemove={() => onRemoveEmployee(employee.id)}
              onUpdateSchedule={(schedule) => onUpdateEmployeeSchedule(employee.id, schedule)}
              onUpdateEmployee={(updates) => onUpdateEmployee(employee.id, updates)}
              businessHours={businessHours}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};