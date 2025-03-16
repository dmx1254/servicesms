"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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

const browsers = [
  {
    name: "Internet Explorer",
    icon: "ie",
    instructions:
      "Accédez à l'onglet \"Outils\" (représenté par une icône en forme de rouage située en haut à droite) / options internet. Sélectionnez l'onglet \"Confidentialité\" et choisissez l'option \"Bloquer tous les cookies\". Cliquez sur \"Ok\" pour valider les modifications.",
  },
  {
    name: "Firefox",
    icon: "firefox",
    instructions:
      "Cliquez sur le bouton Firefox en haut de la fenêtre du navigateur, puis sélectionnez l'onglet Options. Choisissez ensuite l'onglet Vie privée. Dans la section Règles de conservation, sélectionnez \"Utiliser les paramètres personnalisés pour l'historique\". Enfin, décochez la case pour désactiver les cookies.",
  },
  {
    name: "Safari",
    icon: "safari",
    instructions:
      "Cliquez sur le pictogramme de menu en haut à droite du navigateur (représenté par un rouage). Sélectionnez l'option \"Préférences\". Cliquez sur l'onglet \"Avancé\" pour afficher les paramètres avancés. Dans la section \"Confidentialité\", cliquez sur \"Paramètres de contenu\". Dans la section \"Cookies\", vous avez la possibilité de bloquer les cookies.",
  },
  {
    name: "Chrome",
    icon: "chrome",
    instructions:
      "Cliquez sur le pictogramme de menu en haut à droite du navigateur (représenté par trois lignes horizontales). Sélectionnez l'option \"Paramètres\". Faites défiler jusqu'en bas de la page et cliquez sur \"Afficher les paramètres avancés\". Dans la section \"Confidentialité\", cliquez sur \"Paramètres de contenu\". Dans l'onglet \"Cookies\", vous avez la possibilité de bloquer les cookies.",
  },
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 sm:py-24">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"
      >
        <motion.h1
          variants={fadeIn}
          className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 text-center mb-8"
        >
          UTILISATION DES COOKIES
        </motion.h1>

        <motion.div variants={fadeIn} className="prose prose-lg max-w-none">
          <div className="text-lg md:text-xl leading-relaxed space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <p className="text-gray-700">
                Lorsque vous naviguez sur le site{" "}
                <Link href="https://www.axiomtext.com" className="text-[#67B142] hover:text-[#4e8a2f] transition-colors duration-200">
                  www.axiomtext.com
                </Link>
                , des cookies peuvent être installés sur votre ordinateur. Un cookie est un petit fichier qui ne permet pas d&apos;identifier l&apos;utilisateur, mais enregistre des informations sur la navigation d&apos;un ordinateur sur un site. Les données ainsi obtenues ont pour objectif de faciliter la navigation ultérieure sur le site et sont également utilisées pour effectuer des mesures de fréquentation.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Types de cookies utilisés</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">1.1. Cookies nécessaires à la navigation sur le site</h3>
                  <p className="text-gray-700">
                    Ces cookies sont indispensables au bon fonctionnement du site axiomtext.com. Ils permettent l&apos;utilisation des fonctionnalités principales du site.
                    Sans ces cookies, les utilisateurs ne pourront pas naviguer sur le site normalement.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">1.2. Cookies fonctionnels</h3>
                  <p className="text-gray-700">
                    Ces cookies permettent de personnaliser l&apos;expérience utilisateur.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">1.3. Cookies analytiques</h3>
                  <p className="text-gray-700">
                    Ces cookies permettent d&apos;obtenir des informations sur l&apos;utilisation et les performances du site, afin d&apos;améliorer son fonctionnement. Ils permettent d&apos;effectuer des analyses de fréquentation des pages d&apos;information, de suivre les taux d&apos;ouverture, les taux de clics et les taux de rebond au niveau individuel.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Gestion des cookies</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Les utilisateurs ont la possibilité d&apos;accepter ou de refuser les cookies sur le site, ou de les refuser définitivement en configurant leur navigateur.
                </p>
                <p>
                  Si un utilisateur choisit de refuser tous les cookies, certaines pages du site pourraient ne pas être accessibles.
                </p>
                <p>
                  Les modalités de suppression des cookies varient en fonction du navigateur utilisé par les utilisateurs (veuillez vous référer aux indications présentes dans le menu des navigateurs).
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Durée de vie des cookies</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Les cookies sont enregistrés sur le terminal de l&apos;utilisateur pour une durée maximale de 13 mois à partir du moment où l&apos;utilisateur a donné son consentement.
                </p>
                <p>
                  À l&apos;expiration de cette période, le consentement de l&apos;utilisateur sera à nouveau demandé.
                </p>
                <p>
                  Le refus d&apos;accepter l&apos;installation d&apos;un cookie peut entraîner l&apos;impossibilité d&apos;accéder à certains services. Cependant, l&apos;utilisateur a la possibilité de configurer son ordinateur pour refuser l&apos;installation des cookies en suivant les étapes ci-dessous.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Configuration par navigateur</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {browsers.map((browser, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-2xl">{browser.name}</span>
                    </h3>
                    <p className="text-gray-700">{browser.instructions}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
