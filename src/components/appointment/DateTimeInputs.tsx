import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateTimeInputsProps {
  selectedDate: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

export const DateTimeInputs = ({
  selectedDate,
  time,
  onDateChange,
  onTimeChange,
}: DateTimeInputsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="time">Time</Label>
        <Input
          id="time"
          type="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          required
        />
      </div>
    </div>
  );
};