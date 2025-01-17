/**
 * Represents a service offered by the salon.
 * @interface ServiceType
 */
export interface ServiceType {
  /** Unique identifier for the service */
  id: string;
  /** Name of the service */
  name: string;
  /** Icon identifier from lucide-react package */
  icon?: string;
  /** Duration of the service in minutes */
  durationMinutes: number;
  /** Price of the service in euros */
  priceEur: number;
  /** Category the service belongs to */
  category: 'haircuts' | 'styling' | 'color' | 'treatments';
}

/**
 * Default services offered by the salon
 * @constant defaultServices
 */
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