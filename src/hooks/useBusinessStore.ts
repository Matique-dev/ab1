import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Employee, WeekSchedule } from "@/types/schedule";
import { ServiceType, defaultServices } from "@/types/service";
import { DEFAULT_BUSINESS_HOURS } from "@/constants/business";

// Default manager employee with schedule based on business hours
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

// Local storage keys
const STORAGE_KEYS = {
  EMPLOYEES: 'salon-employees',
  SERVICES: 'salon-services',
  BUSINESS_HOURS: 'salon-business-hours',
  EXCEPTION_DATES: 'salon-exception-dates'
};

// Helper functions for localStorage
const getStoredData = <T>(key: string, defaultValue: T): T => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage for key ${key}:`, error);
    return defaultValue;
  }
};

const setStoredData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error writing to localStorage for key ${key}:`, error);
  }
};

// Initialize stores with localStorage data or defaults
const initialEmployees = getStoredData(STORAGE_KEYS.EMPLOYEES, [defaultManager]);
const initialServices = getStoredData(STORAGE_KEYS.SERVICES, defaultServices);
const initialBusinessHours = getStoredData(STORAGE_KEYS.BUSINESS_HOURS, DEFAULT_BUSINESS_HOURS);
const initialExceptionDates = getStoredData(STORAGE_KEYS.EXCEPTION_DATES, []);

export const useBusinessStore = () => {
  const queryClient = useQueryClient();

  const { data: employees = initialEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: () => getStoredData(STORAGE_KEYS.EMPLOYEES, initialEmployees),
    staleTime: Infinity,
  });

  const { data: services = initialServices } = useQuery({
    queryKey: ['services'],
    queryFn: () => getStoredData(STORAGE_KEYS.SERVICES, initialServices),
    staleTime: Infinity,
  });

  const { data: businessHours = initialBusinessHours } = useQuery({
    queryKey: ['businessHours'],
    queryFn: () => getStoredData(STORAGE_KEYS.BUSINESS_HOURS, initialBusinessHours),
    staleTime: Infinity,
  });

  const { data: exceptionDates = initialExceptionDates } = useQuery({
    queryKey: ['exceptionDates'],
    queryFn: () => getStoredData(STORAGE_KEYS.EXCEPTION_DATES, initialExceptionDates),
    staleTime: Infinity,
  });

  const updateEmployees = (newEmployees: Employee[]) => {
    setStoredData(STORAGE_KEYS.EMPLOYEES, newEmployees);
    queryClient.setQueryData(['employees'], newEmployees);
  };

  const updateServices = (newServices: ServiceType[]) => {
    setStoredData(STORAGE_KEYS.SERVICES, newServices);
    queryClient.setQueryData(['services'], newServices);
  };

  const updateBusinessHours = (newHours: WeekSchedule) => {
    setStoredData(STORAGE_KEYS.BUSINESS_HOURS, newHours);
    queryClient.setQueryData(['businessHours'], newHours);
  };

  const updateExceptionDates = (newDates: Date[]) => {
    setStoredData(STORAGE_KEYS.EXCEPTION_DATES, newDates);
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