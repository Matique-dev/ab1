interface AppointmentCardProps {
  appointment: {
    id: string;
    title: string;
    stylist: string;
    duration: string;
    isWalkIn: boolean;
  };
  position: {
    top: number;
    height: number;
    width: string;
    left: string;
  };
  colorClass: string;
  onClick: () => void;
}

export const AppointmentCard = ({ appointment, position, colorClass, onClick }: AppointmentCardProps) => {
  return (
    <div
      className={`absolute p-2 rounded border cursor-pointer hover:opacity-80 transition-opacity ${colorClass} ${
        appointment.isWalkIn ? "border-dashed" : ""
      }`}
      style={{
        top: `${position.top}px`,
        height: `${position.height}px`,
        width: position.width,
        left: position.left,
      }}
      onClick={onClick}
    >
      <div className="font-medium truncate">{appointment.title}</div>
      <div className="text-sm text-gray-600 truncate">
        {appointment.stylist.charAt(0).toUpperCase() + appointment.stylist.slice(1)} •{" "}
        {appointment.duration} min
      </div>
    </div>
  );
};