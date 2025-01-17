import { isSameDay } from "date-fns";
import { AppointmentCard } from "./AppointmentCard";
import { AppointmentModal } from "./AppointmentModal";
import { calculateAppointmentColumns, calculateAppointmentPosition } from "./AppointmentColumns";
import { getStylistColor } from "@/utils/appointmentCalculations";
import { useBusinessStore } from "@/hooks/useBusinessStore";

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
  dates: Date[];
  appointments: Appointment[];
  hours: number[];
  startHour: number;
  hourHeight: number;
  pageMarginPercent: number;
  mode?: 'day' | 'week';
  onAppointmentEdit: (appointment: Appointment) => void;
  onAppointmentDelete: (appointmentId: string) => void;
}

export const AppointmentGrid = ({
  dates,
  appointments,
  hours,
  startHour,
  hourHeight,
  pageMarginPercent,
  mode = 'day',
  onAppointmentEdit,
  onAppointmentDelete,
}: AppointmentGridProps) => {
  const { employees = [], services = [] } = useBusinessStore();

  const getEmployeeColor = (stylistId: string) => {
    const employee = employees.find(emp => emp.id === stylistId);
    return employee?.color || getStylistColor(stylistId);
  };

  const getServiceDetails = (serviceId?: string) => {
    if (!serviceId) return null;
    return services.find(service => service.id === serviceId);
  };

  return (
    <div className="relative ml-16 h-full z-10 grid grid-cols-7">
      {dates.map((date) => {
        const dayAppointments = appointments.filter(apt => isSameDay(apt.date, date));
        const columnInfo = calculateAppointmentColumns(dayAppointments);

        return (
          <div 
            key={date.toString()} 
            className="relative"
          >
            {dayAppointments.map((apt) => {
              const position = calculateAppointmentPosition(
                apt,
                columnInfo,
                startHour,
                hourHeight,
                pageMarginPercent,
                mode
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
          </div>
        );
      })}
    </div>
  );
};