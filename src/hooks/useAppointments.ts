import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNotificationStore } from "@/stores/notificationStore";
import { useAppointmentValidation } from "./useAppointmentValidation";

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
  const { addNotification } = useNotificationStore();
  const { validateAppointment } = useAppointmentValidation();

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