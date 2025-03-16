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

export default function PrivacyPolicyPage() {
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
          POLITIQUE DE PROTECTION DES DONNÉES PERSONNELLES
        </motion.h1>
        <motion.div variants={fadeIn} className="text-gray-600 mb-12 text-center text-lg md:text-xl">
          <Link href="https://www.axiomtext.com" className="text-[#67B142] hover:text-[#4e8a2f] transition-colors duration-200">
            www.axiomtext.com
          </Link>
        </motion.div>

        <motion.div variants={fadeIn} className="prose prose-lg max-w-none">
          <div className="text-lg md:text-xl leading-relaxed space-y-8">
            <p className="text-gray-700">
              Cette politique de confidentialité s&apos;applique à l&apos;ensemble de la plateforme éditée par la société AxiomText, dont le siège social est situé à Ouakam/Dakar - N.I.N.E.A : 008960230 et immatriculée au Registre du Commerce sous le numéro SN.DKR.2021. A.2087, représentée par SYLLA Harouna en tant que Président. Cela inclut notamment la plateforme accessible à l&apos;adresse URL : {" "}
              <Link href="https://www.axiomtext.com" className="text-[#67B142] hover:text-[#4e8a2f] transition-colors duration-200">
                https://www.axiomtext.com
              </Link>
              .
            </p>

            <p className="text-gray-700">
              Lorsque vous utilisez la plateforme axiomtext.com ou nos solutions, vous nous fournissez des données, dont certaines sont considérées comme des &quot;données à caractère personnel&quot;. Conformément aux lois et règlements en vigueur, notamment la loi n° 2008-12 du 25 janvier 2008 sur la protection des données à caractère personnel, notre politique de confidentialité explique :
            </p>

            <ul className="list-disc pl-8 text-gray-700 space-y-4">
              <li>Quelles données personnelles sont collectées et comment elles sont recueillies,</li>
              <li>Les raisons pour lesquelles ces données sont collectées,</li>
              <li>Qui peut accéder à ces données et combien de temps elles seront conservées,</li>
              <li>Qui est responsable du traitement des données,</li>
              <li>La base juridique sur laquelle la collecte des données est fondée,</li>
              <li>Les mesures de protection mises en place pour assurer la sécurité de vos données,</li>
              <li>Les droits dont vous disposez en ce qui concerne vos données.</li>
            </ul>

            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Identité du responsable de traitement</h2>
              <p className="text-gray-700">
                La société AxiomText, dont le siège social est situé à Ouakam/Dakar et immatriculée au registre du commerce sous le numéro SN.DKR.2021.A.2087, est le responsable du traitement des données.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Finalités de traitement et bases légales</h2>
              <p className="text-gray-700 mb-6">Les données que vous nous transmettez sont utilisées dans les buts suivants :</p>
              <ul className="list-disc pl-8 text-gray-700 space-y-4">
                <li>La création de votre compte axiomtext.com suite à votre demande d&apos;inscription à l&apos;une de nos Solutions, la gestion et le suivi de notre relation, notamment en tant que client si vous souscrivez à l&apos;une de nos Solutions, ainsi que pour assurer le bon fonctionnement des Solutions. Dans ce cas, le traitement est basé sur l&apos;exécution du contrat auquel vous avez souscrit.</li>
                <li>La réponse à vos demandes d&apos;informations. Dans ce cas, le traitement est basé sur notre intérêt légitime à répondre à vos questions.</li>
                <li>L&apos;envoi d&apos;informations relatives à votre compte et aux Solutions que vous utilisez. Dans ce cas, le traitement est basé sur l&apos;exécution du contrat auquel vous avez souscrit.</li>
                <li>La lutte contre la fraude. Dans ce cas, le traitement est basé sur notre intérêt légitime à identifier les fraudeurs qui utilisent nos Solutions de manière illégale, en collectant les adresses IP et en bloquant potentiellement leur accès au niveau de l&apos;application ou du pare-feu.</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Catégorie des données collectées</h2>
              <p className="text-gray-700 mb-6">Lorsque vous consultez la plateforme, nous pouvons collecter différents types de données, notamment :</p>
              <ul className="list-disc pl-8 text-gray-700 space-y-4">
                <li>Les données transmises directement</li>
                <li>Les données collectées automatiquement</li>
                <li>Données d&apos;identité (nom et prénom)</li>
                <li>Données professionnelles (nom et adresse de l&apos;entreprise)</li>
                <li>Données de contact (numéro de téléphone, adresse e-mail)</li>
                <li>Votre adresse IP</li>
                <li>Données de connexion (cookies, adresse IP)</li>
                <li>Données transmises via les SMS envoyés à vos clients</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Destinataires</h2>
              <p className="text-gray-700">
                Nous sommes les principaux destinataires de vos données, dans le cadre du traitement de vos commandes et de la gestion de la relation client. Plus précisément, en interne, les destinataires sont les suivants : le service informatique, le service client et le service de communication.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Durée de conservation</h2>
              <p className="text-gray-700">
                Nous ne conservons pas vos données personnelles au-delà de la durée nécessaire pour atteindre la finalité pour laquelle elles ont été collectées. Les durées de conservation varient selon le type de données et leur utilisation.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Sécurité et confidentialité des données personnelles</h2>
              <p className="text-gray-700">
                La société AxiomText s&apos;engage à mettre en place les mesures de sécurité techniques et organisationnelles nécessaires pour assurer un niveau de sécurité approprié aux données personnelles confiées par le client. Tous nos employés sont conscients de l&apos;importance de la sécurité de vos données.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Vos droits concernant vos données personnelles</h2>
              <p className="text-gray-700 mb-6">En ce qui concerne le traitement de vos données, vous avez les droits suivants :</p>
              <ul className="list-disc pl-8 text-gray-700 space-y-4">
                <li>Le droit d&apos;accéder à vos données</li>
                <li>Le droit de rectifier vos données</li>
                <li>Le droit de limiter le traitement de vos données</li>
                <li>Le droit de supprimer vos données</li>
                <li>Le droit de vous opposer au traitement de vos données</li>
                <li>Le droit de retirer votre consentement pour les traitements basés sur ce consentement</li>
                <li>Le droit à la portabilité des données brutes que vous avez fournies à AxiomText</li>
              </ul>

              <p className="text-gray-700 mt-8">
                L&apos;utilisateur a également le droit de déposer une réclamation auprès de la CPD dont les coordonnées sont disponibles à l&apos;adresse internet{" "}
                <Link href="https://www.cdp.sn" className="text-[#67B142] hover:text-[#4e8a2f] transition-colors duration-200">
                  https://www.cdp.sn
                </Link>
              </p>

              <p className="text-gray-700 mt-8">
                Afin de répondre à votre demande, nous aurons besoin de vérifier votre identité. Par conséquent, nous pourrions vous demander une copie d&apos;une pièce d&apos;identité comportant votre signature. Veuillez également préciser l&apos;adresse à laquelle vous souhaitez recevoir la réponse.
              </p>

              <p className="text-gray-700 mt-8">
                Nous vous enverrons une réponse dans un délai maximum d&apos;un (1) mois à compter de la réception de votre demande.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
