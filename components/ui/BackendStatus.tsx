"use client";

import React, { useState, useEffect } from "react";
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

interface BackendStatusProps {
  className?: string;
}

export function BackendStatus({ className }: BackendStatusProps) {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkBackendStatus = async () => {
    setStatus('checking');
    try {
      const response = await fetch('http://localhost:8000', {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
      });
      
      if (response.ok) {
        setStatus('online');
      } else {
        setStatus('offline');
      }
    } catch (error) {
      console.log('Backend check failed:', error);
      setStatus('offline');
    }
    setLastChecked(new Date());
  };

  useEffect(() => {
    checkBackendStatus();
    // Check every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'text-green-600 dark:text-green-400';
      case 'offline':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'online':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'offline':
        return <XCircleIcon className="w-4 h-4" />;
      default:
        return <ArrowPathIcon className="w-4 h-4 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online':
        return 'Backend Online';
      case 'offline':
        return 'Backend Offline';
      default:
        return 'Checking...';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex items-center gap-1 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="text-xs font-medium">{getStatusText()}</span>
      </div>
      {lastChecked && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {lastChecked.toLocaleTimeString()}
        </span>
      )}
      <button
        onClick={checkBackendStatus}
        className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
        title="Refresh status"
      >
        Refresh
      </button>
    </div>
  );
}
