import { useToast } from "@/hooks/use-toast";
import { useBusinessStore } from "@/hooks/useBusinessStore";
import { format } from "date-fns";
import {
  isWithinBusinessHours,
  isWithinExceptionHours,
  isEmployeeAvailable,
} from "@/utils/appointmentValidation";

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const useAppointmentValidation = () => {
  const { toast } = useToast();
  const { employees, businessHours, exceptionDates } = useBusinessStore();

  const validateAppointment = (formData: {
    selectedDate: string;
    time: string;
    duration: string;
    stylist: string;
  }): boolean => {
    const appointmentDate = new Date(formData.selectedDate);
    
    // Check business hours
    const businessHoursCheck = isWithinBusinessHours(
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

  return { validateAppointment };
};