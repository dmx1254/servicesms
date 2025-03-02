"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  MessageSquare,
  Send,
  Users,
  Settings,
  BarChart2,
  PlayCircle,
  FileText,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/app/lib/utils/utils";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  {
    title: "Vue d'ensemble",
    icon: <LayoutGrid className="w-5 h-5" />,
    href: "/dashboard",
  },
  {
    title: "Campagnes SMS",
    icon: <MessageSquare className="w-5 h-5" />,
    href: "/dashboard/campaigns",
  },
  {
    title: "Envoi rapide",
    icon: <Send className="w-5 h-5" />,
    href: "/dashboard/quick-send",
  },
  {
    title: "Contacts",
    icon: <Users className="w-5 h-5" />,
    href: "/dashboard/contacts",
  },
  {
    title: "Statistiques",
    icon: <BarChart2 className="w-5 h-5" />,
    href: "/dashboard/statistics",
  },
  {
    title: "Tutoriels",
    icon: <PlayCircle className="w-5 h-5" />,
    href: "/dashboard/tutorials",
  },
  {
    title: "Factures",
    icon: <FileText className="w-5 h-5" />,
    href: "/dashboard/invoices",
  },
  {
    title: "Paramètres",
    icon: <Settings className="w-5 h-5" />,
    href: "/dashboard/settings",
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-transform bg-white border-r border-gray-200",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#67B142] rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              {isSidebarOpen && (
                <span className="font-semibold text-gray-900">SMS Platform</span>
              )}
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="p-1"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                      pathname === item.href
                        ? "bg-[#67B142] text-white"
                        : "text-gray-700 hover:bg-gray-100",
                      !isSidebarOpen && "justify-center"
                    )}
                  >
                    {item.icon}
                    {isSidebarOpen && <span>{item.title}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="border-t border-gray-200 p-4">
            <div className={cn(
              "flex items-center gap-3",
              !isSidebarOpen && "justify-center"
            )}>
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              {isSidebarOpen && (
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">john@example.com</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          isSidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
} 