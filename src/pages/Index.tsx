import { useState } from "react";
import { CalendarHeader } from "@/components/CalendarHeader";
import { AppointmentModal } from "@/components/AppointmentModal";
import { DayView } from "@/components/DayView";
import { WeekView } from "@/components/WeekView";
import { MonthView } from "@/components/MonthView";
import { fr } from "date-fns/locale";
import { useBusinessStore } from "@/hooks/useBusinessStore";
import { useAppointments } from "@/hooks/useAppointments";
import { CALENDAR_TRANSLATIONS } from "@/constants/translations";

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("day");
  const { services } = useBusinessStore();
  const { 
    appointments, 
    handleAppointmentCreate, 
    handleAppointmentEdit, 
    handleAppointmentDelete 
  } = useAppointments();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow animate-fade-in">
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-salon-pink to-salon-peach bg-clip-text text-transparent">
              {CALENDAR_TRANSLATIONS.HEADER.TITLE}
            </h1>
            <AppointmentModal 
              onAppointmentCreate={handleAppointmentCreate}
              currentDate={currentDate}
              services={services}
            />
          </div>
          <CalendarHeader
            currentDate={currentDate}
            view={view}
            onViewChange={setView}
            onDateChange={setCurrentDate}
            locale={fr}
          />
          {view === "day" && (
            <DayView 
              date={currentDate} 
              appointments={appointments} 
              onAppointmentEdit={handleAppointmentEdit}
              onAppointmentDelete={handleAppointmentDelete}
            />
          )}
          {view === "week" && (
            <WeekView 
              date={currentDate} 
              appointments={appointments}
              onAppointmentEdit={handleAppointmentEdit}
              onAppointmentDelete={handleAppointmentDelete}
            />
          )}
          {view === "month" && (
            <MonthView 
              date={currentDate} 
              appointments={appointments}
              onAppointmentEdit={handleAppointmentEdit}
              onAppointmentDelete={handleAppointmentDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;