import { TimeGrid } from "../TimeGrid";
import { AppointmentGrid } from "../AppointmentGrid";
import { Appointment } from "@/types/appointment";

interface TimelineContentProps {
  dates: Date[];
  appointments: Appointment[];
  startHour: number;
  hourHeight: number;
  pageMarginPercent: number;
  timeColumnWidth: number;
  mode: 'day' | 'week';
  hours: number[];
  onAppointmentEdit: (appointment: Appointment) => void;
  onAppointmentDelete: (appointmentId: string) => void;
}

export const TimelineContent = ({
  dates,
  appointments,
  startHour,
  hourHeight,
  pageMarginPercent,
  timeColumnWidth,
  mode,
  hours,
  onAppointmentEdit,
  onAppointmentDelete,
}: TimelineContentProps) => {
  return (
    <div className="relative flex flex-1 scrollbar-hide">
      <TimeGrid 
        hours={hours}
        startHour={startHour}
        hourHeight={hourHeight}
        mode={mode}
        dates={dates}
        timeColumnWidth={timeColumnWidth}
      />
      <AppointmentGrid
        dates={dates}
        appointments={appointments}
        startHour={startHour}
        hourHeight={hourHeight}
        pageMarginPercent={pageMarginPercent}
        timeColumnWidth={timeColumnWidth}
        onAppointmentEdit={onAppointmentEdit}
        onAppointmentDelete={onAppointmentDelete}
      />
    </div>
  );
};