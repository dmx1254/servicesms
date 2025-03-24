"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/app/lib/utils/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  MessageSquare,
  Mic,
  ImagePlus,
  Database,
  Mail,
  BarChart3,
  Vote,
  Ticket,
} from "lucide-react";
import { useScopedI18n } from "@/locales/client";

export interface Solution {
  title: string;
  slug: string;
  href: string;
  description: string;
  icon: React.ReactNode;
}

export const components: Solution[] = [
  {
    title: "SMS PRO",
    slug: "sms-pro",
    href: "/solutions/sms-pro",
    description:
      "Solution professionnelle pour l'envoi de SMS en masse avec suivi en temps réel et analyses détaillées.",
    icon: <MessageSquare className="h-6 w-6 text-[#67B142] shrink-0" />,
  },
  {
    title: "SMS VOCAL",
    slug: "sms-vocal",
    href: "/solutions/sms-vocal",
    description:
      "Convertissez vos messages texte en messages vocaux pour une communication plus personnelle et accessible.",
    icon: <Mic className="h-6 w-6 text-[#67B142] shrink-0" />,
  },
  {
    title: "SMS ENRICHI",
    slug: "sms-enrichi",
    href: "/solutions/sms-enrichi",
    description:
      "Enrichissez vos SMS avec des contenus multimédias et des liens interactifs pour plus d'engagement.",
    icon: <ImagePlus className="h-6 w-6 text-[#67B142] shrink-0" />,
  },
  {
    title: "LOCATION BDD",
    slug: "location-bdd",
    href: "/solutions/location-bdd",
    description:
      "Accédez à notre base de données qualifiée pour cibler efficacement vos campagnes SMS.",
    icon: <Database className="h-6 w-6 text-[#67B142] shrink-0" />,
  },
  {
    title: "MAIL TO SMS",
    slug: "mail-to-sms",
    href: "/solutions/mail-to-sms",
    description:
      "Convertissez automatiquement vos emails en SMS pour une communication multicanale efficace.",
    icon: <Mail className="h-6 w-6 text-[#67B142] shrink-0" />,
  },
  {
    title: "SONDAGES SMS",
    slug: "sondages-sms",
    href: "/solutions/sondages-sms",
    description:
      "Créez et gérez des sondages par SMS pour collecter facilement les retours de vos clients.",
    icon: <BarChart3 className="h-6 w-6 text-[#67B142] shrink-0" />,
  },
  {
    title: "VOTE SMS",
    slug: "vote-sms",
    href: "/solutions/vote-sms",
    description:
      "Système de vote par SMS sécurisé pour vos événements et consultations.",
    icon: <Vote className="h-6 w-6 text-[#67B142] shrink-0" />,
  },
  {
    title: "MOBILE TICKETING",
    slug: "mobile-ticketing",
    href: "/solutions/mobile-ticketing",
    description:
      "Solution de billetterie mobile par SMS pour gérer vos événements et contrôler les accès.",
    icon: <Ticket className="h-6 w-6 text-[#67B142] shrink-0" />,
  },
];

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

export function NavigationMe() {
  const tScope = useScopedI18n("header");
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Link href="/solutions">Solutions</Link>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-4 p-6 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                  className="group"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-gray-50 rounded-lg p-2 group-hover:bg-[#67B142]/10 transition-colors">
                      {component.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold mb-1 text-gray-900 group-hover:text-[#67B142] transition-colors">
                        {component.title}
                      </div>
                      <p className="text-sm leading-snug text-muted-foreground group-hover:text-gray-600 transition-colors">
                        {component.description}
                      </p>
                    </div>
                  </div>
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/fonctionnalites" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {tScope("func")}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <button
            onClick={() => scrollToSection("pricing")}
            className={navigationMenuTriggerStyle()}
          >
            {tScope("tar")}
          </button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/metiers" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {tScope("met")}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <button
            onClick={() => scrollToSection("api")}
            className={navigationMenuTriggerStyle()}
          >
            {tScope("api")}
          </button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/blog" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {tScope("blog")}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          {children}
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
