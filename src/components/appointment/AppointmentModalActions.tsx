import { Button } from "@/components/ui/button";

interface AppointmentModalActionsProps {
  isEditing: boolean;
  onDelete?: () => void;
}

export const AppointmentModalActions = ({
  isEditing,
  onDelete,
}: AppointmentModalActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button type="submit" className="flex-1">
        {isEditing ? "Update Appointment" : "Create Appointment"}
      </Button>
      {isEditing && onDelete && (
        <Button 
          type="button" 
          variant="destructive"
          onClick={onDelete}
        >
          Delete
        </Button>
      )}
    </div>
  );
};