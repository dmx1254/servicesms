"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Building2, GraduationCap, Truck, Store, Megaphone, Hotel } from "lucide-react";

const industries = [
  {
    id: "education",
    title: "SMS éducatifs pour enseignement",
    description: "Solutions SMS adaptées aux établissements d'enseignement pour une communication efficace avec les étudiants et les parents.",
    features: [
      "Communication des absences et retards",
      "Rappels d'événements scolaires",
      "Notifications d'urgence",
      "Suivi des devoirs et examens"
    ],
    image: "/images/metiers.png",
    icon: <GraduationCap className="w-6 h-6" />
  },
  {
    id: "associations",
    title: "SMS pros pour associations",
    description: "Outils de communication SMS pour gérer efficacement vos relations avec les membres et bénévoles.",
    features: [
      "Gestion des adhésions",
      "Organisation d'événements",
      "Campagnes de dons",
      "Communication interne"
    ],
    image: "/images/metiers.png",
    icon: <Building2 className="w-6 h-6" />
  },
  {
    id: "logistique",
    title: "SMS logistique et transport",
    description: "Solutions SMS pour optimiser vos opérations logistiques et la communication avec vos clients.",
    features: [
      "Suivi des livraisons",
      "Notifications de statut",
      "Coordination des équipes",
      "Confirmations de rendez-vous"
    ],
    image: "/images/metiers.png",
    icon: <Truck className="w-6 h-6" />
  },
  {
    id: "commerce",
    title: "SMS pour commerces locaux",
    description: "Services SMS personnalisés pour développer votre activité locale et fidéliser vos clients.",
    features: [
      "Promotions personnalisées",
      "Programme de fidélité",
      "Rappels de rendez-vous",
      "Enquêtes de satisfaction"
    ],
    image: "/images/metiers.png",
    icon: <Store className="w-6 h-6" />
  },
  {
    id: "promotion",
    title: "SMS promotionnels, communication",
    description: "Stratégies SMS marketing pour augmenter vos ventes et engager vos clients.",
    features: [
      "Campagnes marketing",
      "Offres spéciales",
      "Newsletters SMS",
      "Analyses de performance"
    ],
    image: "/images/metiers.png",
    icon: <Megaphone className="w-6 h-6" />
  },
  {
    id: "hospitality",
    title: "SMS hôtellerie et restauration",
    description: "Solutions SMS dédiées au secteur de l'hôtellerie et de la restauration.",
    features: [
      "Réservations et confirmations",
      "Promotions spéciales",
      "Feedback clients",
      "Gestion des commandes"
    ],
    image: "/images/metiers.png",
    icon: <Hotel className="w-6 h-6" />
  }
];

export default function Metiers() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-gray-50 to-white pt-24 pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Solutions SMS par métier
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Découvrez nos solutions SMS adaptées à votre secteur d&apos;activité pour une communication efficace et personnalisée.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button
                size="lg"
                className="bg-[#67B142] hover:bg-[#67B142]/90 text-white px-8"
              >
                Commencer maintenant
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-[#67B142] text-[#67B142] hover:bg-[#67B142]/5 px-8"
              >
                En savoir plus
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Industries Grid */}
      <div className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-2xl bg-[#67B142]/10 text-[#67B142] group-hover:bg-[#67B142]/20 transition-colors">
                    {industry.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#67B142] transition-colors">
                    {industry.title}
                  </h3>
                </div>

                <div className="relative h-48 mb-6 overflow-hidden rounded-2xl">
                  <Image
                    src={industry.image}
                    alt={industry.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <p className="text-gray-600 mb-6">
                  {industry.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {industry.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600">
                      <div className="h-2 w-2 rounded-full bg-[#67B142] mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link 
                  href={`/solutions/${industry.id}`}
                  className="inline-flex items-center text-[#67B142] font-semibold hover:text-[#67B142]/90 transition-colors"
                >
                  En savoir plus
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 bg-[#67B142]/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Prêt à commencer ?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Découvrez comment nos solutions SMS peuvent transformer votre communication professionnelle.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button
                size="lg"
                className="bg-[#67B142] hover:bg-[#67B142]/90 text-white px-8"
              >
                Contactez-nous
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-[#67B142] text-[#67B142] hover:bg-[#67B142]/5 px-8"
              >
                Voir les tarifs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}