import { useState } from "react";
import { CalendarHeader } from "@/components/CalendarHeader";
import { AppointmentModal } from "@/components/AppointmentModal";
import { DayView } from "@/components/DayView";
import { WeekView } from "@/components/WeekView";
import { MonthView } from "@/components/MonthView";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useNotificationStore } from "@/stores/notificationStore";
import { useBusinessStore } from "@/hooks/useBusinessStore";
import { isWithinBusinessHours, isWithinExceptionHours, isEmployeeAvailable } from "@/utils/appointmentValidation";

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

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("day");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { toast } = useToast();
  const { addNotification } = useNotificationStore();
  const { businessHours, exceptionDates, employees, services } = useBusinessStore();

  const validateAppointment = (appointment: Omit<Appointment, "id">) => {
    // Check business hours
    const businessHoursCheck = isWithinBusinessHours(
      appointment.date,
      appointment.time,
      appointment.duration,
      businessHours
    );
    if (!businessHoursCheck.isValid) {
      toast({
        title: "Invalid appointment time",
        description: businessHoursCheck.message,
        variant: "destructive",
      });
      return false;
    }

    // Check exception dates
    const exceptionCheck = isWithinExceptionHours(
      appointment.date,
      appointment.time,
      appointment.duration,
      exceptionDates
    );
    if (!exceptionCheck.isValid) {
      toast({
        title: "Invalid appointment date",
        description: exceptionCheck.message,
        variant: "destructive",
      });
      return false;
    }

    // Check employee availability if specific stylist selected
    if (appointment.stylist !== "anyone") {
      const employee = employees.find(emp => emp.id === appointment.stylist);
      if (employee) {
        const availabilityCheck = isEmployeeAvailable(
          appointment.date,
          appointment.time,
          appointment.duration,
          employee
        );
        if (!availabilityCheck.isValid) {
          addNotification({
            type: "employee_availability",
            message: availabilityCheck.message || "Employee is not available at this time",
            appointmentId: "new",
          });
          return false;
        }
      }
    }

    return true;
  };

  const handleAppointmentCreate = (appointment: Omit<Appointment, "id">) => {
    if (!validateAppointment(appointment)) {
      return;
    }

    const newAppointment = {
      ...appointment,
      id: Math.random().toString(36).substr(2, 9),
    };
    setAppointments(prev => [...prev, newAppointment]);
    toast({
      title: "Appointment created",
      description: "The appointment has been successfully scheduled.",
    });
  };

  const handleAppointmentEdit = (updatedAppointment: Appointment) => {
    if (!validateAppointment(updatedAppointment)) {
      return;
    }

    setAppointments(prevAppointments => {
      const existingAppointment = prevAppointments.find(
        apt => apt.id === updatedAppointment.id
      );

      if (existingAppointment) {
        return prevAppointments.map(apt =>
          apt.id === updatedAppointment.id ? updatedAppointment : apt
        );
      }
      return [...prevAppointments, updatedAppointment];
    });

    toast({
      title: "Appointment updated",
      description: "The appointment has been successfully updated.",
    });
  };

  const handleAppointmentDelete = (appointmentId: string) => {
    setAppointments(prevAppointments => 
      prevAppointments.filter(apt => apt.id !== appointmentId)
    );
    toast({
      title: "Appointment deleted",
      description: "The appointment has been successfully removed.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow animate-fade-in">
          <div className="flex justify-between items-center p-4 border-b">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-salon-pink to-salon-peach bg-clip-text text-transparent">
              Salon Calendar
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