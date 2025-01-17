import { useState, useEffect } from "react";
import { useAppointmentForm } from "@/hooks/useAppointmentForm";
import { useAppointmentModal } from "@/hooks/useAppointmentModal";
import { AppointmentModalContent } from "./AppointmentModalContent";
import { useAppointmentValidation } from "@/hooks/useAppointmentValidation";
import { AvailableEmployeesProvider } from "./appointment/AvailableEmployeesProvider";
import { ServiceType } from "@/types/service";
import { AppointmentModalWrapper } from "./appointment/AppointmentModalWrapper";
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

interface AppointmentModalProps {
  onAppointmentCreate?: (appointment: Omit<Appointment, "id">) => void;
  onAppointmentEdit?: (appointment: Appointment) => void;
  onAppointmentDelete?: (appointmentId: string) => void;
  currentDate: Date;
  appointment?: Appointment;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultTime?: string;
  services: ServiceType[];
}

export const AppointmentModal = ({ 
  onAppointmentCreate, 
  onAppointmentEdit,
  onAppointmentDelete,
  currentDate, 
  appointment,
  trigger,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
  defaultTime,
  services,
}: AppointmentModalProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen ?? internalIsOpen;
  const onOpenChange = controlledOnOpenChange ?? setInternalIsOpen;
  const { toast } = useToast();
  
  const { formData, setFormData } = useAppointmentForm(currentDate, appointment, isOpen);
  const { handleSubmit, handleDelete } = useAppointmentModal({
    onAppointmentCreate,
    onAppointmentEdit,
    onAppointmentDelete,
    onOpenChange,
  });
  const { validateAppointment } = useAppointmentValidation();

  useEffect(() => {
    if (isOpen && defaultTime) {
      setFormData(prev => ({ ...prev, time: defaultTime }));
    }
  }, [isOpen, defaultTime, setFormData]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAppointment(formData)) {
      return;
    }

    handleSubmit(formData, appointment);
    toast({
      title: appointment ? "Appointment Updated" : "Appointment Created",
      description: `Appointment ${appointment ? 'updated' : 'created'} for ${formData.title}`,
    });
  };

  const onDelete = () => {
    if (appointment?.id) {
      handleDelete(appointment.id);
      toast({
        title: "Appointment Deleted",
        description: `Appointment deleted for ${appointment.title}`,
      });
    }
  };

  return (
    <AppointmentModalWrapper
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={appointment ? "Edit Appointment" : "Schedule Appointment"}
      trigger={trigger}
    >
      <AvailableEmployeesProvider
        currentDate={currentDate}
        currentTime={formData.time}
      >
        {(availableEmployees) => (
          <AppointmentModalContent
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            onDelete={appointment ? onDelete : undefined}
            appointment={appointment}
            availableEmployees={availableEmployees}
            services={services}
          />
        )}
      </AvailableEmployeesProvider>
    </AppointmentModalWrapper>
  );
};