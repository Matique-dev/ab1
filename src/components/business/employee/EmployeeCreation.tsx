import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmployeeCreationProps {
  onAddEmployee: () => void;
}

export const EmployeeCreation: React.FC<EmployeeCreationProps> = ({ onAddEmployee }) => {
  return (
    <Button onClick={onAddEmployee} className="w-auto">
      <Plus className="mr-2 h-4 w-4" /> Add Employee
    </Button>
  );
};