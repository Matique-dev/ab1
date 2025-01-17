# Storybook Documentation

## Setup Instructions
1. Install Storybook: `npx storybook@latest init`
2. Add required dependencies
3. Configure Tailwind CSS support

## Component Stories

### TimelineView
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { TimelineView } from '../components/TimelineView';

const meta: Meta<typeof TimelineView> = {
  title: 'Calendar/TimelineView',
  component: TimelineView,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof TimelineView>;

export const DayView: Story = {
  args: {
    date: new Date(),
    appointments: [],
    mode: 'day',
    onAppointmentEdit: (apt) => console.log('Edit:', apt),
    onAppointmentDelete: (id) => console.log('Delete:', id),
  },
};

export const WeekView: Story = {
  args: {
    ...DayView.args,
    mode: 'week',
  },
};
```

### AppointmentModal
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { AppointmentModal } from '../components/AppointmentModal';

const meta: Meta<typeof AppointmentModal> = {
  title: 'Calendar/AppointmentModal',
  component: AppointmentModal,
};

export default meta;
type Story = StoryObj<typeof AppointmentModal>;

export const Create: Story = {
  args: {
    currentDate: new Date(),
    services: [],
    onAppointmentCreate: (apt) => console.log('Create:', apt),
  },
};

export const Edit: Story = {
  args: {
    ...Create.args,
    appointment: {
      id: '1',
      title: 'John Doe',
      stylist: 'anyone',
      time: '10:00',
      duration: '60',
      isWalkIn: false,
      date: new Date(),
    },
  },
};
```