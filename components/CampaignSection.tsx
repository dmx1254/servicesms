"use client";

import { useScopedI18n } from "@/locales/client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function CampaignSection() {
  const tScope = useScopedI18n("campagn");
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-6 sm:space-y-8"
          >
            <motion.div variants={fadeIn}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                {tScope("title")}{" "}
                <span className="block">{tScope("title2")}</span>
              </h2>
              <p className="text-2xl sm:text-3xl font-semibold text-[#67B142] mb-6 sm:mb-8">
                {tScope("title3")}
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="space-y-4 sm:space-y-6 text-base sm:text-lg text-gray-600"
            >
              <p>
                {tScope("title4")}{" "}
                <span className="font-semibold">{tScope("title5")}</span>{" "}
                {tScope("title6")}
              </p>
              <p>
                {tScope("title7")}{" "}
                <span className="font-semibold">{tScope("title8")}</span>,
                {tScope("title9")}{" "}
                <span className="font-semibold">{tScope("title10")}</span>{" "}
                {tScope("title11")}{" "}
                <span className="font-semibold">{tScope("title12")}</span>{" "}
                {tScope("title13")}
              </p>
              <p className="font-medium">{tScope("title14")}</p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4"
            >
              <Link href="/signup" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-6 py-3 bg-[#67B142] text-white rounded-[6px] hover:bg-[#4e8a2f] transition-colors font-medium text-sm sm:text-base"
                >
                  {tScope("title15")}
                </motion.button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white rounded-[6px] hover:bg-gray-800 transition-colors font-medium text-sm sm:text-base"
                >
                  {tScope("title16")}
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[300px] sm:h-[400px] lg:h-[700px] order-first lg:order-last"
          >
            <Image
              src="/images/features/campaign.png"
              alt="Interface de la plateforme"
              fill
              className="object-contain"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/20" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
