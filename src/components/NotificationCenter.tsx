import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useNotificationStore } from '@/stores/notificationStore';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";

export const NotificationCenter = () => {
  const { notifications, markAsRead, deleteNotification, hasUnread } = useNotificationStore();

  const handleOpen = () => {
    notifications.forEach((notification) => {
      if (!notification.read) {
        markAsRead(notification.id);
      }
    });
  };

  return (
    <Sheet onOpenChange={(open) => open && handleOpen()}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {hasUnread() && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center"
            >
              {notifications.filter(n => !n.read).length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {notifications.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No notifications
            </p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.read ? 'bg-background' : 'bg-muted'
                }`}
              >
                <div className="flex justify-between items-start">
                  <p className="text-sm">{notification.message}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    Dismiss
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {format(new Date(notification.createdAt), 'PPp')}
                </p>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};