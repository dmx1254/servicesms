import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Delay function for animations
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Checks if the current environment is the browser
 */
export const isBrowser = typeof window !== "undefined";

/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified wait time has elapsed since the last time it was invoked
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const checkAmountOfSms = async (contact: string): Promise<number> => {
  if (contact.startsWith("+221")) {
    return 1;
  } else {
    return 3;
  }
};
export interface ContactMy {
  _id: string;
  nom: string;
  prenom: string;
  telephone: string;
}

export interface UserLocationDB {
  _id: string;
  name: string;
  category: string;
  qualityScore: number;
  phones: ContactMy[];
  isAvailable: boolean;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserLocation {
  _id: string;
  userId: string;
  userDblocation: UserLocationDB;
  isActive: boolean;
  duration: number;
  createdAt: string;
  expiresAt: string;
}

// Language

export const defaultLocale = "fr";
export const locales = ["fr", "en"] as const;
export type ValidLocale = (typeof locales)[number];
