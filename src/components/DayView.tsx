import { TimeGrid } from "./TimeGrid";
import { AppointmentGrid } from "./AppointmentGrid";
import { useEffect, useRef } from "react";

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

  return (
    <div 
      ref={scrollContainerRef}
      className="flex flex-col h-[calc(100vh-12rem)] overflow-y-auto relative scroll-smooth"
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
  );
};