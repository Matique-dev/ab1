import { TimeGrid } from "../TimeGrid";
import { AppointmentGrid } from "../AppointmentGrid";

interface TimelineContentProps {
  dates: Date[];
  appointments: any[];
  hours: number[];
  startHour: number;
  hourHeight: number;
  pageMarginPercent: number;
  timeColumnWidth: number;
  mode: 'day' | 'week';
  onAppointmentEdit: (appointment: any) => void;
  onAppointmentDelete: (appointmentId: string) => void;
}

export const TimelineContent = ({
  dates,
  appointments,
  hours,
  startHour,
  hourHeight,
  pageMarginPercent,
  timeColumnWidth,
  mode,
  onAppointmentEdit,
  onAppointmentDelete,
}: TimelineContentProps) => {
  return (
    <div className="relative flex flex-1">
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
        hours={hours}
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