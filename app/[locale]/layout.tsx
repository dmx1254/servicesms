import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "../../components/providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
// import Footer from "@/components/layout/Footer";
import { Analytics } from '@vercel/analytics/next';

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://axiomtext.com"),
  title: "AxiomText - Votre Plateforme SMS 100% Sénégalaise",
  description:
    "AxiomText est la plateforme leader d'envoi de SMS en masse au Sénégal. Solutions professionnelles pour entreprises, associations et particuliers. SMS marketing, API SMS, et plus encore.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  keywords: [
    "SMS Sénégal",
    "Envoi SMS masse",
    "Marketing SMS",
    "API SMS",
    "Plateforme SMS",
    "SMS professionnel",
    "SMS entreprise",
    "Bulk SMS Sénégal",
    "SMS marketing Dakar",
    "Solutions SMS",
    "AxiomText",
    "SMS Gateway Sénégal",
    "SMS Sondages",
    "SMS Vote",
    "SMS Enrichi",
    "SMS Pro",
    "SMS Conversationnel",
    "SMS Marketing",
    "SMS Sondages",
    "API SMS Sénégal",
    "API SMS OTP",
    "API SMS OTP Sénégal",
    "API SMS OTP Dakar",
    "API SMS OTP Sénégal Dakar",
    "API SMS OTP Sénégal Dakar",
    "API SMS OTP Sénégal Dakar",
    "API SMS OTP Sénégal Dakar",
    "Intégration SMS API",
    "Intégration SMS API Sénégal",
    "Intégration SMS API Dakar",
    "Intégration SMS API Sénégal Dakar",
    "Intégration SMS API Sénégal Dakar",
    "Intégration SMS API Sénégal Dakar",
    "Intégration SMS API Sénégal Dakar",
    "SMS sécurisés API",
    "SMS sécurisés API Sénégal",
    "SMS sécurisés API Dakar",
    "SMS sécurisés API Sénégal Dakar",
    "SMS sécurisés API Dakar",
    "SMS sécurisés API Sénégal Dakar",
    "SMS sécurisés API Dakar",
    "SMS 2FA (authentification à deux facteurs)",
    "API vérification OTP",
    "API SMS Afrique",
    "Envoi SMS international Sénégal",
  ],
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://axiomtext.com",
    siteName: "AxiomText",
    title: "AxiomText - Votre Plateforme SMS 100% Sénégalaise",
    description:
      "AxiomText est la plateforme leader d'envoi de SMS en masse au Sénégal. Solutions professionnelles pour entreprises, associations et particuliers. SMS marketing, API SMS, et plus encore.",
    images: [
      {
        url: "/aaxiom.png",
        width: 1200,
        height: 630,
        alt: "Plateforme AxiomText - Votre Plateforme SMS 100% Sénégalaise",
      },
    ],
  },
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@axiomtext",
    creator: "@axiomtext",
    title: "AxiomText - Votre Plateforme SMS 100% Sénégalaise",
    description:
      "AxiomText est la plateforme leader d'envoi de SMS en masse au Sénégal. Solutions professionnelles pour entreprises, associations et particuliers. SMS marketing, API SMS, et plus encore.",
    images: ["/aaxiom.png", "/logoaxiom.png"],
  },
  alternates: {
    canonical: "https://axiomtext.com",
    languages: {
      "en-US": "https://axiomtext.com/en",
      "fr-FR": "https://axiomtext.com/fr",
    },
  },
  category: "technology",
  referrer: "origin-when-cross-origin",
  authors: [{ name: "AxiomText" }],
  creator: "AxiomText",
  publisher: "AxiomText",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { params: Promise<{ locale: string }> };
}) {
  const { locale } = await params;
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={rubik.className}>
        <Providers locale={locale}>
          <Header />
          <div className={`${rubik.variable} min-h-screen antialiased`}>
            <Toaster />
            {children}
            <Analytics />
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
