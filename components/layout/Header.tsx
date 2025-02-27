"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "./LanguageSwitcher";
import { Menu, X } from "lucide-react";
import { useScopedI18n } from "@/locales/client";
import { Separator } from "../ui/separator";
import SearchIconComp from "../home/SearchIconComp";
import Image from "next/image";
import { NavigationMe } from "../home/NavigationMe";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const tScope = useScopedI18n("navigation");
  const tScope2 = useScopedI18n("common");

  // Handle scroll effect for transparent to solid header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "home" },
    { href: "/services", label: "services" },
    { href: "/pricing", label: "pricing" },
    { href: "/about", label: "about" },
    { href: "/contact", label: "contact" },
  ];

  return (
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
              <span className="sr-only">ServiceSMS</span>
              <Image
                src="/logo2.png"
                alt="Service sms"
                width={100}
                height={100}
                className="object-cover object-center"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 z-[999]">
            <NavigationMe />
          </nav>

          {/* Right side actions */}
          <div className="flex items-center">
            <SearchIconComp />
            <Separator
              orientation="vertical"
              className="mx-2 text-[#646464] w-[1px] h-5"
            />

            <LanguageSwitcher />

            <Separator
              orientation="vertical"
              className="mx-2 text-[#646464] w-[1px] h-5"
            />

            <button className="text-[#67B142] bg-transparent text-base shadow-none font-semibold">
              Connexion
            </button>
            <Separator
              orientation="vertical"
              className="mx-2 text-[#646464] w-[1px] h-5"
            />
            <button className="bg-[#67B142] text-white p-2 text-base rounded-2xl font-semibold transition-colors hover:bg-black/80">
              S'inscrire
            </button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-b">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  pathname === item.href
                    ? "text-[#67B142] font-semibold bg-primary/10"
                    : "text-muted-foreground hover:bg-muted"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="px-3 py-3">
              <Button className="w-full">{tScope2("getStarted")}</Button>
              <Button className="w-full">{tScope2("getStarted")}</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
