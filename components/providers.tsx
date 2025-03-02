"use client";

import { I18nProviderClient } from "@/locales/client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export function Providers({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  return (
    <SessionProvider>
      <I18nProviderClient locale={locale}>
        {children}
        <Toaster position="top-right" expand={true} richColors />
      </I18nProviderClient>
    </SessionProvider>
  );
} 