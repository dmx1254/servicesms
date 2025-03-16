"use client";

import React from 'react';
import Image from 'next/image';
import { Trophy, Shield, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/app/lib/utils/utils';

const features = [
  {
    icon: <Trophy className="w-8 h-8 text-[#67B142]" />,
    title: "Créez vos campagnes SMS",
    description: "Envoyez des SMS en masse dans plus de 200 pays. Personnalisez le texte et l'émetteur, gérez vos listes de contacts et créez vos modèles de SMS pour vos envois récurrents.",
    image: "/images/features/campaign-preview.png",
    gradient: "from-[#67B142]/10 to-[#34A853]/5"
  },
  // {
  //   icon: <Shield className="w-8 h-8 text-[#67B142]" />,
  //   title: "Restez conforme au RGPD avec le opt-in / opt-out",
  //   description: "Fidélisez vos clients et invitez-les à s'inscrire facilement à vos promotions tout en offrant la possibilité de se désabonner de vos services à tout moment.",
  //   image: "/images/features/rgpd-preview.png",
  //   gradient: "from-[#67B142]/10 to-[#4285F4]/5"
  // },
  {
    icon: <Rocket className="w-8 h-8 text-[#67B142]" />,
    title: "Propulsez la portée de votre communication",
    description: "Programmez vos campagnes SMS et touchez une clientèle internationale. Échangez avec vos clients à chaque étape de leur parcours d'achat.",
    image: "/images/features/stats-preview.png",
    gradient: "from-[#67B142]/10 to-[#EA4335]/5"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function FeaturesSection() {
  return (
    <section className="py-24 md:px-12 px-6 relative overflow-hidden bg-[#67B142]/5">
      {/* Fond avec motif subtil */}
      <div className="absolute inset-0 bg-[linear-gradient(30deg,#67B14210_1px,transparent_1px),linear-gradient(150deg,#67B14210_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="container mx-auto px-4 relative">
        {/* En-tête de section */}
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Des fonctionnalités puissantes
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Découvrez comment notre plateforme peut transformer votre communication
          </motion.p>
        </motion.div>

        {/* Grille de fonctionnalités */}
        <motion.div 
          className="space-y-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className={cn(
                "flex flex-col gap-12",
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse',
                "items-center"
              )}
            >
              {/* Contenu */}
              <div className="flex-1 space-y-6">
                <motion.div 
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-md"
                  whileHover={{ scale: 1.05 }}
                >
                  {feature.icon}
                </motion.div>
                
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#67B142] to-[#34A853]">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Image */}
              <motion.div 
                className="flex-1 relative w-full max-w-xl mx-auto"
                whileHover={{ scale: 1.02 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl transform -rotate-2`}></div>
                <div className="relative bg-white rounded-2xl shadow-lg p-4 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="relative w-full h-[300px] sm:h-[400px] rounded-lg overflow-hidden">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
                      priority
                      className="object-cover object-center"
                    />
                  </div>
                </div>

                {/* Éléments décoratifs */}
                <div className="absolute -z-10 w-full h-full">
                  <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-[#67B142]/10 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#67B142]/5 to-transparent rounded-full blur-xl"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#34A853]/5 to-transparent rounded-full blur-xl"></div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
