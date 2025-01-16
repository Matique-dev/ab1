import { isSameDay } from "date-fns";
import { AppointmentCard } from "./AppointmentCard";
import { AppointmentModal } from "./AppointmentModal";
import { calculateAppointmentColumns, calculateAppointmentPosition } from "./AppointmentColumns";
import { getStylistColor } from "@/utils/appointmentCalculations";
import { Employee } from "@/types/schedule";
import { ServiceType } from "@/types/service";

interface Appointment {
  id: string;
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
  date: Date;
  serviceId?: string;
}

interface AppointmentGridProps {
  date: Date;
  appointments: Appointment[];
  hours: number[];
  startHour: number;
  hourHeight: number;
  pageMarginPercent: number;
  onAppointmentEdit: (appointment: Appointment) => void;
  onAppointmentDelete: (appointmentId: string) => void;
  employees: Employee[];
  getServiceDetails: (serviceId?: string) => ServiceType | null;
}

export const AppointmentGrid = ({
  date,
  appointments,
  hours,
  startHour,
  hourHeight,
  pageMarginPercent,
  onAppointmentEdit,
  onAppointmentDelete,
  employees,
  getServiceDetails,
}: AppointmentGridProps) => {
  const dayAppointments = appointments.filter(apt => isSameDay(apt.date, date));
  const columnInfo = calculateAppointmentColumns(dayAppointments);

  // Get employee color from employees array
  const getEmployeeColor = (stylistId: string) => {
    const employee = employees.find(emp => emp.id === stylistId);
    return employee?.color || getStylistColor(stylistId);
  };

  return (
    <div className="relative ml-16 mr-4 h-full z-10">
      {dayAppointments.map((apt) => {
        const position = calculateAppointmentPosition(
          apt,
          columnInfo,
          startHour,
          hourHeight,
          pageMarginPercent
        );

        const serviceDetails = getServiceDetails(apt.serviceId);

        return (
          <AppointmentModal
            key={apt.id}
            currentDate={date}
            appointment={apt}
            onAppointmentEdit={onAppointmentEdit}
            onAppointmentDelete={onAppointmentDelete}
            onAppointmentCreate={() => {}}
            trigger={
              <AppointmentCard
                appointment={apt}
                position={position}
                colorClass={getEmployeeColor(apt.stylist)}
                serviceIcon={serviceDetails?.icon}
                onClick={() => {}}
              />
            }
          />
        );
      })}
    </div>
  );
};