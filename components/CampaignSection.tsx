"use client";

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
                La plateforme marketing multicanale pour{" "}
                <span className="block">monétiser vos clients</span>
              </h2>
              <p className="text-2xl sm:text-3xl font-semibold text-[#67B142] mb-6 sm:mb-8">
                100% made in Senegal
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="space-y-4 sm:space-y-6 text-base sm:text-lg text-gray-600">
              <p>
                Solution de routage <span className="font-semibold">SMS, Emails, RCS</span> pour tous les professionnels.
              </p>
              <p>
                Envoyez vos <span className="font-semibold">SMS en masse</span>, emails marketing,{" "}
                <span className="font-semibold">OTP</span> (mots de passe unique), messages{" "}
                <span className="font-semibold">vocaux</span> de manière simple et sécurisée.
              </p>
              <p className="font-medium">
                Testez notre solution sans engagement !
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <Link href="/signup" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-6 py-3 bg-[#67B142] text-white rounded-[6px] hover:bg-[#4e8a2f] transition-colors font-medium text-sm sm:text-base"
                >
                  Commencer gratuitement
                </motion.button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white rounded-[6px] hover:bg-gray-800 transition-colors font-medium text-sm sm:text-base"
                >
                  En savoir plus
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
