import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  startOfWeek,
  endOfWeek,
  isSameDay,
  parse,
} from "date-fns";
import { fr } from "date-fns/locale";

interface Appointment {
  id: string;
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
  date?: Date;
}

interface MonthViewProps {
  date: Date;
  appointments: Appointment[];
}

export const MonthView = ({ date, appointments }: MonthViewProps) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { locale: fr, weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { locale: fr, weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const processedAppointments = appointments.map(apt => {
    try {
      const [hours, minutes] = apt.time.split(":").map(Number);
      const appointmentDate = new Date(date);
      appointmentDate.setHours(hours, minutes, 0, 0);
      return { ...apt, date: appointmentDate };
    } catch (e) {
      console.error("Error processing appointment:", e);
      return apt;
    }
  });

  const getAppointmentsForDay = (day: Date) => {
    return processedAppointments
      .filter(apt => apt.date && isSameDay(apt.date, day))
      .sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return a.date.getTime() - b.date.getTime();
      });
  };

  return (
    <div className="grid grid-cols-7 gap-1 p-4">
      {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
        <div key={day} className="text-center font-medium py-2 text-foreground">
          {day}
        </div>
      ))}
      {days.map((day) => {
        const dayAppointments = getAppointmentsForDay(day);

        return (
          <div
            key={day.toString()}
            className={`min-h-[100px] border border-border p-2 ${
              isSameMonth(day, date) ? "bg-card" : "bg-muted text-muted-foreground"
            }`}
          >
            <div className="text-right text-foreground">{format(day, "d")}</div>
            <div className="space-y-1">
              {dayAppointments.slice(0, 2).map((apt) => (
                <div
                  key={apt.id}
                  className="bg-primary/10 text-primary p-1 rounded text-xs truncate"
                >
                  {apt.time} - {apt.title}
                </div>
              ))}
              {dayAppointments.length > 2 && (
                <div className="text-xs text-muted-foreground">
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