import { Employee } from "@/types/schedule";
import { StylistSelect } from "../StylistSelect";
import { Label } from "@/components/ui/label";

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
      <Label htmlFor="stylist">Stylist</Label>
      <StylistSelect
        selectedStylistId={selectedStylistId}
        availableEmployees={availableEmployees}
        onStylistChange={onStylistChange}
      />
    </div>
  );
};