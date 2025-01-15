import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { fr } from "date-fns/locale";

interface MonthViewProps {
  date: Date;
  appointments: Array<{
    id: string;
    title: string;
    stylist: string;
    time: string;
    duration: string;
    isWalkIn: boolean;
  }>;
}

export const MonthView = ({ date, appointments }: MonthViewProps) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { locale: fr, weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { locale: fr, weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <div className="grid grid-cols-7 gap-1 p-4">
      {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
        <div key={day} className="text-center font-medium py-2">
          {day}
        </div>
      ))}
      {days.map((day) => {
        const dayAppointments = appointments.filter(
          (apt) =>
            format(new Date(apt.time), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
        );

        return (
          <div
            key={day.toString()}
            className={`min-h-[100px] border p-2 ${
              isSameMonth(day, date)
                ? "bg-white"
                : "bg-gray-50 text-gray-400"
            }`}
          >
            <div className="text-right">{format(day, "d")}</div>
            <div className="space-y-1">
              {dayAppointments.slice(0, 2).map((apt) => (
                <div
                  key={apt.id}
                  className="bg-blue-100 p-1 rounded text-xs truncate"
                >
                  {format(new Date(apt.time), "HH:mm")} - {apt.title}
                </div>
              ))}
              {dayAppointments.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{dayAppointments.length - 2} more
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};