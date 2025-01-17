import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface WalkInCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const WalkInCheckbox = ({ checked, onChange }: WalkInCheckboxProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="walkIn"
        checked={checked}
        onCheckedChange={onChange}
      />
      <Label htmlFor="walkIn">Walk-in appointment</Label>
    </div>
  );
};