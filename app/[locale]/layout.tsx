import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "../../components/providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
// import Footer from "@/components/layout/Footer";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: "AxiomText - Votre Plateforme SMS 100% Sénégalaise",
  description:
    "AxiomText est la plateforme leader d'envoi de SMS en masse au Sénégal. Solutions professionnelles pour entreprises, associations et particuliers. SMS marketing, API SMS, et plus encore.",

  icons: {
    icon: "/images/favicon.png",
  },
  metadataBase: new URL('https://www.axiomtext.com'),
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
  authors: [{ name: "AxiomText" }],
  creator: "AxiomText",
  publisher: "AxiomText",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_SN",
    url: "https://axiomtext.com",
    siteName: "AxiomText",
    title: "AxiomText - Votre Plateforme SMS 100% Sénégalaise",
    description:
      "Plateforme leader d'envoi de SMS en masse au Sénégal. Solutions professionnelles SMS pour entreprises et particuliers.",
    images: [
      {
        url: "/images/axiomlogo.png",
        width: 1200,
        height: 630,
        alt: "AxiomText - Solutions SMS Professionnelles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AxiomText - Votre Plateforme SMS 100% Sénégalaise",
    description:
      "Plateforme leader d&apos;envoi de SMS en masse au Sénégal. Solutions professionnelles SMS pour entreprises et particuliers.",
    images: ["/images/axiomlogo.png"],
    creator: "@axiomtext",
    site: "@axiomtext",
  },

  verification: {
    google: "votre-code-google-verification",
  },
  category: "technology",
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
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
