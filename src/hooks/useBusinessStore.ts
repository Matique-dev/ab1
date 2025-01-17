import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Employee, WeekSchedule } from "@/types/schedule";
import { ServiceType } from "@/types/service";
import { storage } from "@/utils/localStorage";
import { STORAGE_KEYS } from "@/constants/storage";
import { initialStoreValues } from "@/store/businessStoreDefaults";

export const useBusinessStore = () => {
  const queryClient = useQueryClient();

  const { data: employees = initialStoreValues.employees } = useQuery({
    queryKey: ['employees'],
    queryFn: () => storage.get(STORAGE_KEYS.EMPLOYEES, initialStoreValues.employees),
    staleTime: Infinity,
  });

  const { data: services = initialStoreValues.services } = useQuery({
    queryKey: ['services'],
    queryFn: () => storage.get(STORAGE_KEYS.SERVICES, initialStoreValues.services),
    staleTime: Infinity,
  });

  const { data: businessHours = initialStoreValues.businessHours } = useQuery({
    queryKey: ['businessHours'],
    queryFn: () => storage.get(STORAGE_KEYS.BUSINESS_HOURS, initialStoreValues.businessHours),
    staleTime: Infinity,
  });

  const { data: exceptionDates = initialStoreValues.exceptionDates } = useQuery({
    queryKey: ['exceptionDates'],
    queryFn: () => storage.get(STORAGE_KEYS.EXCEPTION_DATES, initialStoreValues.exceptionDates),
    staleTime: Infinity,
  });

  const updateEmployees = (newEmployees: Employee[]) => {
    storage.set(STORAGE_KEYS.EMPLOYEES, newEmployees);
    queryClient.setQueryData(['employees'], newEmployees);
  };

  const updateServices = (newServices: ServiceType[]) => {
    storage.set(STORAGE_KEYS.SERVICES, newServices);
    queryClient.setQueryData(['services'], newServices);
  };

  const updateBusinessHours = (newHours: WeekSchedule) => {
    storage.set(STORAGE_KEYS.BUSINESS_HOURS, newHours);
    queryClient.setQueryData(['businessHours'], newHours);
  };

  const updateExceptionDates = (newDates: Date[]) => {
    storage.set(STORAGE_KEYS.EXCEPTION_DATES, newDates);
    queryClient.setQueryData(['exceptionDates'], newDates);
  };

  return {
    employees,
    services,
    businessHours,
    exceptionDates,
    updateEmployees,
    updateServices,
    updateBusinessHours,
    updateExceptionDates,
  };
};