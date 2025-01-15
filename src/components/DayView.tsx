import { TimeGrid } from "./TimeGrid";
import { AppointmentGrid } from "./AppointmentGrid";
import { useEffect, useRef, useState } from "react";
import { AppointmentModal } from "./AppointmentModal";
import { format } from "date-fns";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>("");

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let isScrolling: NodeJS.Timeout;
    let lastScrollTop = container.scrollTop;

    const handleScroll = () => {
      // Clear the existing timeout
      clearTimeout(isScrolling);

      // Set a new timeout
      isScrolling = setTimeout(() => {
        const currentScrollTop = container.scrollTop;
        const halfHourHeight = HOUR_HEIGHT / 2;
        
        // Calculate the nearest 30-minute slot
        const nearestSlot = Math.round(currentScrollTop / halfHourHeight) * halfHourHeight;
        
        // Only snap if the scroll has ended and we're not already at a slot
        if (currentScrollTop !== lastScrollTop && currentScrollTop !== nearestSlot) {
          container.scrollTo({
            top: nearestSlot,
            behavior: 'smooth'
          });
        }
        
        lastScrollTop = nearestSlot;
      }, 150); // Adjust this delay as needed
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      clearTimeout(isScrolling);
    };
  }, [HOUR_HEIGHT]);

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
    // Here you would typically call a parent function to add the appointment
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
      />
    </>
  );
};