"use client";

import React, { useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { BellIcon as BellSolidIcon } from "@heroicons/react/24/solid";
import { Button } from "./Button";
import { Badge } from "./Badge";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  read: boolean;
}

interface NotificationButtonProps {
  notifications?: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onMarkAllRead?: () => void;
}

export default function NotificationButton({
  notifications = [],
  onNotificationClick,
  onMarkAllRead,
}: NotificationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const mockNotifications: Notification[] = [
    {
      id: "1",
      title: "New Result Published",
      message: "Mathematics exam results are now available",
      type: "info",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
    },
    {
      id: "2",
      title: "Assignment Due",
      message: "Physics assignment due tomorrow",
      type: "warning",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
    },
    {
      id: "3",
      title: "Grade Updated",
      message: "Your Chemistry grade has been updated",
      type: "success",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
    },
  ];

  const allNotifications = notifications.length > 0 ? notifications : mockNotifications;
  const displayUnreadCount = notifications.length > 0 ? unreadCount : mockNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification["type"]) => {
    const iconClasses = "w-4 h-4";
    switch (type) {
      case "success":
        return <div className={`${iconClasses} bg-green-500 rounded-full`} />;
      case "warning":
        return <div className={`${iconClasses} bg-yellow-500 rounded-full`} />;
      case "error":
        return <div className={`${iconClasses} bg-red-500 rounded-full`} />;
      default:
        return <div className={`${iconClasses} bg-blue-500 rounded-full`} />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2"
      >
        {displayUnreadCount > 0 ? (
          <BellSolidIcon className="w-5 h-5 text-blue-600" />
        ) : (
          <BellIcon className="w-5 h-5 text-gray-600" />
        )}
        {displayUnreadCount > 0 && (
          <Badge
            variant="error"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-[20px]"
          >
            {displayUnreadCount > 99 ? "99+" : displayUnreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Panel */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Notifications
                </h3>
                {displayUnreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onMarkAllRead?.();
                      setIsOpen(false);
                    }}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Mark all read
                  </Button>
                )}
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {allNotifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                allNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                    onClick={() => {
                      onNotificationClick?.(notification);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {allNotifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-blue-600 hover:text-blue-700"
                  onClick={() => setIsOpen(false)}
                >
                  View all notifications
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
