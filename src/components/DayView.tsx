import { useState } from "react";
import { format } from "date-fns";
import { AppointmentGrid } from "./AppointmentGrid";
import { AppointmentModal } from "./AppointmentModal";
import { TimeGrid } from "./TimeGrid";
import { useBusinessStore } from "@/hooks/useBusinessStore";

interface Appointment {
  id?: string;
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
  onAppointmentEdit: (updatedAppointment: Appointment) => void;
  onAppointmentDelete: (appointmentId: string) => void;
}

export const DayView = ({
  date,
  appointments,
  onAppointmentEdit,
  onAppointmentDelete,
}: DayViewProps) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { employees, services, businessHours, exceptionDates } = useBusinessStore();

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
  };

  const handleModalClose = () => {
    setSelectedTime(null);
  };

  const handleAppointmentCreate = (appointment: Omit<Appointment, "id">) => {
    // Logic for creating a new appointment
    // This is where you would typically call an API to save the appointment
    console.log("Creating appointment:", appointment);
  };

  return (
    <div className="flex flex-1">
      <TimeGrid onTimeClick={handleTimeClick} />
      <div className="flex-1 relative min-h-[600px]">
        <AppointmentGrid
          date={date}
          appointments={appointments}
          onAppointmentEdit={onAppointmentEdit}
          onAppointmentDelete={onAppointmentDelete}
        />
        <AppointmentModal
          currentDate={date}
          onAppointmentCreate={handleAppointmentCreate}
          isOpen={!!selectedTime}
          onOpenChange={handleModalClose}
          defaultTime={selectedTime || undefined}
          employees={employees}
          services={services}
          businessHours={businessHours}
          exceptionDates={exceptionDates}
        />
      </div>
    </div>
  );
};
