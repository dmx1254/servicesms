"use client";

import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const testimonials = [
  {
    id: 1,
    name: "Moussa Diop",
    role: "Directeur Marketing, TechSenegal",
    content:
      "La plateforme nous a permis d'augmenter notre taux d'engagement client de 150%. Le support est réactif et l'interface est très intuitive.",
    rating: 5,
  },
  {
    id: 2,
    name: "Fatou Sow",
    role: "CEO, Digital Africa",
    content:
      "Nous utilisons cette solution depuis 6 mois et les résultats sont impressionnants. La fiabilité du service et la qualité du support sont exceptionnelles.",
    rating: 5,
  },
  {
    id: 3,
    name: "Amadou Kane",
    role: "Responsable Commercial, SendExpress",
    content:
      "L'intégration a été simple et rapide. Nos campagnes SMS sont maintenant plus efficaces et nous avons un meilleur suivi de nos actions marketing.",
    rating: 5,
  },
  {
    id: 4,
    name: "Mouhamed Ndiaye",
    role: "Directeur Marketing, TechSenegal",
    content:
      "Nous utilisons cette solution depuis 6 mois et les résultats sont impressionnants. La fiabilité du service et la qualité du support sont exceptionnelles.",
    rating: 5,
  },
  {
    id: 5,
    name: "Issa Sarr",
    role: "Adjoint Directeur, Système D",
    content:
      "Nous utilisons cette solution depuis 6 mois et les résultats sont impressionnants. La fiabilité du service et la qualité du support sont exceptionnelles.",
    rating: 5,
  },
  {
    id: 6,
    name: "Moustapha Ndiaye",
    role: "Directeur, Système D",
    content:
      "Nous utilisons cette solution depuis 6 mois et les résultats sont impressionnants. La fiabilité du service et la qualité du support sont exceptionnelles.",
    rating: 5,
  },
];

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const TestimonialCard = ({
  name,
  role,
  content,
  rating,
}: (typeof testimonials)[0]) => (
  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden h-[250px] w-full flex flex-col">
    <div className="absolute top-6 right-6 sm:top-8 sm:right-8 text-[#67B142] opacity-20">
      <Quote size={24} className="sm:w-[30px] sm:h-[30px]" />
    </div>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#67B142] flex items-center justify-center text-white text-base sm:text-lg font-bold">
        {getInitials(name)}
      </div>
      <div>
        <h4 className="font-bold text-sm sm:text-base text-gray-900">{name}</h4>
        <p className="text-[#67B142] text-xs sm:text-sm font-medium">{role}</p>
      </div>
    </div>
    <div className="flex mb-3 sm:mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
      ))}
    </div>
    <p className="text-gray-600 leading-relaxed text-sm sm:text-base italic flex-grow">
      &ldquo;{content}&rdquo;
    </p>
  </div>
);

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + (isMobile ? 1 : 3) >= testimonials.length ? 0 : prevIndex + (isMobile ? 1 : 3)
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - (isMobile ? 1 : 3) < 0 ? Math.max(0, testimonials.length - (isMobile ? 1 : 3)) : prevIndex - (isMobile ? 1 : 3)
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isMobile]);

  return (
    <section
      id="testimonials"
      className="py-8 sm:py-12 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Ce que nos clients disent
          </h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez les retours d&apos;expérience de nos clients qui utilisent
            notre plateforme au quotidien
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-4 sm:gap-8"
              animate={{ x: `-${currentIndex * (isMobile ? 100 : 33.333)}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className={`${isMobile ? 'w-full' : 'w-1/3'} flex-shrink-0`}>
                  <TestimonialCard {...testimonial} />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-[#67B142] transition-colors"
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-[#67B142] transition-colors"
          >
            <ChevronRight size={20} className="sm:w-6 sm:h-6" />
          </button>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-6 sm:mt-8">
            {Array.from({ length: Math.ceil(testimonials.length / (isMobile ? 1 : 3)) }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * (isMobile ? 1 : 3))}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    index === Math.floor(currentIndex / (isMobile ? 1 : 3))
                      ? "bg-[#67B142] scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Aller au groupe de témoignages ${index + 1}`}
                />
              )
            )}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8 sm:mt-16"
        >
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
            Rejoignez plus de 100 entreprises qui nous font confiance
          </p>
          <Button
            className="px-6 sm:px-8 py-4 sm:py-6 bg-[#67B142] text-white rounded-[6px] hover:bg-[#4e8a2f] transition-colors font-medium text-sm sm:text-base"
            asChild
          >
            <Link href="/signup">Commencer maintenant</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
