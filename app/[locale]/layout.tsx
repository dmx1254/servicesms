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
  title: "AxiomTEXT",
  description: "AxiomTEXT est une plateforme de marketing par SMS",
  icons: {
    icon: "/images/favicon.png",
  },
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
