"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { UserPlus, Users, Send, BarChart3, CheckCircle2 } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

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

const ImagePreview = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-br from-[#67B142]/5 via-white to-[#67B142]/5 z-0" />
    <div className="absolute inset-0 flex items-center justify-center p-8 z-10">
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          className="object-contain drop-shadow-xl group-hover:scale-102 transition-transform duration-500"
        />
      </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/80 to-transparent p-4 text-gray-600 text-center">
      <p className="text-sm font-medium">{alt}</p>
    </div>
  </div>
);

const Step = ({
  number,
  title,
  children,
  icon: Icon,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  icon: LucideIcon;
}) => (
  <motion.div
    variants={fadeIn}
    className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 hover:border-[#67B142]/20 hover:shadow-md transition-all duration-300"
  >
    <div className="flex items-start gap-6">
      <div className="flex-shrink-0">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#67B142]/20 to-[#67B142]/10 flex items-center justify-center">
          <Icon className="w-8 h-8 text-[#67B142]" />
        </div>
      </div>
      <div className="flex-grow">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[#67B142] font-mono text-lg font-bold">
            ÉTAPE {number}
          </span>
          <div className="h-px flex-grow bg-gradient-to-r from-[#67B142]/20 to-transparent" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          {title}
        </h2>
        <div className="space-y-4 text-gray-700 text-lg">{children}</div>
      </div>
    </div>
  </motion.div>
);

export default function HowItWorksPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 sm:py-24">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={fadeIn} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Comment ça marche ?
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Suivez le guide, et réalisez vos campagnes SMS en seulement 4 étapes
          </p>
        </motion.div>

        <div className="grid gap-8 relative">
          <div className="absolute top-24 bottom-24 left-8 w-px bg-gradient-to-b from-transparent via-[#67B142]/20 to-transparent md:block hidden" />

          <Step number="1" title="Créez votre compte" icon={UserPlus}>
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <p>
                  Complétez le formulaire d&apos;inscription en fournissant
                  votre adresse e-mail et votre numéro de téléphone. Votre
                  compte sera créé sans aucun engagement.
                </p>
                <div className="p-4 bg-[#67B142]/5 rounded-xl border border-[#67B142]/10">
                  <p className="text-[#4e8a2f] font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    Clause de confidentialité : Soyez assuré(e)
                    qu&apos;AxiomText s&apos;engage à ne jamais exploiter vos
                    informations personnelles à des fins de marketing ni à les
                    divulguer à des tiers.
                  </p>
                </div>
              </div>
              <ImagePreview
                src="/images/account.png"
                alt="Interface de création de compte"
              />
            </div>
          </Step>

          <Step
            number="2"
            title="Importez facilement votre liste de contacts SMS"
            icon={Users}
          >
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <p>
                  Intégrez rapidement vos listes de contacts, gérez facilement
                  les listes noires, les champs de publipostage et les filtres
                  de segmentation.
                </p>
                <p>
                  Profitez également de fonctions de recherche avancées et de
                  puissantes fonctionnalités d&apos;import/export. Les doublons
                  et les numéros erronés sont automatiquement supprimés.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-[#4e8a2f]">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    Import Excel/CSV
                  </li>
                  <li className="flex items-center gap-2 text-[#4e8a2f]">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    Nettoyage automatique
                  </li>
                  <li className="flex items-center gap-2 text-[#4e8a2f]">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    Segmentation avancée
                  </li>
                </ul>
              </div>
              <ImagePreview
                src="/images/features/contacts.png"
                alt="Gestion des contacts et import de données"
              />
            </div>
          </Step>

          <Step
            number="3"
            title="Lancez votre campagne SMS dès maintenant"
            icon={Send}
          >
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <p>
                  Rédigez votre message sur une interface conviviale et
                  intuitive. Personnalisez l&apos;émetteur, choisissez entre un
                  envoi immédiat ou programmé, et utilisez des modèles
                  réutilisables avec des champs de publipostage pour
                  personnaliser vos envois.
                </p>
                <div className="bg-gray-50 p-6 rounded-xl font-mono text-sm border border-gray-200 relative">
                  <div className="absolute -top-3 left-4 px-2 bg-white text-xs text-gray-500">
                    Exemple de message
                  </div>
                  &quot;Bonjour M. #NOM#, nous vous invitons à notre journée
                  d&apos;intégration qui se tiendra le samedi 28 janvier
                  2023.&quot;
                </div>
                <button
                  onClick={() => router.push("/dashboard/campaigns/new")}
                  className="inline-flex rounded-[6px] items-center gap-2 px-4 py-2 bg-[#67B142] text-white hover:bg-[#4e8a2f] transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Testez et envoyez votre message
                </button>
              </div>
              <ImagePreview
                src="/images/features/campaign-preview.png"
                alt="Interface de création de campagne SMS"
              />
            </div>
          </Step>

          <Step
            number="4"
            title="Consultez les statistiques de vos campagnes en toute simplicité"
            icon={BarChart3}
          >
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <p>
                  Obtenez des rapports statistiques précis sur vos campagnes, y
                  compris les volumes de SMS envoyés en temps réel, grâce à des
                  fonctionnalités de filtrage avancées.
                </p>
                <p>
                  Dans votre espace client, vous trouverez également des
                  informations détaillées, par numéro, sur la délivrabilité de
                  vos SMS.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-[#67B142]/5 rounded-xl text-center">
                    <div className="text-2xl font-bold text-[#67B142]">
                      100%
                    </div>
                    <div className="text-sm text-gray-600">
                      Taux de livraison
                    </div>
                  </div>
                  <div className="p-4 bg-[#67B142]/5 rounded-xl text-center">
                    <div className="text-2xl font-bold text-[#67B142]">
                      24/7
                    </div>
                    <div className="text-sm text-gray-600">
                      Suivi en temps réel
                    </div>
                  </div>
                  <div className="p-4 bg-[#67B142]/5 rounded-xl text-center">
                    <div className="text-2xl font-bold text-[#67B142]">CSV</div>
                    <div className="text-sm text-gray-600">
                      Export des rapports
                    </div>
                  </div>
                </div>
              </div>
              <ImagePreview
                src="/images/features/stats-preview.png"
                alt="Tableau de bord des statistiques"
              />
            </div>
          </Step>
        </div>
      </motion.div>
    </div>
  );
}
