import React from 'react';
import { Input } from "@/components/ui/input";

interface PriceInputProps {
  value: number;
  onChange: (value: number) => void;
}

export const PriceInput = ({ value, onChange }: PriceInputProps) => {
  return (
    <div className="relative flex-1">
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="pl-8"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-salon-gray">
        €
      </span>
    </div>
  );
};