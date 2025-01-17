import { Input } from "@/components/ui/input";

interface ClientNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const ClientNameInput = ({ value, onChange }: ClientNameInputProps) => {
  return (
    <Input
      id="title"
      placeholder="Client Name"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    />
  );
};