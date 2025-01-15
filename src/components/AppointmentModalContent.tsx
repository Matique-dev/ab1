import { Button } from "@/components/ui/button";
import { AppointmentFormFields } from "./AppointmentFormFields";

interface FormData {
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
  selectedDate: string;
}

interface Appointment {
  id?: string;
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
  date: Date;
}

interface AppointmentModalContentProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
  appointment?: Appointment;
}

export const AppointmentModalContent = ({
  formData,
  setFormData,
  onSubmit,
  onDelete,
  appointment,
}: AppointmentModalContentProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <AppointmentFormFields
        formData={formData}
        setFormData={setFormData}
      />
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          {appointment ? "Update Appointment" : "Create Appointment"}
        </Button>
        {appointment && onDelete && (
          <Button 
            type="button" 
            variant="destructive"
            onClick={onDelete}
          >
            Delete
          </Button>
        )}
      </div>
    </form>
  );
};