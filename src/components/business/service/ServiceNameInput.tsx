import React from 'react';
import { Input } from "@/components/ui/input";
import { Scissors, Brush, Droplet } from 'lucide-react';

const iconMap = {
  scissors: Scissors,
  brush: Brush,
  droplet: Droplet
};

interface ServiceNameInputProps {
  value: string;
  icon: keyof typeof iconMap;
  onChange: (value: string) => void;
}

export const ServiceNameInput = ({ value, icon, onChange }: ServiceNameInputProps) => {
  const IconComponent = iconMap[icon];

  return (
    <div className="flex items-center space-x-2 md:w-1/3">
      {IconComponent && <IconComponent className="h-5 w-5 text-salon-gray" />}
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
      />
    </div>
  );
};