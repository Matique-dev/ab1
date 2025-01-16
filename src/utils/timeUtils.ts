/**
 * Generates an array of time slots with specified interval
 * @param intervalMinutes - Interval between time slots in minutes
 * @returns Array of time slots in HH:mm format
 */
export const generateTimeSlots = (intervalMinutes: number = 30) => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push({
        value: timeString,
        label: timeString,
      });
    }
  }
  return slots;
};

/**
 * Validates if a time is within business hours
 * @param time - Time to validate in HH:mm format
 * @param openTime - Business opening time in HH:mm format
 * @param closeTime - Business closing time in HH:mm format
 * @returns boolean indicating if time is within business hours
 */
export const isWithinBusinessHours = (time: string, openTime: string, closeTime: string): boolean => {
  const [timeHour, timeMinute] = time.split(':').map(Number);
  const [openHour, openMinute] = openTime.split(':').map(Number);
  const [closeHour, closeMinute] = closeTime.split(':').map(Number);

  const timeValue = timeHour * 60 + timeMinute;
  const openValue = openHour * 60 + openMinute;
  const closeValue = closeHour * 60 + closeMinute;

  return timeValue >= openValue && timeValue <= closeValue;
};