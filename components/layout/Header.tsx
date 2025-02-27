"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "./LanguageSwitcher";
import { Menu, X } from "lucide-react";
import { useScopedI18n } from "@/locales/client";

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
        "w-full top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">ServiceSMS</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary font-semibold"
                    : "text-muted-foreground"
                )}
              >
                {tScope(
                  item.label as
                    | "home"
                    | "services"
                    | "pricing"
                    | "about"
                    | "contact"
                )}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-8">
            <LanguageSwitcher />
            {/* <Button className="hidden md:inline-flex">
              {tScope2("getStarted")}
            </Button> */}
            <div className="flex items-center gap-4">
              <button className="text-[#67B142] bg-transparent text-base shadow-none font-semibold">
                Connexion
              </button>
              <button className="bg-[#67B142] text-white p-2 text-base rounded-2xl font-semibold transition-colors hover:bg-black/80">
                S'inscrire
              </button>
            </div>

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
                    ? "text-primary font-semibold bg-primary/10"
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
