import { useQuery } from "@tanstack/react-query";
import { Employee, WeekSchedule } from "@/types/schedule";
import { ServiceType, defaultServices } from "@/types/service";
import { DEFAULT_BUSINESS_HOURS } from "@/constants/business";

// In-memory store since we don't have a backend yet
let employeesStore: Employee[] = [];
let servicesStore: ServiceType[] = defaultServices;
let businessHoursStore: WeekSchedule = DEFAULT_BUSINESS_HOURS;

export const useBusinessStore = () => {
  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeesStore,
    initialData: [],
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
    employeesStore = newEmployees;
  };

  const updateServices = (newServices: ServiceType[]) => {
    servicesStore = newServices;
  };

  const updateBusinessHours = (newHours: WeekSchedule) => {
    businessHoursStore = newHours;
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