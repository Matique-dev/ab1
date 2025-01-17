# Salon Calendar Migration Guide

## Overview
This document provides guidance for migrating the Salon Calendar application to a new project.

## Core Dependencies
- React 18.x
- TypeScript 5.x
- Tailwind CSS
- shadcn/ui components
- date-fns for date manipulation
- Lucide React for icons

## Key Components

### Appointment Management
The appointment system consists of several key components:
- `TimelineView`: Main calendar view supporting day/week views
- `AppointmentModal`: Form for creating/editing appointments
- `AppointmentGrid`: Visual display of appointments

### Data Types
Core interfaces are documented in:
- `src/types/appointment.ts`
- `src/types/service.ts`
- `src/types/schedule.ts`

### State Management
The application uses:
- Local state for UI interactions
- `useBusinessStore` (Zustand) for business data
- React Query for API interactions

## Migration Steps

1. **Environment Setup**
   - Install required dependencies
   - Configure Tailwind CSS
   - Set up shadcn/ui components

2. **Component Migration**
   - Start with core components (TimelineView, AppointmentModal)
   - Implement shared hooks
   - Set up state management

3. **Data Migration**
   - Implement data models
   - Set up API endpoints
   - Migrate existing appointments

4. **Testing**
   - Verify appointment creation/editing
   - Test calendar navigation
   - Validate business rules

## Backend Requirements

### Required Endpoints
- GET /appointments
- POST /appointments
- PUT /appointments/:id
- DELETE /appointments/:id
- GET /services
- GET /employees

### Data Models
See TypeScript interfaces in `src/types/` for required fields and types.

## Theme Integration
The application uses Tailwind CSS with custom colors:
- Primary: salon-pink
- Secondary: salon-peach
- Neutral grays for UI elements

## Localization
All text is stored in `src/constants/translations.ts` for easy translation.