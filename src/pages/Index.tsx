import { useState } from "react";
import { CalendarHeader } from "@/components/CalendarHeader";
import { AppointmentModal } from "@/components/AppointmentModal";
import { DayView } from "@/components/DayView";
import { WeekView } from "@/components/WeekView";
import { MonthView } from "@/components/MonthView";
import { fr } from "date-fns/locale";
import { useBusinessStore } from "@/hooks/useBusinessStore";
import { useAppointments } from "@/hooks/useAppointments";
import { useTranslations } from "@/hooks/useTranslations";

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("day");
  const { services } = useBusinessStore();
  const { t } = useTranslations();
  const { 
    appointments, 
    handleAppointmentCreate, 
    handleAppointmentEdit, 
    handleAppointmentDelete 
  } = useAppointments();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow animate-fade-in">
          <div className="flex justify-between items-center p-4 border-b">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-salon-pink to-salon-peach bg-clip-text text-transparent">
              {t('appointments.title')}
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
            <WeekView date={currentDate} appointments={appointments} />
          )}
          {view === "month" && (
            <MonthView date={currentDate} appointments={appointments} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;