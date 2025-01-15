import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Appointment {
  id?: string;
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
  date: Date;
}

interface UseAppointmentModalProps {
  onAppointmentCreate: (appointment: Omit<Appointment, "id">) => void;
  onAppointmentEdit?: (appointment: Appointment) => void;
  onAppointmentDelete?: (appointmentId: string) => void;
  onOpenChange: (open: boolean) => void;
}

export const useAppointmentModal = ({
  onAppointmentCreate,
  onAppointmentEdit,
  onAppointmentDelete,
  onOpenChange,
}: UseAppointmentModalProps) => {
  const { toast } = useToast();

  const handleSubmit = (formData: any, appointment?: Appointment) => {
    // Create a new date object for the appointment
    const [hours, minutes] = formData.time.split(":").map(Number);
    const appointmentDate = new Date(formData.selectedDate);
    appointmentDate.setHours(hours, minutes, 0, 0);

    if (appointment?.id && onAppointmentEdit) {
      // Editing existing appointment
      onAppointmentEdit({
        ...formData,
        id: appointment.id,
        date: appointmentDate,
      });
      toast({
        title: "Appointment updated",
        description: "The appointment has been successfully updated.",
      });
    } else {
      // Creating new appointment
      onAppointmentCreate({
        ...formData,
        date: appointmentDate,
      });
      toast({
        title: "Appointment created",
        description: "The appointment has been successfully scheduled.",
      });
    }
    
    onOpenChange(false);
  };

  const handleDelete = (appointmentId: string) => {
    if (onAppointmentDelete) {
      onAppointmentDelete(appointmentId);
      toast({
        title: "Appointment deleted",
        description: "The appointment has been successfully removed.",
      });
      onOpenChange(false);
    }
  };

  return {
    handleSubmit,
    handleDelete,
  };
};