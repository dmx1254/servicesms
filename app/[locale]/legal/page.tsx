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

export default function LegalPage() {
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
          MENTIONS LÉGALES
        </motion.h1>

        <motion.div variants={fadeIn} className="text-gray-700 mb-12 text-center text-lg md:text-xl">
          <Link href="https://www.axiomtext.com" className="text-[#67B142] hover:text-[#4e8a2f] transition-colors duration-200">
            www.axiomtext.com
          </Link>
        </motion.div>

        <motion.div variants={fadeIn} className="prose prose-lg max-w-none">
          <div className="text-lg md:text-xl leading-relaxed space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Présentation du site</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  La société AxiomText, établie à Ouakam Dakar avec le numéro NINEA : 008960230 et enregistrée au Registre du Commerce sous le numéro SN.DKR.2021. A.2087.
                   {/* est représentée par Monsieur Harouna SYLLA, Président-Fondateur. */}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="font-semibold">Conception du Site :</p>
                    <p>AxiomText</p>
                  </div>
                  <div>
                    <p className="font-semibold">Réalisation du Site :</p>
                    <p>AxiomText</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">Propriétaire du site :</p>
                  <p>
                    Le site internet www.axiomtext.com est édité par la société AxiomText dont le siège est situé Dakar-Ouakam avenue Cheikh Oumar Foutiyou Tall.
                  </p>
                </div>
                {/* <div className="space-y-2">
                  <p className="font-semibold">Responsable publication :</p>
                  <p>Harouna SYLLA, Président</p>
                </div> */}
                {/* <div className="space-y-2">
                  <p className="font-semibold">Hébergeur :</p>
                  <p>
                    Le site https://www.axiomtext.com est hébergé par : DigitalOcean, Inc.
                    est un fournisseur américain d&apos;infrastructure cloud basé à New York
                    101 Avenue of the Americas 10th Floor New York, NY 10013 États-Unis
                  </p>
                </div> */}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Les droits de propriété d&apos;AxiomText</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  La plateforme et nos solutions fournies par axiomtext.com sont la propriété d&apos;AxiomText. Les noms, logos, marques, présentations commerciales, arrangements, interfaces visuelles, graphiques, conception, compilation, informations, données, solutions et tous les autres éléments de la plateforme et nos solutions que nous fournissons sont protégés par des lois sur la propriété intellectuelle et d&apos;autres lois applicables.
                </p>
                <p>
                  La propriété de tous les éléments présents dans la plateforme et nos solutions appartient à AxiomText. Vous êtes autorisé(e) à utiliser la plateforme et nos solutions uniquement de la manière expressément autorisée par AxiomText et conformément aux conditions générales d&apos;utilisation. Vous devez respecter et préserver tous les avis, informations et restrictions de propriété intellectuelle présents dans la plateforme et nos solutions. AxiomText se réserve tous les droits sur la plateforme et nos solutions qui ne sont pas expressément accordés dans les conditions générales d&apos;utilisation.
                </p>
                <p>
                  Si vous décidez de nous fournir des commentaires et des suggestions concernant notre plateforme et nos solutions (ci-après désignés par &quot;Commentaires&quot;), vous nous accordez par la présente une licence illimitée, perpétuelle, irrévocable, non exclusive, entièrement payée, libre de redevances, pour exploiter les Commentaires de toutes les manières possibles et à toutes fins utiles, y compris l&apos;amélioration de la plateforme et de nos solutions, ainsi que la création de nouveaux produits.
                </p>
                <p>
                  En nous fournissant votre nom, logos et marques de commerce, vous nous accordez l&apos;autorisation de les inclure dans nos supports de communication promotionnels et marketing.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
