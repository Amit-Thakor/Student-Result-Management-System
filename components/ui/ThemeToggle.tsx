"use client";

import React from "react";
import {
  MoonIcon,
  SunIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/components/providers/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <SunIcon className="w-4 h-4" />;
      case "dark":
        return <MoonIcon className="w-4 h-4" />;
      case "system":
        return <ComputerDesktopIcon className="w-4 h-4" />;
      default:
        return <SunIcon className="w-4 h-4" />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case "light":
        return "Switch to dark mode";
      case "dark":
        return "Switch to system mode";
      case "system":
        return "Switch to light mode";
      default:
        return "Toggle theme";
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      title={getLabel()}
      className="w-10 h-10 p-0 bg-white dark:bg-gray-800 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900 dark:hover:to-pink-900 rounded-lg transition-all duration-300 theme-toggle border-2 border-purple-300 dark:border-purple-600 hover:border-purple-400 dark:hover:border-purple-500 shadow-md hover:shadow-lg transform hover:rotate-12 hover:scale-110"
    >
      <div className="flex items-center justify-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200">
        {getIcon()}
      </div>
      <span className="sr-only">{getLabel()}</span>
    </Button>
  );
}
