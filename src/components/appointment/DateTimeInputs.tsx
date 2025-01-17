import { Input } from "@/components/ui/input";

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
      <Input
        id="date"
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        required
      />
      <Input
        id="time"
        type="time"
        value={time}
        onChange={(e) => onTimeChange(e.target.value)}
        required
      />
    </div>
  );
};