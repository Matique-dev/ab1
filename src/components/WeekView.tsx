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

interface WeekViewProps {
  date: Date;
  appointments: Appointment[];
  onAppointmentEdit: (appointment: Appointment) => void;
  onAppointmentDelete: (appointmentId: string) => void;
}

export const WeekView = ({ 
  date, 
  appointments,
  onAppointmentEdit,
  onAppointmentDelete,
}: WeekViewProps) => {
  return (
    <TimelineView
      date={date}
      appointments={appointments}
      mode="week"
      onAppointmentEdit={onAppointmentEdit}
      onAppointmentDelete={onAppointmentDelete}
    />
  );
};