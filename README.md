# Salon Appointment System

## Overview
This is a modular appointment management system for salons. It provides functionality for scheduling, managing, and tracking appointments with various service providers.

## Core Features
- Appointment scheduling and management
- Service provider (stylist) management
- Service catalog
- Business hours management
- Walk-in appointment support

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

## Data Types

### Key Interfaces
- `Appointment`: Core appointment data
- `Employee`: Stylist/employee information
- `ServiceType`: Available services
- `WeekSchedule`: Business hours structure

## Integration Requirements

### Theme System
Components use Tailwind CSS and support light/dark themes.

### Authentication
Components are prepared for auth integration with:
- Role-based access control
- User context awareness

### Localization
Text strings are prepared for translation system integration.

### Backend Requirements
Prepared for Supabase integration with:
- Appointments table
- Services table
- Employee schedules
- Business hours
- Exception dates

## Dependencies
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