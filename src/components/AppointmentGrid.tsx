import { calculateAppointmentColumns } from "./AppointmentColumns";
import { AppointmentGridColumn } from "./appointment/AppointmentGridColumn";
import { Appointment } from "@/types/appointment";

interface AppointmentGridProps {
  dates: Date[];
  appointments: Appointment[];
  startHour: number;
  hourHeight: number;
  pageMarginPercent: number;
  timeColumnWidth: number;
  onAppointmentEdit: (appointment: Appointment) => void;
  onAppointmentDelete: (appointmentId: string) => void;
}

export const AppointmentGrid = ({
  dates,
  appointments,
  startHour,
  hourHeight,
  pageMarginPercent,
  timeColumnWidth,
  onAppointmentEdit,
  onAppointmentDelete,
}: AppointmentGridProps) => {
  return (
    <div 
      className="absolute inset-0 z-10 flex"
      style={{ marginLeft: `${timeColumnWidth}px` }}
    >
      {dates.map((date) => {
        const dayAppointments = appointments;
        const columnInfo = calculateAppointmentColumns(dayAppointments);
        const columnWidth = 100 / dates.length;

        return (
          <div 
            key={date.toString()} 
            className="relative"
            style={{ 
              width: `${columnWidth}%`,
              minWidth: `${columnWidth}%` 
            }}
          >
            <AppointmentGridColumn
              date={date}
              appointments={appointments}
              columnInfo={columnInfo}
              startHour={startHour}
              hourHeight={hourHeight}
              pageMarginPercent={pageMarginPercent}
              onAppointmentEdit={onAppointmentEdit}
              onAppointmentDelete={onAppointmentDelete}
            />
          </div>
        );
      })}
    </div>
  );
};