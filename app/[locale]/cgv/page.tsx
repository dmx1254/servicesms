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

const Section = ({ number, title, children }: { number: string; title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 hover:border-[#67B142]/20 transition-colors duration-300">
    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-baseline gap-3">
      <span className="text-[#67B142] font-mono">{number}.</span>
      <span>{title}</span>
    </h2>
    <div className="space-y-4 text-gray-700">{children}</div>
  </div>
);

export default function CGVPage() {
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
          CONDITIONS GÉNÉRALES DE VENTE (CGV)
        </motion.h1>

        <motion.div variants={fadeIn} className="text-gray-700 mb-12 text-center text-lg md:text-xl">
          <Link href="https://www.axiomtext.com" className="text-[#67B142] hover:text-[#4e8a2f] transition-colors duration-200">
            www.axiomtext.com
          </Link>
        </motion.div>

        <motion.div variants={fadeIn} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <p className="text-gray-700">
              Axiomtext.com est un service en ligne fourni par la société AxiomText, dont le siège social est situé à Dakar - Ouakam cité El Hadj Oumar Foutiyou Tall. Ces conditions générales établissent les termes de vente exclusivement en ligne des produits axiomtext.com et sont conclues entre la société AxiomText et le client, également désigné comme l&apos;Utilisateur.
            </p>
            <div className="mt-6 space-y-4">
              <p className="text-gray-700">
                La nullité d&apos;une clause contractuelle n&apos;affecte pas la validité des conditions générales de vente dans leur ensemble. En acceptant ces conditions générales sans réserve, le client est réputé les avoir intégralement acceptées.
              </p>
              <p className="text-gray-700">
                Ces conditions générales de vente sont conformes à la législation sénégalaise et s&apos;appliquent sur le territoire sénégalais. Indépendamment du territoire où le service est utilisé, le client reconnaît se conformer à ces conditions générales de vente et comprend que la prestation est effectuée au Sénégal.
              </p>
            </div>
          </div>

          <Section number="1" title="Identification">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">1.1 – L&apos;identifiant</h3>
                <p>
                  Une fois que le client a passé sa commande en ligne et que son paiement a été validé, il recevra à l&apos;adresse électronique indiquée dans son bon de commande un identifiant. Cet identifiant lui permettra de gérer les produits AxiomText qu&apos;il a commandés, notamment en lui donnant accès à son espace client.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">1.2 – Espace client</h3>
                <p>
                  AxiomText offre au client l&apos;hébergement gratuit de ses bases de données clients et de ses listes de numéros sur ses serveurs. AxiomText s&apos;engage à ne jamais divulguer ni utiliser les bases de données clients hébergées sur ses serveurs. Le client a une totale liberté quant au contenu des SMS, qui est limité à 160 caractères pour l&apos;offre SMS. Il est strictement interdit de publier tout contenu lié directement ou indirectement à la pornographie, aux programmes piratés, aux arnaques, ainsi qu&apos;à tout contenu ayant un caractère antisémite ou profane. AxiomText se réserve le droit de refuser, à tout moment et sans préavis, l&apos;envoi de SMS contenant un contenu jugé non conforme aux lois sénégalaises ou à la netiquette.
                </p>
              </div>
            </div>
          </Section>

          <Section number="2" title="Clauses d'engagements">
            <div className="space-y-4">
              <p>
                Le client s&apos;engage à fournir des informations précises et véridiques lors de son inscription. Il est tenu de signaler à AxiomText tout changement concernant les données fournies et serait entièrement responsable de tout dysfonctionnement éventuel pouvant résulter d&apos;informations erronées. Le client assume la responsabilité exclusive de toute violation de la propriété intellectuelle ou industrielle de tiers, de l&apos;ordre public, des bonnes mœurs, ainsi que de tout autre litige concernant le ou les messages SMS envoyés par la société axiomtext.com.
              </p>
              <p>
                Le choix du contenu des messages SMS incombe exclusivement au client. En aucun cas AxiomText ne peut être tenu responsable des recours liés au contenu diffusé par les messages SMS. Le client est responsable de maintenir une adresse e-mail valide, et les informations peuvent être mises à jour via l&apos;interface Web prévue à cet effet. Le client s&apos;engage à ne pas accéder aux systèmes informatiques d&apos;AxiomText ni à tenter de le faire.
              </p>
              <p>
                Si des informations sont incomplètes, erronées ou si des documents sont manquants, ou si la demande n&apos;est pas conforme à la charte de nommage, AxiomText suspendra la demande et aucun remboursement ou avoir ne sera effectué. Vous disposez d&apos;un délai de 14 jours pour nous fournir les informations nécessaires. Passé ce délai, votre commande sera annulée. Il est possible que nous vous envoyions des informations sur nos produits. Vos coordonnées ne seront en aucun cas fournies à des sociétés tierces.
              </p>
            </div>
          </Section>

          <Section number="3" title="Obligation technique">
            <p>
              AxiomText s&apos;engage à faire tout son possible pour enregistrer et envoyer les messages SMS une fois que le paiement de la commande correspondante a été validé. Cependant, il s&apos;agit d&apos;une obligation de moyens et en aucun cas d&apos;une obligation de résultat.
            </p>
          </Section>

          <Section number="4" title="Retard de paiement">
            <p>
              En cas de défaut de paiement ou de retard de paiement de la part du client, cela entraîne automatiquement la résiliation du contrat en cours. Le client a la possibilité de résilier son abonnement avant son terme en notifiant AxiomText par écrit (lettre recommandée). Cependant, cette résiliation ne donne droit à aucun remboursement.
            </p>
          </Section>

          <Section number="5" title="Prix des prestations">
            <p>
              Les prix des envois, des messages, des SMS et des services proposés sont ceux indiqués sur le bon de commande. AxiomText se réserve le droit de modifier ses prix à tout moment et sans préavis. Toutefois, le prix des services prépayés est garanti pour la période concernée.
            </p>
          </Section>
        </motion.div>
      </motion.div>
    </div>
  );
}
