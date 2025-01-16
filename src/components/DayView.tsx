import { TimeGrid } from "./TimeGrid";
import { AppointmentGrid } from "./AppointmentGrid";
import { useRef, useState } from "react";
import { AppointmentModal } from "./AppointmentModal";
import { useDayViewScroll } from "@/hooks/useDayViewScroll";
import { Employee, WeekSchedule } from "@/types/schedule";
import { ServiceType } from "@/types/service";
import { useBusinessStore } from "@/hooks/useBusinessStore";

interface Appointment {
  id: string;
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
  date: Date;
  serviceId?: string; // Add serviceId to track selected service
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
  const hours = Array.from({ length: 12 }, (_, i) => i + 9); // 9 AM to 8 PM
  const HOUR_HEIGHT = 100;
  const START_HOUR = 9;
  const PAGE_MARGIN_PERCENT = 2.5;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Get business configuration from the store
  const { 
    employees, 
    services, 
    businessHours,
    exceptionDates = [] // This would come from backend later
  } = useBusinessStore();

  useDayViewScroll(scrollContainerRef, HOUR_HEIGHT);

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const relativeY = e.clientY - rect.top + container.scrollTop;
    const totalMinutes = (relativeY / HOUR_HEIGHT) * 60;
    const hour = Math.floor(totalMinutes / 60) + START_HOUR;
    const minutes = Math.floor((totalMinutes % 60) / 30) * 30;
    const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    setSelectedTime(timeString);
    setIsModalOpen(true);
  };

  const handleAppointmentCreate = (appointment: Omit<Appointment, "id">) => {
    const newAppointment = {
      ...appointment,
      id: Math.random().toString(36).substr(2, 9),
    };
    console.log("New appointment created:", newAppointment);
  };

  // Get service details for appointments
  const getServiceDetails = (serviceId?: string) => {
    if (!serviceId) return null;
    return services.find(service => service.id === serviceId);
  };

  return (
    <>
      <div 
        ref={scrollContainerRef}
        className="flex flex-col h-[calc(100vh-12rem)] overflow-y-auto relative scroll-smooth"
        onDoubleClick={handleDoubleClick}
      >
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
          employees={employees}
          getServiceDetails={getServiceDetails}
        />
      </div>
      <AppointmentModal
        onAppointmentCreate={handleAppointmentCreate}
        currentDate={date}
        trigger={<></>}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        defaultTime={selectedTime}
        employees={employees}
        services={services}
        businessHours={businessHours}
        exceptionDates={exceptionDates}
      />
    </>
  );
};