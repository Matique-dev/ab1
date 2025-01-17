import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ClientNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const ClientNameInput = ({ value, onChange }: ClientNameInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="title">Client Name</Label>
      <Input
        id="title"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
};