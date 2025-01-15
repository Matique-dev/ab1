interface Appointment {
  id: string;
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
  date: Date;
}

export const getTimeInMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const doesAppointmentsOverlap = (apt1: Appointment, apt2: Appointment) => {
  const start1 = getTimeInMinutes(apt1.time);
  const end1 = start1 + parseInt(apt1.duration);
  const start2 = getTimeInMinutes(apt2.time);
  const end2 = start2 + parseInt(apt2.duration);

  return start1 < end2 && end1 > start2;
};

export const getOverlappingGroup = (appointment: Appointment, allAppointments: Appointment[]) => {
  const group = new Set<Appointment>([appointment]);
  
  let prevSize = 0;
  while (prevSize !== group.size) {
    prevSize = group.size;
    allAppointments.forEach(apt => {
      if (!group.has(apt)) {
        for (const groupApt of group) {
          if (doesAppointmentsOverlap(apt, groupApt)) {
            group.add(apt);
            break;
          }
        }
      }
    });
  }
  
  return Array.from(group);
};

export const getStylistColor = (stylist: string) => {
  const colors: { [key: string]: string } = {
    john: "bg-blue-100 border-blue-300",
    josh: "bg-green-100 border-green-300",
    rebecca: "bg-purple-100 border-purple-300",
  };
  return colors[stylist.toLowerCase()] || "bg-gray-100 border-gray-300";
};