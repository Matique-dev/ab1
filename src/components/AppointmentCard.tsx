import { Scissors, Brush, Droplet } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

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

enum InteractionState {
  IDLE,
  PENDING,
  DRAGGING
}

export const AppointmentCard = ({
  appointment,
  position,
  colorClass,
  serviceIcon,
  onClick,
}: AppointmentCardProps) => {
  const [interactionState, setInteractionState] = useState<InteractionState>(InteractionState.IDLE);
  const [isDragging, setIsDragging] = useState(false);
  const pressTimerRef = useRef<number>();
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef<number>();
  const cardRef = useRef<HTMLDivElement>(null);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const snapToInterval = (minutes: number): number => {
    const interval = 15;
    return Math.round(minutes / interval) * interval;
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    clickCountRef.current += 1;

    if (clickCountRef.current === 1) {
      clickTimeoutRef.current = window.setTimeout(() => {
        clickCountRef.current = 0; // Reset after timeout
      }, 300);
    } else if (clickCountRef.current === 2) {
      clearTimeout(clickTimeoutRef.current);
      clickCountRef.current = 0;
      onClick(); // Handle double click - open edit popup
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Start long press timer for drag
    pressTimerRef.current = window.setTimeout(() => {
      setInteractionState(InteractionState.DRAGGING);
      setIsDragging(true);
    }, 700);

    setInteractionState(InteractionState.PENDING);
  };

  const handleMouseUp = () => {
    if (pressTimerRef.current) {
      window.clearTimeout(pressTimerRef.current);
    }

    if (interactionState === InteractionState.PENDING) {
      handleClick(new MouseEvent('click') as unknown as React.MouseEvent);
    }

    setInteractionState(InteractionState.IDLE);
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (interactionState !== InteractionState.DRAGGING) return;

    if (cardRef.current) {
      const gridRect = cardRef.current.parentElement?.getBoundingClientRect();
      
      if (gridRect) {
        const relativeY = e.clientY - gridRect.top;
        const snappedY = snapToInterval(relativeY);
        cardRef.current.style.top = `${snappedY}px`;
      }
    }
  };

  useEffect(() => {
    if (interactionState === InteractionState.DRAGGING) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, [interactionState]);

  // Default color for 'Anyone'
  const defaultColor = '#6557FF';
  const baseColor = colorClass.startsWith('#') ? colorClass : defaultColor;
  const rgbColor = hexToRgb(baseColor);
  
  const backgroundStyle = rgbColor 
    ? { 
        backgroundColor: `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.4)`,
        borderColor: baseColor,
        boxShadow: isDragging ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)' : 'none',
        cursor: isDragging ? 'grabbing' : 'default',
        ...position,
      }
    : position;

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
      ref={cardRef}
      className={`absolute rounded-lg px-2 py-1 transition-all border-2 select-none
        ${isDragging ? 'z-50' : 'z-10'}
      `}
      style={backgroundStyle}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
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