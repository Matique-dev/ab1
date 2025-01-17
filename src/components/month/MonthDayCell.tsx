import { format, isSameMonth } from "date-fns";
import { Appointment } from "@/types/appointment";
import { MonthAppointmentItem } from "./MonthAppointmentItem";

interface MonthDayCellProps {
  day: Date;
  currentMonth: Date;
  appointments: Appointment[];
  isBusinessDay: boolean;
  onDayClick: (day: Date) => void;
  onAppointmentClick: (e: React.MouseEvent, appointment: Appointment) => void;
}

export const MonthDayCell = ({
  day,
  currentMonth,
  appointments,
  isBusinessDay,
  onDayClick,
  onAppointmentClick,
}: MonthDayCellProps) => {
  const nonBusinessDayStyle = {
    backgroundImage: `repeating-linear-gradient(
      135deg,
      rgba(142, 145, 150, 0.1),
      rgba(142, 145, 150, 0.1) 2px,
      transparent 2px,
      transparent 12px
    )`,
  };

  return (
    <div
      className={`min-h-[100px] border p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
        isSameMonth(day, currentMonth) 
          ? "bg-white dark:bg-gray-800" 
          : "bg-gray-50 dark:bg-gray-900 text-gray-400"
      }`}
      style={!isBusinessDay ? nonBusinessDayStyle : undefined}
      onClick={() => onDayClick(day)}
    >
      <div className="text-right">{format(day, "d")}</div>
      <div className="space-y-1">
        {appointments.slice(0, 2).map((apt) => (
          <MonthAppointmentItem
            key={apt.id}
            appointment={apt}
            onClick={(e) => onAppointmentClick(e, apt)}
          />
        ))}
        {appointments.length > 2 && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            +{appointments.length - 2} more
          </div>
        )}
      </div>
    </div>
  );
};