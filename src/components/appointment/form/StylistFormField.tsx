import { Employee } from "@/types/schedule";
import { StylistSelect } from "../StylistSelect";

interface StylistFormFieldProps {
  selectedStylistId: string;
  availableEmployees: Employee[];
  onStylistChange: (stylistId: string) => void;
}

export const StylistFormField = ({
  selectedStylistId,
  availableEmployees,
  onStylistChange,
}: StylistFormFieldProps) => {
  return (
    <div className="space-y-2">
      <StylistSelect
        selectedStylistId={selectedStylistId}
        availableEmployees={availableEmployees}
        onStylistChange={onStylistChange}
      />
    </div>
  );
};