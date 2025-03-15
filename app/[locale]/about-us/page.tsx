"use client";

import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
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

const engagements = [
  {
    title: "Plateforme efficace",
    items: [
      "Disponibilité 24h/24 et 7j/7",
      "Facile à utiliser",
      "Solutions diversifiées, nombreuses",
    ],
    icon: "🚀",
  },
  {
    title: "Équipe hors pair, unie",
    items: [
      "Un Account Manager dédié",
      "Aide tout temps, campagne",
      "Aide sur mesure, personnalisée",
    ],
    icon: "👥",
  },
  {
    title: "Solution sûre, garantie",
    items: [
      "Plateforme SaaS sûre",
      "Respect PDCP, conforme strict",
      "Données bien protégées",
    ],
    icon: "🔒",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeIn}
            className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20"
          >
            <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                Qui sommes-nous ?
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                Nous sommes une petite équipe qui fait de grandes choses.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="relative overflow-hidden py-8"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeIn} className="mx-auto max-w-prose text-lg">
            <p className="mt-8 text-gray-600">
              axiomtext.com est un service en ligne de premier plan au Sénégal, offrant des services d&apos;envoi de SMS. Il s&apos;est imposé comme un leader incontesté dans le domaine de la communication mobile. Spécialisé dans l&apos;envoi de SMS en masse pour les particuliers et les professionnels, notre entreprise est le chef de file des solutions de messagerie mobile.
            </p>
            <p className="mt-8 text-gray-600">
              Nous sommes là pour accompagner les associations, les amicales et les entreprises dans leur quête de performance, en leur offrant des solutions de communication puissantes et innovantes. Notre objectif est de vous fournir en permanence les meilleures technologies pour vos campagnes SMS et vos opérations de marketing mobile.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="relative bg-[#67B142]/5 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeIn} className="mx-auto max-w-prose text-lg">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Notre mission
            </h2>
            <p className="mt-8 text-gray-600">
              Nous sommes constamment engagés dans l&apos;innovation et notre objectif est de créer des solutions simples et sans tracas pour nos clients. Nous voulons leur permettre de se concentrer sur l&apos;essentiel : faire croître leur entreprise et atteindre leurs objectifs et leur succès.
            </p>
            <p className="mt-8 text-gray-600">
              Nous sommes guidés par des valeurs fondamentales telles que la priorité accordée à l&apos;utilisateur, la transformation de l&apos;expérience client grâce à l&apos;utilisation de canaux de communication plus profonds, pertinents, personnalisés et significatifs.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Engagements Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="relative py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeIn} className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Nos engagements
            </h2>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            className="mx-auto mt-16 max-w-7xl"
          >
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {engagements.map((engagement, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-4xl mb-4">{engagement.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {engagement.title}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {engagement.items.map((item, idx) => (
                      <li key={idx} className="text-gray-600 flex items-center">
                        <span className="text-[#67B142] mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="relative bg-[#67B142]/5 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeIn} className="mx-auto max-w-prose text-lg">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">
              Faites la rencontre de notre équipe en mode 100% à distance
            </h2>
            <p className="mt-8 text-gray-600">
              Notre équipe est constituée de professionnels hautement qualifiés. Nous sommes des individus passionnés et déterminés, dotés d&apos;un esprit d&apos;équipe solide. Ce que nous créons a une valeur immense pour les entreprises de toutes tailles et tous secteurs.
            </p>
            <p className="mt-8 text-gray-600">
              Notre équipe produit est innovante, créative et audacieuse. En tant que créateurs et contributeurs, nous collaborons étroitement avec chaque département pour guider notre entreprise vers l&apos;avenir.
            </p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}