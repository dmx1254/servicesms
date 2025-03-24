"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useScopedI18n } from "@/locales/client";

const companies = [
  { name: "pmn", logo: "/images/trust/pmn.png" },
  { name: "Sunuy artisan", logo: "/images/trust/sunuy-artisan.png" },
  { name: "AEEB", logo: "/images/trust/aeeb.png" },
  { name: "ASFO", logo: "/images/trust/asfo.png" },
  { name: "Namibienne", logo: "/images/trust/namibienne.png" },
  { name: "Podor Vert", logo: "/images/trust/podor_vert.png" },
  { name: "AMEERGC", logo: "/images/trust/ameergc.png" },
  { name: "AMEEO", logo: "/images/trust/ameeo.png" },
  { name: "CPSD", logo: "/images/trust/cpsd.png" },
  { name: "Phenix", logo: "/images/trust/phenix.png" },
  { name: "Sokhna Diarra", logo: "/images/trust/sokhna-diarra.png" },
];

// Diviser les entreprises en groupes de 6
const itemsPerPage = 6;
const totalPages = Math.ceil(companies.length / itemsPerPage);

export default function TrustedBy() {
  const tScope = useScopedI18n("trustby");
  const [currentPage, setCurrentPage] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Pagination automatique
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoPlay]);

  // Obtenir les entreprises pour la page actuelle
  const getCurrentCompanies = () => {
    const start = currentPage * itemsPerPage;
    return companies.slice(start, start + itemsPerPage);
  };

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
    setAutoPlay(false);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    setAutoPlay(false);
  };

  const goToPage = (pageIndex: number) => {
    setCurrentPage(pageIndex);
    setAutoPlay(false);
  };

  return (
    <section className="py-24 md:px-12 px-6 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Motif de fond */}
      <div className="absolute inset-0 bg-[linear-gradient(30deg,#67B14205_1px,transparent_1px),linear-gradient(150deg,#67B14205_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Cercles décoratifs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#67B142]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#34A853]/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#67B142]/10 text-[#67B142] text-sm font-medium mb-4">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {tScope("title")}
          </span>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#67B142] to-[#34A853] bg-clip-text text-transparent">
            {tScope("desc1")}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {tScope("desc2")}
          </p>
        </motion.div>

        {/* Carrousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevPage}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 lg:-translate-x-12 z-10 bg-white p-1.5 md:p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 hover:text-[#67B142]"
          >
            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
          </button>
          <button
            onClick={nextPage}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 lg:translate-x-12 z-10 bg-white p-1.5 md:p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 hover:text-[#67B142]"
          >
            <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
          </button>

          {/* Logos Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-wrap md:flex-nowrap items-center justify-center md:justify-between gap-4 px-4 md:px-8"
            >
              {getCurrentCompanies().map((company) => (
                <motion.div
                  key={company.name}
                  className="group relative w-[100px] md:w-[120px] h-[60px] md:h-[80px] bg-white rounded-[6px] p-2 flex items-center justify-center shadow-sm hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Effet de survol */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#67B142]/5 to-[#34A853]/5 rounded-[6px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Logo */}
                  <div className="relative w-full h-full">
                    <Image
                      src={company.logo}
                      alt={`${company.name} logo`}
                      fill
                      sizes="(max-width: 768px) 100px, 120px"
                      className="object-contain p-1 filter group-hover:brightness-110 transition-all duration-300"
                    />
                  </div>

                  {/* Tooltip - Caché sur mobile */}
                  <div className="hidden md:block absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded-full whitespace-nowrap">
                      {company.name}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination Dots */}
          <div className="flex justify-center items-center space-x-2 mt-12">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentPage === index
                    ? "bg-[#67B142] w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Aller à la page ${index + 1}`}
              />
            ))}
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`mt-6 mx-auto flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
              autoPlay
                ? "bg-[#67B142]/10 text-[#67B142]"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {autoPlay ? tScope("pause") : tScope("auto")}
          </button>
        </div>
      </div>
    </section>
  );
}
