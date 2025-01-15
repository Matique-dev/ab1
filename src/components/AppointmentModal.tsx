import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

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
  currentDate: Date;
  appointment?: Appointment;
  trigger?: React.ReactNode;
}

export const AppointmentModal = ({ 
  onAppointmentCreate, 
  onAppointmentEdit,
  currentDate, 
  appointment,
  trigger 
}: AppointmentModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    stylist: "",
    time: "",
    duration: "60",
    isWalkIn: false,
    selectedDate: format(currentDate, 'yyyy-MM-dd')
  });

  // Update form data when editing an existing appointment
  useEffect(() => {
    if (appointment) {
      setFormData({
        title: appointment.title,
        stylist: appointment.stylist,
        time: format(appointment.date, 'HH:mm'),
        duration: appointment.duration,
        isWalkIn: appointment.isWalkIn,
        selectedDate: format(appointment.date, 'yyyy-MM-dd')
      });
    }
  }, [appointment]);

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
          <div className="space-y-2">
            <Label htmlFor="title">Client Name</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stylist">Stylist</Label>
            <Select
              value={formData.stylist}
              onValueChange={(value) =>
                setFormData({ ...formData, stylist: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select stylist" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john">John</SelectItem>
                <SelectItem value="josh">Josh</SelectItem>
                <SelectItem value="rebecca">Rebecca</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.selectedDate}
                onChange={(e) =>
                  setFormData({ ...formData, selectedDate: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Select
              value={formData.duration}
              onValueChange={(value) =>
                setFormData({ ...formData, duration: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
                <SelectItem value="120">120 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="walkIn"
              checked={formData.isWalkIn}
              onChange={(e) =>
                setFormData({ ...formData, isWalkIn: e.target.checked })
              }
              className="rounded border-gray-300"
            />
            <Label htmlFor="walkIn">Walk-in appointment</Label>
          </div>
          <Button type="submit" className="w-full">
            {appointment ? "Update Appointment" : "Create Appointment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};