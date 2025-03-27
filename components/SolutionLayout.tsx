"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SolutionLayoutProps {
  title: string;
  description: string;
  mainImage: string;
  features: string[];
  benefits: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
  useCases: {
    title: string;
    description: string;
  }[];
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function SolutionLayout({
  title,
  description,
  mainImage,
  features,
  benefits,
  useCases,
}: SolutionLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section avec design moderne */}
      <div className="relative overflow-hidden pt-24 pb-32">
        {/* Fond avec motif et gradient */}
        <div className="absolute inset-0 bg-[linear-gradient(30deg,#67B14210_1px,transparent_1px),linear-gradient(150deg,#67B14210_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-gradient-to-br bg-white" />

        {/* Cercles décoratifs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#67B142]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#34A853]/10 rounded-full blur-3xl" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="relative"
            >
              {/* Badge flottant */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute -top-10 left-0 inline-flex items-center px-4 py-2 rounded-full bg-white shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-[#67B142] mr-2" />
                <span className="text-sm font-medium bg-gradient-to-r from-[#67B142] to-[#34A853] bg-clip-text text-transparent">
                  Solution Professionnelle
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-tight"
              >
                {title}
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="mt-8 text-xl lg:text-2xl leading-relaxed text-gray-600 max-w-3xl"
              >
                {description}
              </motion.p>
              <motion.div
                variants={fadeInUp}
                className="mt-12 flex flex-wrap items-center gap-6"
              >
                <Button
                  size="lg"
                  className="bg-[#67B142] hover:bg-[#67B142]/90 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg p-4 h-auto rounded-xl group"
                  asChild
                >
                  <Link href="/contact">
                    En savoir plus
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-[#67B142] text-[#67B142] hover:bg-[#67B142]/5 shadow-lg hover:shadow-xl transition-all duration-300 text-lg p-4 h-auto rounded-xl"
                  asChild
                >
                  <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                    Voir la démo
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Image principale avec effet moderne */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#67B142]/20 to-[#34A853]/20 rounded-2xl transform rotate-1" />
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-white p-2 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
                <Image
                  src={mainImage}
                  alt={title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section avec design moderne */}
      <div className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#67B142]/10 text-[#67B142] text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Caractéristiques Principales
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-16">
              Pourquoi choisir notre solution ?
            </h2>
          </motion.div>

          <div className="mx-auto mt-16">
            <dl className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group hover:scale-105 transition-transform duration-300"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#67B142]/10 to-[#34A853]/10 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300" />
                    <div className="relative bg-white rounded-2xl p-8 shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <div className="rounded-xl bg-[#67B142]/10 p-3 mb-6 w-16 h-16 flex items-center justify-center group-hover:bg-[#67B142]/20 transition-colors duration-300">
                        <CheckCircle2 className="h-8 w-8 text-[#67B142]" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {feature}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Benefits Section avec design moderne */}
      <div className="py-32 bg-gray-50 relative overflow-hidden">
        {/* Cercles décoratifs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#67B142]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#34A853]/5 rounded-full blur-3xl" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center mb-20"
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#67B142]/10 text-[#67B142] text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Nos Avantages
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#67B142] to-[#34A853] bg-clip-text text-transparent">
              Nos avantages
            </h2>
          </motion.div>

          <div className="mx-auto">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#67B142]/10 to-[#34A853]/10 rounded-3xl transform rotate-2 group-hover:rotate-3 transition-transform duration-300" />
                    <div className="relative bg-white rounded-3xl p-10 shadow-lg group-hover:shadow-xl transition-all duration-300 -rotate-2 group-hover:-rotate-1">
                      <div className="rounded-2xl bg-gradient-to-br from-[#67B142]/10 to-[#34A853]/10 p-4 inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
                        {benefit.icon}
                      </div>
                      <dt className="text-2xl font-semibold text-gray-900 mb-4">
                        {benefit.title}
                      </dt>
                      <dd className="text-lg text-gray-600 leading-relaxed">
                        {benefit.description}
                      </dd>
                    </div>
                  </div>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Use Cases Section avec design moderne */}
      <div className="py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(30deg,#67B14205_1px,transparent_1px),linear-gradient(150deg,#67B14205_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center mb-20"
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#67B142]/10 text-[#67B142] text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Applications Concrètes
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#67B142] to-[#34A853] bg-clip-text text-transparent">
              Cas d&apos;utilisation
            </h2>
          </motion.div>

          <div className="mx-auto">
            <dl className="grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-2">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative pl-12 border-l-4 border-[#67B142] hover:border-[#34A853] transition-colors duration-300">
                    <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-[#67B142] group-hover:bg-[#34A853] transition-colors duration-300" />
                    <dt className="text-2xl font-semibold text-gray-900 mb-4 group-hover:text-[#67B142] transition-colors duration-300">
                      {useCase.title}
                    </dt>
                    <dd className="text-lg text-gray-600 leading-relaxed">
                      {useCase.description}
                    </dd>
                  </div>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section avec design moderne */}
      <div className="relative py-32 bg-gradient-to-br from-[#67B142]/5 via-white to-[#34A853]/5">
        <div className="absolute inset-0 bg-[linear-gradient(30deg,#67B14210_1px,transparent_1px),linear-gradient(150deg,#67B14210_1px,transparent_1px)] bg-[size:24px_24px] opacity-50" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white shadow-md text-[#67B142] text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Commencez Maintenant
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#67B142] to-[#34A853] bg-clip-text text-transparent mb-8">
              Prêt à commencer ?
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 mb-12">
              Découvrez comment notre solution peut transformer votre
              communication par SMS.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#67B142] to-[#34A853] hover:from-[#34A853] hover:to-[#67B142] shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg px-8 py-6 h-auto rounded-xl group"
                asChild
              >
                <Link href="/signin">
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-[#67B142] text-[#67B142] hover:bg-[#67B142]/5 shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6 h-auto rounded-xl group"
                asChild
              >
                <Link href="/contact">
                  Nous contacter
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
