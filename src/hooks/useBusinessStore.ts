import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Employee, WeekSchedule } from "@/types/schedule";
import { ServiceType, defaultServices } from "@/types/service";
import { DEFAULT_BUSINESS_HOURS } from "@/constants/business";

// Default manager employee
const defaultManager: Employee = {
  id: "manager",
  name: "Manager",
  color: "#6557FF",
  schedule: Object.keys(DEFAULT_BUSINESS_HOURS).reduce((acc, day) => ({
    ...acc,
    [day]: {
      isAvailable: DEFAULT_BUSINESS_HOURS[day].isOpen,
      workStart: DEFAULT_BUSINESS_HOURS[day].openTime,
      workEnd: DEFAULT_BUSINESS_HOURS[day].closeTime,
      lunchStart: "12:00",
      lunchEnd: "13:00"
    }
  }), {})
};

export const useBusinessStore = () => {
  const queryClient = useQueryClient();

  const { data: employees = [defaultManager] } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeesStore,
    initialData: [defaultManager],
  });

  const { data: services = defaultServices } = useQuery({
    queryKey: ['services'],
    queryFn: () => servicesStore,
    initialData: defaultServices,
  });

  const { data: businessHours = DEFAULT_BUSINESS_HOURS } = useQuery({
    queryKey: ['businessHours'],
    queryFn: () => businessHoursStore,
    initialData: DEFAULT_BUSINESS_HOURS,
  });

  const updateEmployees = (newEmployees: Employee[]) => {
    // Ensure manager is always present
    const hasManager = newEmployees.some(emp => emp.id === "manager");
    const updatedEmployees = hasManager ? newEmployees : [defaultManager, ...newEmployees];
    employeesStore = updatedEmployees;
    queryClient.setQueryData(['employees'], updatedEmployees);
  };

  const updateServices = (newServices: ServiceType[]) => {
    servicesStore = newServices;
    queryClient.setQueryData(['services'], newServices);
  };

  const updateBusinessHours = (newHours: WeekSchedule) => {
    businessHoursStore = newHours;
    queryClient.setQueryData(['businessHours'], newHours);
  };

  return {
    employees,
    services,
    businessHours,
    updateEmployees,
    updateServices,
    updateBusinessHours,
  };
};

// In-memory store since we don't have a backend yet
let employeesStore: Employee[] = [defaultManager];
let servicesStore: ServiceType[] = defaultServices;
let businessHoursStore: WeekSchedule = DEFAULT_BUSINESS_HOURS;