export interface ServiceType {
  id: string;
  name: string;
  icon?: string;
  durationMinutes: number;
  priceEur: number;
  category: 'haircuts' | 'styling' | 'color' | 'treatments';
}

export const defaultServices: ServiceType[] = [
  {
    id: '1',
    name: "Women's Haircut",
    icon: 'scissors',
    durationMinutes: 60,
    priceEur: 50,
    category: 'haircuts'
  },
  {
    id: '2',
    name: "Men's Haircut",
    icon: 'scissors',
    durationMinutes: 30,
    priceEur: 30,
    category: 'haircuts'
  },
  {
    id: '3',
    name: "Blow Dry",
    icon: 'brush',
    durationMinutes: 30,
    priceEur: 35,
    category: 'styling'
  },
  {
    id: '4',
    name: "Full Color",
    icon: 'droplet',
    durationMinutes: 120,
    priceEur: 100,
    category: 'color'
  },
];