import { useState } from "react";
import { AppointmentGrid } from "./AppointmentGrid";
import { AppointmentModal } from "./AppointmentModal";
import { TimeGrid } from "./TimeGrid";
import { useBusinessStore } from "@/hooks/useBusinessStore";

interface Appointment {
  id: string;  // Making id required
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
  onAppointmentEdit: (updatedAppointment: Appointment) => void;
  onAppointmentDelete: (appointmentId: string) => void;
}

const DEFAULT_HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM
const DEFAULT_START_HOUR = 8;
const DEFAULT_HOUR_HEIGHT = 60;

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
    console.log("Creating appointment:", appointment);
  };

  return (
    <div className="flex flex-1">
      <TimeGrid 
        hours={DEFAULT_HOURS}
        startHour={DEFAULT_START_HOUR}
        hourHeight={DEFAULT_HOUR_HEIGHT}
      />
      <div className="flex-1 relative min-h-[600px]">
        <AppointmentGrid
          date={date}
          appointments={appointments}
          hours={DEFAULT_HOURS}
          startHour={DEFAULT_START_HOUR}
          hourHeight={DEFAULT_HOUR_HEIGHT}
          pageMarginPercent={10}
          onAppointmentEdit={onAppointmentEdit}
          onAppointmentDelete={onAppointmentDelete}
          employees={employees}
          getServiceDetails={(serviceId) => 
            services.find(service => service.id === serviceId) || null
          }
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