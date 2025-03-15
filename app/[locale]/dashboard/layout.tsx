"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, redirect } from "next/navigation";
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
  Loader,
  LogOut,
  Megaphone,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils/utils";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import DashTopBar from "@/components/DashTopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const locale = useCurrentLocale();
  const t = useScopedI18n("navigation");
  const tCommon = useScopedI18n("common");

  const sidebarItems = [
    {
      title: t("overview"),
      icon: <LayoutGrid className="w-5 h-5" />,
      href: `/${locale}/dashboard`,
    },
    {
      title: t("campaigns"),
      icon: <MessageSquare className="w-5 h-5" />,
      href: `/${locale}/dashboard/campaigns`,
      subItems: [
        {
          title: "Nouvelle campagne",
          href: `/${locale}/dashboard/campaigns/new`,
          icon: <Megaphone className="w-6 h-6" />,
        },
        {
          title: "Envoi rapide",
          href: `/${locale}/dashboard/campaigns/quick-send`,
          icon: <Send className="w-5 h-5" />,
        },
        // {
        //   title: "Programmées",
        //   href: `/${locale}/dashboard/campaigns/scheduled`,
        //   icon: <FileText className="w-4 h-4" />,
        // },
        {
          title: "Historique",
          href: `/${locale}/dashboard/campaigns`,
          icon: <BarChart2 className="w54 h-5" />,
        },
      ],
    },
    // {
    //   title: t("quickSend"),
    //   icon: <Send className="w-5 h-5" />,
    //   href: `/${locale}/dashboard/quick-send`,
    // },
    {
      title: t("contacts"),
      icon: <Users className="w-5 h-5" />,
      href: `/${locale}/dashboard/contacts`,
    },
    {
      title: t("statistics"),
      icon: <BarChart2 className="w-5 h-5" />,
      href: `/${locale}/dashboard/statistics`,
    },
    {
      title: t("tutorials"),
      icon: <PlayCircle className="w-5 h-5" />,
      href: `/${locale}/dashboard/tutorials`,
    },
    {
      title: t("invoices"),
      icon: <FileText className="w-5 h-5" />,
      href: `/${locale}/dashboard/invoices`,
    },
    {
      title: t("settings"),
      icon: <Settings className="w-5 h-5" />,
      href: `/${locale}/dashboard/settings`,
    },
  ];

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-[#67B142]" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/signin");
  }

  const sidebarVariants = {
    open: { width: 256, transition: { duration: 0.3, ease: "easeInOut" } },
    closed: { width: 80, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  const textVariants = {
    open: { opacity: 1, x: 0, display: "block" },
    closed: { opacity: 0, x: -10, display: "none" },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.div
        initial={isSidebarOpen ? "open" : "closed"}
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 shadow-sm"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
            <Link href="/" className="flex items-center gap-3">
              <div
                className={`relative ${
                  isSidebarOpen ? "w-28 h-28" : "w-8 h-8"
                }  rounded-lg overflow-hidden`}
              >
                <Image
                  src={
                    isSidebarOpen
                      ? "/images/axiomlogo.png"
                      : "/images/favicon.png"
                  }
                  alt="AxiomTEXT"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              {/* <motion.span
                variants={textVariants}
                className="font-semibold text-gray-900 whitespace-nowrap"
              >
                AxiomTEXT
              </motion.span> */}
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 hover:bg-gray-100 transition-colors"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <motion.div
                animate={{ rotate: isSidebarOpen ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight className="h-5 w-5" />
              </motion.div>
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <motion.li
                  key={item.href}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-200",
                      pathname === item.href
                        ? "bg-[#67B142] text-white shadow-md shadow-[#67B142]/20 relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#67B142] before:rounded-r-full before:-ml-4"
                        : "text-gray-700 hover:bg-gray-100",
                      !isSidebarOpen && "justify-center"
                    )}
                  >
                    <div
                      className={cn(
                        "transition-transform duration-200",
                        pathname === item.href && "scale-110"
                      )}
                    >
                      {item.icon}
                    </div>
                    <motion.span
                      variants={textVariants}
                      className={cn(pathname === item.href && "font-medium")}
                    >
                      {item.title}
                    </motion.span>
                  </Link>
                  {item.subItems && isSidebarOpen && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ 
                        opacity: 1, 
                        height: "auto",
                        transition: { duration: 0.3 }
                      }}
                      className="ml-6 mt-2 space-y-1"
                    >
                      {item.subItems.map((subItem) => (
                        <motion.li
                          key={subItem.href}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link
                            href={subItem.href}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 rounded text-sm transition-all duration-200",
                              pathname === subItem.href
                                ? "bg-[#67B142]/10 text-[#67B142] font-medium"
                                : "text-gray-600 hover:bg-gray-50 hover:text-[#67B142]"
                            )}
                          >
                            {subItem.icon}
                            <span>{subItem.title}</span>
                          </Link>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="border-t border-gray-200 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors",
                    !isSidebarOpen && "justify-center"
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-[#67B142]/10 flex items-center justify-center text-[#67B142] font-medium">
                    {session?.user?.firstName?.[0]}
                    {session?.user?.lastName?.[0]}
                  </div>
                  <motion.div
                    variants={textVariants}
                    className="flex-1 text-left overflow-hidden"
                  >
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {`${session?.user?.lastName} ${session?.user?.firstName}`}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {session?.user?.email}
                    </p>
                  </motion.div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-[6px]"
                side={isSidebarOpen ? "right" : "top"}
              >
                <DropdownMenuLabel>
                  <Link href="/dashboard/settings">{tCommon("myAccount")}</Link>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                  onClick={() => signOut()}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {tCommon("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        animate={{
          marginLeft: isSidebarOpen ? 256 : 80,
          transition: { duration: 0.3, ease: "easeInOut" },
        }}
      >
        <header className="sticky flex items-center justify-end h-14 top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          {/* <div className="px-8 py-4">
            <Breadcrumb />
          </div> */}
          <DashTopBar />
        </header>
        <main className="p-8">{children}</main>
      </motion.div>
    </div>
  );
}
