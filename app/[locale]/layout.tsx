import type { Metadata } from "next";
import { Rubik, Poppins } from "next/font/google";
import "../globals.css";
import { Providers } from "@/components/i18n/providers";
import { Toaster } from "sonner";
// import Footer from "@/components/layout/Footer";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "servicesms",
  description:
    "Servicesms.sn est un service en ligne de premier plan au Sénégal",
  icons: {
    icon: "/logo.png",
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { params: Promise<{ locale: string }> };
}>) {
  const { locale } = await params;
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${rubik.variable} ${poppins.variable} antialiased font-sans`}
      >
        <Providers locale={locale}>
          <Toaster />
          <main className="min-h-screen">{children}</main>
          {/* <Footer /> */}
        </Providers>
      </body>
    </html>
  );
}
