import { TimeGrid } from "./TimeGrid";
import { AppointmentGrid } from "./AppointmentGrid";
import { useRef, useState } from "react";
import { AppointmentModal } from "./AppointmentModal";
import { useDayViewScroll } from "@/hooks/useDayViewScroll";
import { Employee, WeekSchedule } from "@/types/schedule";
import { ServiceType } from "@/types/service";

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
  employees?: Employee[];
  services?: ServiceType[];
  businessHours?: WeekSchedule;
  exceptionDates?: Array<{
    date: Date;
    isAllDayOff: boolean;
    openTime?: string;
    closeTime?: string;
  }>;
}

export const DayView = ({ 
  date, 
  appointments, 
  onAppointmentEdit,
  onAppointmentDelete,
  employees = [],
  services = [],
  businessHours,
  exceptionDates = []
}: DayViewProps) => {
  const hours = Array.from({ length: 12 }, (_, i) => i + 9); // 9 AM to 8 PM
  const HOUR_HEIGHT = 100; // Height in pixels for one hour
  const START_HOUR = 9; // 9 AM
  const PAGE_MARGIN_PERCENT = 2.5; // 2.5% margin from page edges
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>("");

  useDayViewScroll(scrollContainerRef, HOUR_HEIGHT);

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Get click position relative to the container
    const rect = container.getBoundingClientRect();
    const relativeY = e.clientY - rect.top + container.scrollTop;

    // Calculate the time based on the click position
    const totalMinutes = (relativeY / HOUR_HEIGHT) * 60;
    const hour = Math.floor(totalMinutes / 60) + START_HOUR;
    const minutes = Math.floor((totalMinutes % 60) / 30) * 30;

    // Format the time string (HH:mm)
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