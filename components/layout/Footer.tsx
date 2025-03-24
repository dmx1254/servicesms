"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function Footer() {
  const pathname = usePathname();
  const locale = useCurrentLocale();
  const t = useScopedI18n("footer"); // Utilisation du hook de traduction

  return (
    pathname !== `/${locale}/signin` &&
    pathname !== `/${locale}/signup` &&
    pathname !== `/${locale}/forgot-password` &&
    !pathname.startsWith(`/${locale}/dashboard`) && (
      <motion.footer
        className="bg-black/90"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={footerVariants}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {/* Logo and Contact Info */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-start space-y-4 lg:col-span-2"
            >
              <div className="flex items-center">
                <Image
                  src="/images/favicon.png"
                  alt="AxiomText"
                  width={56}
                  height={56}
                  className="w-14 h-14"
                />
                <span className="text-white text-2xl ml-3 font-semibold">
                  AxiomTEXT
                </span>
              </div>

              <div className="text-gray-400">
                <p>{t("address.line1")}</p>
                <p>{t("address.line2")}</p>
                <p>{t("address.line3")}</p>
              </div>

              <div className="text-gray-400">
                <p>+221 77 808 55 33</p>
              </div>

              <div className="flex gap-4">
                <Link
                  href="https://www.linkedin.com/in/axiomtext-sms-84105521b"
                  className="text-gray-400 hover:text-[#67B142] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-5 h-5" />
                </Link>
                <Link
                  href="https://www.facebook.com/profile.php?viewas=100000686899395&id=61573974278248"
                  className="text-gray-400 hover:text-[#67B142] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link
                  href="https://www.instagram.com/servicesms.contact/"
                  className="text-gray-400 hover:text-[#67B142] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link
                  href="https://www.youtube.com/channel/UC3GOKopT10KN2OTZSVk5KJg"
                  className="text-gray-400 hover:text-[#67B142] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Youtube className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>

            {/* Nos Canaux */}
            <motion.div variants={itemVariants}>
              <h3 className="text-[#67B142] text-xl font-medium mb-4">
                {t("channels")}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/solutions/sms-pro"
                    className="text-white hover:text-[#67B142] transition-colors"
                  >
                    {t("smsPro")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/solutions/sms-vocal"
                    className="text-white hover:text-[#67B142] transition-colors"
                  >
                    {t("smsVocal")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/solutions/location-bdd"
                    className="text-white hover:text-[#67B142] transition-colors"
                  >
                    {t("locationBdd")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/solutions/sms-enrichi"
                    className="text-white hover:text-[#67B142] transition-colors"
                  >
                    {t("smsEnrichi")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/solutions/mail-to-sms"
                    className="text-white hover:text-[#67B142] transition-colors"
                  >
                    {t("mailToSms")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/solutions/sondages-sms"
                    className="text-white hover:text-[#67B142] transition-colors"
                  >
                    {t("sondagesSms")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/solutions/vote-sms"
                    className="text-white hover:text-[#67B142] transition-colors"
                  >
                    {t("voteSms")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/solutions/mobile-ticketing"
                    className="text-white hover:text-[#67B142] transition-colors"
                  >
                    {t("mobileTicketing")}
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* Informations */}
            <motion.div variants={itemVariants}>
              <h3 className="text-[#67B142] text-xl font-medium mb-4">
                {t("information")}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about-us"
                    className="text-white hover:text-[#67B142] transition-colors"
                  >
                    {t("who")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-it-works"
                    className="text-white hover:text-[#67B142] transition-colors"
                  >
                    {t("how")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-white hover:text-[#67B142] transition-colors"
                  >
                    {t("careers")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-white hover:text-[#67B142] transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal"
                    className="text-white hover:text-[#67B142] transition-colors"
                  >
                    {t("legalmention")}
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* Légales */}
            <motion.div variants={itemVariants}>
              <h3 className="text-[#67B142] text-xl font-medium mb-4">
                {t("legal")}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/cgu"
                    className="text-white hover:text-[#67B142] transition-colors"
                  >
                    {t("legal.terms")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cgv"
                    className="text-white hover:text-[#67B142] transition-colors"
                  >
                    {t("legal.sales")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-white hover:text-[#67B142] transition-colors"
                  >
                    {t("legal.privacy")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="text-white hover:text-[#67B142] transition-colors"
                  >
                    {t("legal.cookies")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-white hover:text-[#67B142] transition-colors"
                  >
                    {t("legal.contact")}
                  </Link>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Copyright */}
          <motion.div
            variants={itemVariants}
            className="mt-12 pt-8 border-t border-[#67B142]/5"
          >
            <p className="text-center text-sm text-gray-400">
              {t("copyright")}
            </p>
          </motion.div>
        </div>
      </motion.footer>
    )
  );
}
