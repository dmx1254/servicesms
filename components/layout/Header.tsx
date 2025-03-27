"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/app/lib/utils/utils";
import LanguageSwitcher from "./LanguageSwitcher";
import { LogIn, Search } from "lucide-react";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { NavigationMe, components } from "../home/NavigationMe";
import { useSession } from "next-auth/react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  solutions?: boolean;
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSolutions, setShowSolutions] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const locale = useCurrentLocale();
  const tScope = useScopedI18n("header");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { href: "#", label: "Solutions", solutions: true },
    { href: "/pricing", label: tScope("tar") },
    { href: "/metiers", label: tScope("met") },
    { href: "/#api", label: tScope("api") },
    { href: "/blog", label: tScope("blog") },
  ];

  return (
    pathname !== `/${locale}/signin` &&
    pathname !== `/${locale}/signup` &&
    pathname !== `/${locale}/forgot-password` &&
    !pathname.startsWith(`/${locale}/dashboard`) && (
      <>
        <header
          className={cn(
            "w-full top-0 sticky z-[9999] transition-all duration-300 border-b border-gray-100",
            scrolled
              ? "bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm"
              : "bg-transparent"
          )}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center">
                  <Image
                    src="/images/axiomlogo.png"
                    alt="Axiom text"
                    width={140}
                    height={140}
                    className="object-cover object-center w-32 md:w-36"
                  />
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8 z-[999]">
                <NavigationMe />
              </nav>

              {/* Right side actions */}
              <div className="flex items-center space-x-2 md:space-x-4">
                {/* Search Button */}
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Search className="h-5 w-5 text-gray-600" />
                </button>

                {/* Language Switcher */}
                <LanguageSwitcher />

                {/* Auth Actions */}
                {session?.user ? (
                  <Link href="/dashboard" className="cursor-pointer">
                    <Image
                      src="/avatar.png"
                      alt="user"
                      height={50}
                      width={50}
                      className="h-8 w-8 md:h-6 md:w-6 object-cover object-center rounded-full"
                    />
                  </Link>
                ) : (
                  <>
                    {/* Desktop Auth Links */}
                    <div className="hidden md:flex items-center space-x-4">
                      <Link
                        href="/signin"
                        className="text-[#67B142] bg-transparent text-base shadow-none font-semibold"
                      >
                        {tScope("login")}
                      </Link>
                      <Separator
                        orientation="vertical"
                        className="mx-2 text-[#646464] w-[1px] h-5"
                      />
                      <Link
                        href="/signup"
                        className="bg-[#67B142] text-white p-2 text-base rounded-2xl font-semibold transition-colors hover:bg-black/80"
                      >
                        {tScope("register")}
                      </Link>
                    </div>
                    {/* Mobile Auth Icon */}
                    <Link href="/signin" className="md:hidden">
                      <LogIn className="h-6 w-6 text-[#67B142]" />
                    </Link>
                  </>
                )}

                {/* Mobile menu button */}
                <div className="md:hidden">
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className={cn(
                      "relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300",
                      mobileMenuOpen
                        ? "bg-[#67B142]/10 hover:bg-[#67B142]/20"
                        : "hover:bg-gray-100"
                    )}
                  >
                    <div className="w-6 h-5 flex flex-col justify-between items-end">
                      <span
                        className={cn(
                          "h-[2px] bg-gray-600 transition-all duration-300 ease-out",
                          mobileMenuOpen
                            ? "w-full rotate-45 translate-y-2.5 bg-[#67B142]"
                            : "w-full"
                        )}
                      />
                      <span
                        className={cn(
                          "h-[2px] bg-gray-600 transition-all duration-300 ease-out",
                          mobileMenuOpen ? "w-full opacity-0" : "w-3/4"
                        )}
                      />
                      <span
                        className={cn(
                          "h-[2px] bg-gray-600 transition-all duration-300 ease-out",
                          mobileMenuOpen
                            ? "w-full -rotate-45 -translate-y-2.5 bg-[#67B142]"
                            : "w-1/2"
                        )}
                      />
                    </div>
                    <span className="sr-only">Toggle menu</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden fixed h-screen left-0 right-0 bottom-0 inset-0 top-16 bg-white z-50 overflow-y-auto">
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item) => (
                  <div key={item.href}>
                    {item.solutions ? (
                      <div className="space-y-1">
                        <button
                          onClick={() => setShowSolutions(!showSolutions)}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium",
                            showSolutions
                              ? "text-[#67B142] bg-[#67B142]/10"
                              : "text-gray-600 hover:bg-gray-50"
                          )}
                        >
                          <span>Solutions</span>
                          <svg
                            className={cn(
                              "w-5 h-5 transition-transform duration-200",
                              showSolutions ? "transform rotate-180" : ""
                            )}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {showSolutions && (
                          <div className="pl-4 space-y-1 border-l-2 border-[#67B142]/20 ml-3">
                            {components.map((solution) => (
                              <Link
                                key={solution.href}
                                href={solution.href}
                                className="flex items-start gap-3 p-3 rounded-md hover:bg-gray-50"
                                onClick={() => {
                                  setShowSolutions(false);
                                  setMobileMenuOpen(false);
                                }}
                              >
                                <div className="mt-1 bg-[#67B142]/10 rounded-lg p-2">
                                  {solution.icon}
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">
                                    {tScope(
                                      `${
                                        solution.slug as
                                          | "sms-pro"
                                          | "sms-vocal"
                                          | "sms-enrichi"
                                          | "location-bdd"
                                          | "mail-to-sms"
                                          | "sondages-sms"
                                          | "vote-sms"
                                          | "mobile-ticketing"
                                      }.title`
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 line-clamp-2">
                                    {tScope(
                                      `${
                                        solution.slug as
                                          | "sms-pro"
                                          | "sms-vocal"
                                          | "sms-enrichi"
                                          | "location-bdd"
                                          | "mail-to-sms"
                                          | "sondages-sms"
                                          | "vote-sms"
                                          | "mobile-ticketing"
                                      }.description`
                                    )}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "block px-3 py-2 rounded-md text-base font-medium",
                          pathname === item.href
                            ? "text-[#67B142] bg-[#67B142]/10"
                            : "text-gray-600 hover:bg-gray-50"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* Search Dialog */}
        <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
          <CommandInput placeholder={tScope("searchSol")} />
          <CommandList>
            <CommandEmpty>{tScope("noSolFound")}</CommandEmpty>
            <CommandGroup heading="Solutions">
              {components.map((component) => (
                <CommandItem
                  key={component.title}
                  onSelect={() => {
                    router.push(component.href);
                    setSearchOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {component.icon}
                    <div>
                      <div className="font-medium">
                        {tScope(
                          `${
                            component.slug as
                              | "sms-pro"
                              | "sms-vocal"
                              | "sms-enrichi"
                              | "location-bdd"
                              | "mail-to-sms"
                              | "sondages-sms"
                              | "vote-sms"
                              | "mobile-ticketing"
                          }.title`
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {tScope(
                          `${
                            component.slug as
                              | "sms-pro"
                              | "sms-vocal"
                              | "sms-enrichi"
                              | "location-bdd"
                              | "mail-to-sms"
                              | "sondages-sms"
                              | "vote-sms"
                              | "mobile-ticketing"
                          }.description`
                        )}
                      </p>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    )
  );
}
