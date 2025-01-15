import { startOfWeek, addDays, format, parse } from "date-fns";
import { fr } from "date-fns/locale";

interface WeekViewProps {
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

export const WeekView = ({ date, appointments }: WeekViewProps) => {
  const weekStart = startOfWeek(date, { locale: fr, weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const parseAppointmentDate = (dateStr: string) => {
    try {
      // Assuming time comes in "HH:mm" format and we need to combine it with the day
      const [hours, minutes] = dateStr.split(":");
      const appointmentDate = new Date(date);
      appointmentDate.setHours(parseInt(hours, 10));
      appointmentDate.setMinutes(parseInt(minutes, 10));
      return appointmentDate;
    } catch (e) {
      console.error("Error parsing date:", e);
      return new Date(); // Fallback to current date if parsing fails
    }
  };

  return (
    <div className="grid grid-cols-7 gap-4 p-4">
      {weekDays.map((day) => (
        <div key={day.toString()} className="border rounded-lg p-4">
          <div className="text-sm font-medium mb-2">
            {format(day, "EEEE", { locale: fr })}
          </div>
          <div className="text-lg font-bold mb-4">{format(day, "d")}</div>
          <div className="space-y-2">
            {appointments
              .filter((apt) => {
                const aptDate = parseAppointmentDate(apt.time);
                return (
                  format(aptDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
                );
              })
              .map((apt) => (
                <div
                  key={apt.id}
                  className="bg-blue-100 p-2 rounded text-sm"
                  title={`${apt.title} with ${apt.stylist}`}
                >
                  {apt.time} - {apt.title}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};