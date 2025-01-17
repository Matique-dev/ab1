import { Label } from "@/components/ui/label";

interface WalkInCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const WalkInCheckbox = ({ checked, onChange }: WalkInCheckboxProps) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="walkIn"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-gray-300"
      />
      <Label htmlFor="walkIn">Walk-in appointment</Label>
    </div>
  );
};