interface AppointmentCardProps {
  appointment: {
    title: string;
    time: string;
    duration: string;
  };
  position: {
    top: number;
    left: string;
    height: number;
    width: string;
  };
  colorClass: string;
  serviceIcon?: string;
  onClick: () => void;
}

export const AppointmentCard = ({
  appointment,
  position,
  colorClass,
  serviceIcon,
  onClick,
}: AppointmentCardProps) => {
  return (
    <div
      className={`absolute rounded-lg p-2 cursor-pointer transition-colors hover:opacity-90 ${colorClass}`}
      style={{
        top: `${position.top}px`,
        left: position.left,
        height: `${position.height}px`,
        width: position.width,
      }}
      onClick={onClick}
    >
      <div className="flex items-center gap-1">
        {serviceIcon && (
          <span className="text-white opacity-75">{serviceIcon}</span>
        )}
        <span className="font-medium text-white">{appointment.title}</span>
      </div>
      <div className="text-sm text-white/90">
        {appointment.time} ({appointment.duration} min)
      </div>
    </div>
  );
};