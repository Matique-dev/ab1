export const DEFAULT_TRANSLATIONS = {
  appointments: {
    title: "Salon Calendar",
    new: "New Appointment",
    edit: "Edit Appointment",
    schedule: "Schedule Appointment",
    create: "Create Appointment",
    update: "Update Appointment",
    delete: "Delete",
    clientName: "Client name",
    walkIn: "Walk-in",
    duration: "Duration",
    time: "Time",
    date: "Date",
    stylist: "Stylist",
    service: "Service",
    anyone: "Anyone available",
    notifications: {
      created: "Appointment created",
      updated: "Appointment updated",
      deleted: "Appointment deleted",
      success: {
        created: "The appointment has been successfully scheduled.",
        updated: "The appointment has been successfully updated.",
        deleted: "The appointment has been successfully removed."
      }
    },
    validation: {
      businessHours: "Invalid Time",
      businessHoursMessage: "Appointment must be within business hours",
      exceptionDate: "Invalid Date",
      exceptionDateMessage: "Business is closed on this day due to special hours",
      stylistUnavailable: "Stylist Unavailable",
      stylistUnavailableMessage: "Employee is not available at this time",
      conflict: "Scheduling Conflict",
      conflictMessage: "This time slot conflicts with another appointment"
    }
  },
  services: {
    haircuts: "Haircuts",
    styling: "Styling",
    color: "Color Services",
    treatments: "Treatments"
  },
  calendar: {
    views: {
      day: "Day",
      week: "Week",
      month: "Month"
    }
  }
};

export type Translations = typeof DEFAULT_TRANSLATIONS;

// Helper function to get nested translations
export const t = (key: string, translations: Translations = DEFAULT_TRANSLATIONS): string => {
  return key.split('.').reduce((obj, i) => obj[i], translations as any) || key;
};