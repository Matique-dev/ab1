import { useToast } from "@/hooks/use-toast";
import { useBusinessStore } from "@/hooks/useBusinessStore";
import { 
  isWithinBusinessHours, 
  isWithinExceptionHours, 
  isEmployeeAvailable 
} from "@/utils/appointmentValidation";

interface Appointment {
  id?: string;
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
  date: Date;
  serviceId?: string;
}

export const useAppointmentValidation = () => {
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
            title: "Stylist unavailable",
            description: availabilityCheck.message,
            variant: "destructive",
          });
          return false;
        }
      }
    }

    return true;
  };

  return { validateAppointment };
};