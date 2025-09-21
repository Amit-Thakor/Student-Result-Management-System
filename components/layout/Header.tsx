"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import NotificationButton from "@/components/ui/NotificationButton";
import { useAuth } from "@/lib/auth";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export function Header({ setSidebarOpen }: HeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  // Get page title from pathname
  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 1) {
      return user?.role === "admin" ? "Admin Dashboard" : "Student Dashboard";
    }

    const lastSegment = segments[segments.length - 1];
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((segment, index) => ({
      name: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: "/" + segments.slice(0, index + 1).join("/"),
      current: index === segments.length - 1,
    }));
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Bars3Icon className="w-5 h-5" />
          </Button>

          {/* Page title and breadcrumbs */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {getPageTitle()}
            </h1>
            <nav className="flex mt-1" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-gray-500">
                {getBreadcrumbs().map((item, index) => (
                  <li key={item.href} className="flex items-center">
                    {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                    <span
                      className={
                        item.current
                          ? "text-gray-900 font-medium"
                          : "hover:text-gray-700"
                      }
                    >
                      {item.name}
                    </span>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:block relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 w-64 bg-gray-50 border-gray-200"
            />
          </div>

          {/* Theme toggle */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>

          {/* Notifications */}
          <NotificationButton />

          {/* User menu */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-700 font-semibold text-sm">
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
