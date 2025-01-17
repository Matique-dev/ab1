# Salon Appointment System

## Overview
A modular appointment management system for salons, designed for easy integration with existing projects. The system provides comprehensive functionality for scheduling, managing, and tracking appointments with various service providers.

## Core Features
- Appointment scheduling and management
- Service provider (stylist) management
- Service catalog with customizable services
- Business hours management
- Walk-in appointment support
- Theme support (light/dark)
- Localization ready

## Component Structure

### Main Components
- `AppointmentModal`: Main modal for creating/editing appointments
- `AppointmentGrid`: Visual representation of daily appointments
- `AppointmentCard`: Individual appointment display
- `AppointmentFormFields`: Form fields for appointment data

### Utility Components
- `DateTimeInputs`: Date and time selection
- `ClientNameInput`: Client name input field
- `ServiceSelect`: Service selection dropdown
- `StylistSelect`: Stylist selection dropdown
- `DurationSelect`: Duration selection
- `WalkInCheckbox`: Walk-in toggle

## State Management
- Uses React Query for server state management
- Local state for UI interactions
- Business hours and employee schedules in store
- Prepared for Supabase integration

## Data Types

### Key Interfaces
- `Appointment`: Core appointment data
- `Employee`: Stylist/employee information
- `ServiceType`: Available services
- `WeekSchedule`: Business hours structure

## Integration Requirements

### Theme System
- Components use Tailwind CSS
- Support for light/dark themes
- Customizable color schemes

### Authentication
Components are prepared for auth integration with:
- Role-based access control
- User context awareness
- Supabase RLS policies

### Localization
- Text strings prepared for translation system
- Flexible label management
- Date/time format localization

### Backend Requirements
Prepared for Supabase integration with:
- Appointments table
- Services table
- Employee schedules
- Business hours
- Exception dates

## Dependencies
Core dependencies required:
- @tanstack/react-query
- date-fns
- lucide-react
- shadcn/ui components
- Tailwind CSS

## Getting Started
1. Install required dependencies
2. Set up authentication context
3. Configure backend connection
4. Implement localization
5. Integrate with navigation system

## Best Practices
- Use TypeScript for type safety
- Follow React Query patterns for data fetching
- Implement proper error handling
- Maintain accessibility standards
- Use responsive design patterns

## Migration Guide
1. Set up required dependencies
2. Copy component files maintaining structure
3. Configure theme integration
4. Set up localization
5. Connect to authentication system
6. Implement backend integration
7. Add RLS policies

## Backend Schema
Required Supabase tables:
\`\`\`sql
-- Appointments table
create table appointments (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  stylist_id uuid references auth.users(id),
  service_id uuid references services(id),
  start_time timestamptz not null,
  duration interval not null,
  is_walk_in boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Services table
create table services (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  duration interval not null,
  price decimal(10,2) not null,
  icon text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Business hours table
create table business_hours (
  id uuid default uuid_generate_v4() primary key,
  day_of_week smallint not null,
  is_open boolean default true,
  open_time time not null,
  close_time time not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
\`\`\`