import React from "react";
import { Employee } from "@/types/schedule";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const UNASSIGNED_COLOR = "#6557FF";

interface StylistSelectProps {
  selectedStylistId: string;
  availableEmployees: Employee[];
  onStylistChange: (stylistId: string) => void;
}

export const StylistSelect = ({
  selectedStylistId,
  availableEmployees,
  onStylistChange,
}: StylistSelectProps) => {
  const employeeOptions = [
    {
      id: "anyone",
      name: "Anyone",
      color: UNASSIGNED_COLOR,
    },
    ...availableEmployees
  ];

  const selectedEmployee = employeeOptions.find(e => e.id === selectedStylistId);

  const renderEmployeeIcon = (employee: { color: string }) => {
    return (
      <div 
        className="h-4 w-4 rounded-full mr-2 flex-shrink-0"
        style={{ backgroundColor: employee.color }}
      />
    );
  };

  return (
    <Select
      value={selectedStylistId}
      onValueChange={onStylistChange}
      defaultValue="anyone"
    >
      <SelectTrigger className="w-full">
        <SelectValue>
          {selectedEmployee && (
            <div className="flex items-center">
              {renderEmployeeIcon(selectedEmployee)}
              <span>{selectedEmployee.name}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {employeeOptions.map((employee) => (
          <SelectItem key={employee.id} value={employee.id}>
            <div className="flex items-center">
              {renderEmployeeIcon(employee)}
              <span>{employee.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};