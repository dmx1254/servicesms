"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, GlobeIcon } from "lucide-react";
import { locales, type ValidLocale } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const switchLanguage = (locale: ValidLocale) => {
    // Get the path without the locale prefix
    const currentLocale = pathname.split("/")[1];
    const isCurrentLocaleValid = locales.includes(currentLocale as ValidLocale);

    const newPathname = isCurrentLocaleValid
      ? pathname.replace(`/${currentLocale}`, `/${locale}`)
      : `/${locale}${pathname}`;

    router.push(newPathname);
  };

  const currentLocale = pathname.split("/")[1] as ValidLocale;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer hover:bg-transparent bg-transparent outline-none focus:border-none focus:outline-none"
          onMouseEnter={() => setIsOpen(true)}
        >
          <img
            src={currentLocale === "fr" ? "/flags/frr.png" : "/flags/enn.png"}
            alt={currentLocale}
            className="w-5 h-5 rounded-full"
          />
          <span className="text-base uppercase text-[#646464] outline-none focus:border-none focus:outline-none">
            {currentLocale}
          </span>
          <span>
            <ChevronDown />
          </span>
          {/* <GlobeIcon className="h-4 w-4" /> */}
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" onMouseLeave={() => setIsOpen(false)}>
        <DropdownMenuItem
          onClick={() => switchLanguage(currentLocale === "fr" ? "en" : "fr")}
        >
          {/* {locale === "fr" ? "🇫🇷 Français" : "🇬🇧 English"} */}
          <img
            src={currentLocale === "fr" ? "/flags/enn.png" : "/flags/frr.png"}
            alt={currentLocale}
            className="w-5 h-5 rounded-full"
          />
          <span className="text-base uppercase text-[#646464] outline-none focus:border-none focus:outline-none">
            {currentLocale}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
