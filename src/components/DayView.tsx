import { TimeGrid } from "./TimeGrid";
import { AppointmentGrid } from "./AppointmentGrid";

interface Appointment {
  id: string;
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
  date: Date;
}

interface DayViewProps {
  date: Date;
  appointments: Appointment[];
  onAppointmentEdit: (appointment: Appointment) => void;
  onAppointmentDelete: (appointmentId: string) => void;
}

export const DayView = ({ 
  date, 
  appointments, 
  onAppointmentEdit,
  onAppointmentDelete 
}: DayViewProps) => {
  const hours = Array.from({ length: 12 }, (_, i) => i + 9); // 9 AM to 8 PM
  const HOUR_HEIGHT = 100; // Height in pixels for one hour
  const START_HOUR = 9; // 9 AM
  const PAGE_MARGIN_PERCENT = 2.5; // 2.5% margin from page edges

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] overflow-y-auto relative">
      <TimeGrid 
        hours={hours}
        startHour={START_HOUR}
        hourHeight={HOUR_HEIGHT}
      />
      <AppointmentGrid
        date={date}
        appointments={appointments}
        hours={hours}
        startHour={START_HOUR}
        hourHeight={HOUR_HEIGHT}
        pageMarginPercent={PAGE_MARGIN_PERCENT}
        onAppointmentEdit={onAppointmentEdit}
        onAppointmentDelete={onAppointmentDelete}
      />
    </div>
  );
};