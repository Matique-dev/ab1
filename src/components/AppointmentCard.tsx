import { Scissors, Brush, Droplet } from 'lucide-react';

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
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const defaultColor = '#6557FF';
  const baseColor = colorClass.startsWith('#') ? colorClass : defaultColor;
  const rgbColor = hexToRgb(baseColor);
  const backgroundStyle = rgbColor 
    ? { 
        backgroundColor: `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.4)`,
        borderColor: baseColor,
      }
    : {};

  const getServiceIcon = () => {
    switch (serviceIcon) {
      case 'scissors':
        return <Scissors className="h-4 w-4" />;
      case 'brush':
        return <Brush className="h-4 w-4" />;
      case 'droplet':
        return <Droplet className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div
      className="absolute rounded-lg px-2 py-1 cursor-pointer transition-colors hover:opacity-90 border-2 overflow-hidden"
      style={{
        ...backgroundStyle,
        top: `${position.top}px`,
        left: position.left,
        height: `${position.height}px`,
        width: position.width,
      }}
      onClick={onClick}
    >
      <div className="flex items-center gap-1 truncate">
        {serviceIcon && (
          <span className="text-foreground flex-shrink-0">
            {getServiceIcon()}
          </span>
        )}
        <span className="font-medium text-foreground text-sm truncate">{appointment.title}</span>
      </div>
      <div className="text-xs text-foreground/90 truncate">
        {appointment.time} ({appointment.duration} min)
      </div>
    </div>
  );
};