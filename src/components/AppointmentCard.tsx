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
  // Convert hex color to RGB for opacity handling
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Default color for 'Anyone'
  const defaultColor = '#6557FF';
  
  // Get the base color (either from props or default)
  const baseColor = colorClass.startsWith('#') ? colorClass : defaultColor;
  
  // Convert to RGB and add opacity
  const rgbColor = hexToRgb(baseColor);
  const backgroundStyle = rgbColor 
    ? { 
        backgroundColor: `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.4)`,
        borderColor: baseColor, // Solid border color
      }
    : {};

  // Import icons dynamically based on the serviceIcon prop
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
      className="absolute rounded-lg px-2 py-1 cursor-pointer transition-colors hover:opacity-90 border-2"
      style={{
        ...backgroundStyle,
        top: `${position.top}px`,
        left: position.left,
        height: `${position.height}px`,
        width: position.width,
      }}
      onClick={onClick}
    >
      <div className="flex items-center gap-1">
        {serviceIcon && (
          <span className="text-foreground">
            {getServiceIcon()}
          </span>
        )}
        <span className="font-medium text-foreground text-sm">{appointment.title}</span>
      </div>
      <div className="text-xs text-foreground/90">
        {appointment.time} ({appointment.duration} min)
      </div>
    </div>
  );
};