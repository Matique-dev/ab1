import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAppointmentForm } from "@/hooks/useAppointmentForm";
import { useAppointmentModal } from "@/hooks/useAppointmentModal";
import { AppointmentModalContent } from "./AppointmentModalContent";
import { format } from "date-fns";
import { isWithinBusinessHours } from "@/utils/timeUtils";
import { useBusinessStore } from "@/hooks/useBusinessStore";
import { useToast } from "@/hooks/use-toast";
import { useNotificationStore } from "@/stores/notificationStore";
import {
  isWithinBusinessHours as validateBusinessHours,
  isWithinExceptionHours,
  isEmployeeAvailable,
  hasSchedulingConflicts
} from "@/utils/appointmentValidation";

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
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultTime?: string;
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
}: AppointmentModalProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen ?? internalIsOpen;
  const onOpenChange = controlledOnOpenChange ?? setInternalIsOpen;
  const { toast } = useToast();
  const { addNotification } = useNotificationStore();
  
  const { formData, setFormData } = useAppointmentForm(currentDate, appointment, isOpen);
  const { handleSubmit, handleDelete } = useAppointmentModal({
    onAppointmentCreate,
    onAppointmentEdit,
    onAppointmentDelete,
    onOpenChange,
  });

  const { 
    employees = [], 
    services = [], 
    businessHours,
    exceptionDates = [] 
  } = useBusinessStore();

  useEffect(() => {
    if (isOpen && defaultTime) {
      setFormData(prev => ({ ...prev, time: defaultTime }));
    }
  }, [isOpen, defaultTime, setFormData]);

  const validateAppointment = () => {
    const appointmentDate = new Date(formData.selectedDate);
    
    // Check business hours
    const businessHoursCheck = validateBusinessHours(
      appointmentDate,
      formData.time,
      formData.duration,
      businessHours
    );
    if (!businessHoursCheck.isValid) {
      toast({
        title: "Invalid Time",
        description: businessHoursCheck.message,
        variant: "destructive",
      });
      return false;
    }

    // Check exception dates
    const exceptionCheck = isWithinExceptionHours(
      appointmentDate,
      formData.time,
      formData.duration,
      exceptionDates
    );
    if (!exceptionCheck.isValid) {
      toast({
        title: "Invalid Date",
        description: exceptionCheck.message,
        variant: "destructive",
      });
      return false;
    }

    // Check employee availability if specific stylist selected
    if (formData.stylist !== "anyone") {
      const employee = employees.find(emp => emp.id === formData.stylist);
      if (employee) {
        const availabilityCheck = isEmployeeAvailable(
          appointmentDate,
          formData.time,
          formData.duration,
          employee
        );
        if (!availabilityCheck.isValid) {
          toast({
            title: "Stylist Unavailable",
            description: availabilityCheck.message,
            variant: "destructive",
          });
          return false;
        }
      }
    }

    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAppointment()) {
      return;
    }

    // Create appointment and add notification
    handleSubmit(formData, appointment);
    addNotification({
      type: "business_hours",
      message: `Appointment ${appointment ? 'updated' : 'created'} for ${formData.title}`,
      appointmentId: appointment?.id || "new",
    });
  };

  const getAvailableEmployees = () => {
    const dayOfWeek = format(currentDate, 'EEEE').toLowerCase();
    const currentTime = formData.time;

    // Check for exception dates
    const exceptionDate = exceptionDates.find(ex => 
      format(ex.date, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
    );

    if (exceptionDate?.isAllDayOff) {
      return [];
    }

    return employees.filter(employee => {
      const schedule = employee.schedule[dayOfWeek];
      if (!schedule.isAvailable) return false;

      // Check if within business hours
      if (businessHours && !isWithinBusinessHours(
        currentTime,
        exceptionDate?.openTime || businessHours[dayOfWeek].openTime,
        exceptionDate?.closeTime || businessHours[dayOfWeek].closeTime
      )) {
        return false;
      }

      // Check employee availability
      return isWithinBusinessHours(currentTime, schedule.workStart, schedule.workEnd);
    });
  };

  const availableEmployees = getAvailableEmployees();

  const onDelete = () => {
    if (appointment?.id) {
      handleDelete(appointment.id);
      addNotification({
        type: "business_hours",
        message: `Appointment deleted for ${appointment.title}`,
        appointmentId: appointment.id,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
        <AppointmentModalContent
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          onDelete={appointment ? onDelete : undefined}
          appointment={appointment}
          availableEmployees={availableEmployees}
          services={services}
        />
      </DialogContent>
    </Dialog>
  );
};
