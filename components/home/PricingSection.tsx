"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/app/lib/utils/utils";
import Link from "next/link";

type PricingTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
  color: string;
  gradient: string;
  popular?: boolean;
};

const pricingTiers: PricingTier[] = [
  {
    name: "CLASSIQUE",
    price: "250.000",
    description: "Envois SMS réguliers : solution parfaite",
    features: [
      "Support clients de 9h à 18h, 5j/7",
      "Plateforme SaaS SMS en libre accès",
      "Un accès à l'API",
      "Un envoi de SMS en illimité",
    ],
    color: "text-[#67B142]",
    gradient: "from-[#67B142]/10 to-[#34A853]/10",
  },
  {
    name: "MEDIUM",
    price: "500.000",
    description: "Meilleure solution pour un usage avancé",
    features: [
      "Support clients 24/7, 365j/365",
      "Plateforme SaaS SMS en libre accès",
      "Un accès à l'API",
      "Un envoi de SMS en illimité",
    ],
    color: "text-blue-500",
    gradient: "from-blue-500/10 to-blue-700/10",
    popular: true,
  },
  {
    name: "PREMIUM",
    price: "1.000.000",
    description: "Parfait pour les Grands Comptes",
    features: [
      "Support clients 24/7, 365j/365",
      "Plateforme SaaS SMS en libre accès",
      "Un accès à l'API",
      "Chargé de projet dédié",
      "Un envoi de SMS en illimité",
    ],
    color: "text-purple-500",
    gradient: "from-purple-500/10 to-indigo-600/10",
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#67B142] to-[#34A853] mb-4"
          >
            Tarifs simples et transparents
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-muted-foreground"
          >
            Choisissez le forfait qui correspond à vos besoins
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div
                className={cn(
                  "relative h-full rounded-[30px] p-8 shadow-lg border border-muted transition-transform duration-300 hover:scale-105",
                  tier.popular ? "bg-gradient-to-b from-[#67B142]/5 to-transparent" : "bg-white"
                )}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-[#67B142] text-white text-sm font-medium px-4 py-1 rounded-full">
                      Plus populaire
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className={cn("text-2xl font-bold mb-2", tier.color)}>
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground">SMS/ans</span>
                  </div>
                  <p className="text-muted-foreground">{tier.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className={cn("p-1 rounded-full", tier.gradient)}>
                        <Check className={cn("w-4 h-4", tier.color)} />
                      </div>
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <Button
                  className={cn(
                    "w-full rounded-xl bg-gradient-to-r text-white",
                    tier.popular
                      ? "from-[#67B142] to-[#34A853] hover:opacity-90"
                      : "from-gray-800 to-gray-700 hover:opacity-90"
                  )}
                >
                  Commencer maintenant
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground">
            Besoin d&apos;un forfait personnalisé ?{" "}
            <Link href="/contact" className="text-[#67B142] font-medium hover:underline">
              Contactez-nous
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
} 