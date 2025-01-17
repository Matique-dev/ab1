import { isSameDay } from "date-fns";
import { AppointmentCard } from "../AppointmentCard";
import { AppointmentModal } from "../AppointmentModal";
import { calculateAppointmentPosition } from "../AppointmentColumns";
import { getStylistColor } from "@/utils/appointmentCalculations";
import { useBusinessStore } from "@/hooks/useBusinessStore";
import { Appointment } from "@/types/appointment";

interface AppointmentGridColumnProps {
  date: Date;
  appointments: Appointment[];
  columnInfo: any;
  startHour: number;
  hourHeight: number;
  pageMarginPercent: number;
  onAppointmentEdit: (appointment: Appointment) => void;
  onAppointmentDelete: (appointmentId: string) => void;
}

export const AppointmentGridColumn = ({
  date,
  appointments,
  columnInfo,
  startHour,
  hourHeight,
  pageMarginPercent,
  onAppointmentEdit,
  onAppointmentDelete,
}: AppointmentGridColumnProps) => {
  const { employees = [], services = [] } = useBusinessStore();

  const getEmployeeColor = (stylistId: string) => {
    const employee = employees.find(emp => emp.id === stylistId);
    return employee?.color || getStylistColor(stylistId);
  };

  const getServiceDetails = (serviceId?: string) => {
    if (!serviceId) return null;
    return services.find(service => service.id === serviceId);
  };

  const dayAppointments = appointments.filter(apt => isSameDay(apt.date, date));

  return (
    <>
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
            services={services}
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
    </>
  );
};