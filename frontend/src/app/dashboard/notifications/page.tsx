"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Bell, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/v1/notifications/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotifications(await res.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: number) => {
    try {
        const token = localStorage.getItem("token");
        await fetch(`http://127.0.0.1:8000/api/v1/notifications/${id}/read`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
        });
        // Optimistic update
        setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (e) {
        console.error(e);
    }
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-accent" /></div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <Bell className="h-6 w-6 text-primary dark:text-accent" />
        <h2 className="text-3xl font-bold text-primary dark:text-white">Notifications</h2>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border border-border text-secondary/60">
                <Bell className="h-12 w-12 mx-auto mb-3 text-secondary/30" />
                <p>No notifications yet.</p>
            </div>
        ) : (
            notifications.map((notif) => (
                <div 
                    key={notif.id} 
                    className={`p-4 rounded-lg border flex justify-between items-start transition-colors ${
                        notif.is_read ? 'bg-card border-border opacity-70' : 'bg-accent/5 dark:bg-accent/10 border-accent/20 shadow-sm'
                    }`}
                >
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                            <h3 className={`font-semibold ${notif.is_read ? 'text-foreground/80' : 'text-primary dark:text-white'}`}>
                                {notif.title}
                            </h3>
                            {!notif.is_read && <span className="h-2 w-2 rounded-full bg-accent animate-pulse"></span>}
                        </div>
                        <p className="text-sm text-secondary font-medium">{notif.message}</p>
                        <p className="text-xs text-secondary/60 flex items-center mt-2">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(notif.created_at).toLocaleString()}
                        </p>
                    </div>
                    {!notif.is_read && (
                        <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-secondary hover:text-green-600 dark:hover:text-green-400"
                            onClick={() => markAsRead(notif.id)}
                            title="Mark as read"
                        >
                            <Check className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            ))
        )}
      </div>
    </div>
  );
}
