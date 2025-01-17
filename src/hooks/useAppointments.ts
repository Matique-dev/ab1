import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useBusinessStore } from "@/hooks/useBusinessStore";
import { 
  isWithinBusinessHours, 
  isWithinExceptionHours, 
  isEmployeeAvailable 
} from "@/utils/appointmentValidation";

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

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { toast } = useToast();
  const { businessHours, exceptionDates, employees } = useBusinessStore();

  const validateAppointment = (appointment: Omit<Appointment, "id">) => {
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
          toast({
            title: "Stylist Unavailable",
            description: availabilityCheck.message || "Employee is not available at this time",
            variant: "destructive",
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

  return {
    appointments,
    handleAppointmentCreate,
    handleAppointmentEdit,
    handleAppointmentDelete,
  };
};