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

  const parseAppointmentDate = (dateStr: string, day: Date) => {
    try {
      // Assuming time comes in "HH:mm" format
      const [hours, minutes] = dateStr.split(":");
      const appointmentDate = new Date(day);
      appointmentDate.setHours(parseInt(hours, 10));
      appointmentDate.setMinutes(parseInt(minutes, 10));
      return appointmentDate;
    } catch (e) {
      console.error("Error parsing date:", e);
      return null; // Return null instead of fallback date to skip invalid dates
    }
  };

  const sortAppointmentsByTime = (a: typeof appointments[0], b: typeof appointments[0]) => {
    const [aHours, aMinutes] = a.time.split(":").map(Number);
    const [bHours, bMinutes] = b.time.split(":").map(Number);
    
    if (aHours === bHours) {
      return aMinutes - bMinutes;
    }
    return aHours - bHours;
  };

  return (
    <div className="grid grid-cols-7 gap-1 p-4">
      {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
        <div key={day} className="text-center font-medium py-2">
          {day}
        </div>
      ))}
      {days.map((day) => {
        const dayAppointments = appointments
          .filter((apt) => {
            const aptDate = parseAppointmentDate(apt.time, day);
            return aptDate && format(aptDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
          })
          .sort(sortAppointmentsByTime);

        return (
          <div
            key={day.toString()}
            className={`min-h-[100px] border p-2 ${
              isSameMonth(day, date) ? "bg-white" : "bg-gray-50 text-gray-400"
            }`}
          >
            <div className="text-right">{format(day, "d")}</div>
            <div className="space-y-1">
              {dayAppointments.slice(0, 2).map((apt) => (
                <div
                  key={apt.id}
                  className="bg-blue-100 p-1 rounded text-xs truncate"
                >
                  {apt.time} - {apt.title}
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