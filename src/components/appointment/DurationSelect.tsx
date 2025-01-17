import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DurationSelectProps {
  duration: string;
  onDurationChange: (duration: string) => void;
}

export const DurationSelect = ({
  duration,
  onDurationChange,
}: DurationSelectProps) => {
  return (
    <div className="flex items-center gap-4">
      <Label htmlFor="duration" className="flex-shrink-0">Duration</Label>
      <Select
        value={duration}
        onValueChange={onDurationChange}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="30">30 minutes</SelectItem>
          <SelectItem value="60">60 minutes</SelectItem>
          <SelectItem value="90">90 minutes</SelectItem>
          <SelectItem value="120">120 minutes</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};