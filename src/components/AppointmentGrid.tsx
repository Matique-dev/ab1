import { isSameDay } from "date-fns";
import { AppointmentCard } from "./AppointmentCard";
import { AppointmentModal } from "./AppointmentModal";
import { calculateAppointmentColumns, calculateAppointmentPosition } from "./AppointmentColumns";
import { getStylistColor } from "@/utils/appointmentCalculations";

interface Appointment {
  id: string;
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
  date: Date;
}

interface AppointmentGridProps {
  date: Date;
  appointments: Appointment[];
  hours: number[];
  startHour: number;
  hourHeight: number;
  pageMarginPercent: number;
  onAppointmentEdit: (appointment: Appointment) => void;
  onAppointmentDelete: (appointmentId: string) => void;
}

export const AppointmentGrid = ({
  date,
  appointments,
  hours,
  startHour,
  hourHeight,
  pageMarginPercent,
  onAppointmentEdit,
  onAppointmentDelete,
}: AppointmentGridProps) => {
  // Filter appointments for the current day
  const dayAppointments = appointments.filter(apt => isSameDay(apt.date, date));
  
  // Calculate columns for all appointments at once
  const columnInfo = calculateAppointmentColumns(dayAppointments);

  return (
    <div className="relative ml-16 mr-4 h-full z-10">
      {dayAppointments.map((apt) => {
        const position = calculateAppointmentPosition(
          apt,
          columnInfo,
          startHour,
          hourHeight,
          pageMarginPercent
        );

        return (
          <AppointmentModal
            key={apt.id}
            currentDate={date}
            appointment={apt}
            onAppointmentEdit={onAppointmentEdit}
            onAppointmentDelete={onAppointmentDelete}
            onAppointmentCreate={() => {}}
            trigger={
              <AppointmentCard
                appointment={apt}
                position={position}
                colorClass={getStylistColor(apt.stylist)}
                onClick={() => {}}
              />
            }
          />
        );
      })}
    </div>
  );
};