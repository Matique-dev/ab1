import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AppointmentFormFields } from "./AppointmentFormFields";
import { useAppointmentForm } from "@/hooks/useAppointmentForm";

interface Appointment {
  id?: string;
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
  date: Date;
}

interface AppointmentModalProps {
  onAppointmentCreate: (appointment: Omit<Appointment, "id">) => void;
  onAppointmentEdit?: (appointment: Appointment) => void;
  onAppointmentDelete?: (appointmentId: string) => void;
  currentDate: Date;
  appointment?: Appointment;
  trigger?: React.ReactNode;
}

export const AppointmentModal = ({ 
  onAppointmentCreate, 
  onAppointmentEdit,
  onAppointmentDelete,
  currentDate, 
  appointment,
  trigger 
}: AppointmentModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { formData, setFormData } = useAppointmentForm(currentDate, appointment, isOpen);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
    
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (appointment?.id && onAppointmentDelete) {
      onAppointmentDelete(appointment.id);
      toast({
        title: "Appointment deleted",
        description: "The appointment has been successfully removed.",
      });
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-to-r from-salon-pink to-salon-peach hover:opacity-90">
            New Appointment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {appointment ? "Edit Appointment" : "Schedule Appointment"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <AppointmentFormFields
            formData={formData}
            setFormData={setFormData}
          />
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {appointment ? "Update Appointment" : "Create Appointment"}
            </Button>
            {appointment && onAppointmentDelete && (
              <Button 
                type="button" 
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};