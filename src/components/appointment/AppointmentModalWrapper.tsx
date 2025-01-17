import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface AppointmentModalWrapperProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  trigger?: React.ReactNode;
}

export const AppointmentModalWrapper = ({
  isOpen,
  onOpenChange,
  title,
  children,
  trigger,
}: AppointmentModalWrapperProps) => {
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
          <DialogTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};