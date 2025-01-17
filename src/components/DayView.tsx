import { TimelineView } from "./TimelineView";

interface Appointment {
  id: string;
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
  date: Date;
  serviceId?: string;
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
  onAppointmentDelete,
}: DayViewProps) => {
  return (
    <TimelineView
      date={date}
      appointments={appointments}
      mode="day"
      onAppointmentEdit={onAppointmentEdit}
      onAppointmentDelete={onAppointmentDelete}
    />
  );
};