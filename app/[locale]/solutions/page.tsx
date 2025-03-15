"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  MessageSquare,
  Phone,
  FileText,
  Database,
  Mail,
  Ticket,
  ChartBar,
  Vote,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

const solutions = [
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "SMS Pro",
    description:
      "Solution professionnelle d'envoi de SMS en masse avec personnalisation et tracking avancé.",
    href: "/solutions/sms-pro",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: <Phone className="w-8 h-8" />,
    title: "SMS Vocal",
    description:
      "Transformez vos messages en messages vocaux pour une communication plus personnelle.",
    href: "/solutions/sms-vocal",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: "SMS Enrichi",
    description:
      "Enrichissez vos SMS avec des contenus multimédias et des liens interactifs.",
    href: "/solutions/sms-enrichi",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: <Database className="w-8 h-8" />,
    title: "Location Base de Données",
    description:
      "Accédez à des bases de données qualifiées pour vos campagnes marketing.",
    href: "/solutions/location-bdd",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: <Mail className="w-8 h-8" />,
    title: "Mail to SMS",
    description:
      "Convertissez automatiquement vos emails en SMS pour une meilleure délivrabilité.",
    href: "/solutions/mail-to-sms",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: <Ticket className="w-8 h-8" />,
    title: "Mobile Ticketing",
    description:
      "Envoyez des billets et tickets directement sur les mobiles de vos clients.",
    href: "/solutions/mobile-ticketing",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: <ChartBar className="w-8 h-8" />,
    title: "Sondages SMS",
    description:
      "Créez et diffusez des sondages par SMS pour collecter des retours clients.",
    href: "/solutions/sondages-sms",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: <Vote className="w-8 h-8" />,
    title: "Vote SMS",
    description:
      "Organisez des votes et consultations via SMS de manière simple et sécurisée.",
    href: "/solutions/vote-sms",
    gradient: "from-rose-500 to-pink-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function SolutionsPage() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Éléments décoratifs d'arrière-plan */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>

        {/* Cercles décoratifs animés */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-[#67B142]/20 rounded-full mix-blend-multiply filter blur-2xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
          className="absolute -bottom-32 -left-20 w-96 h-96 bg-[#34A853]/20 rounded-full mix-blend-multiply filter blur-2xl"
        />

        {/* Lignes décoratives */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-0 w-72 h-[1px] bg-gradient-to-r from-transparent via-[#67B142]/20 to-transparent transform -rotate-45" />
          <div className="absolute top-1/3 right-0 w-72 h-[1px] bg-gradient-to-r from-transparent via-[#67B142]/20 to-transparent transform rotate-45" />
          <div className="absolute bottom-1/4 left-0 w-72 h-[1px] bg-gradient-to-r from-transparent via-[#34A853]/20 to-transparent transform rotate-45" />
          <div className="absolute bottom-1/3 right-0 w-72 h-[1px] bg-gradient-to-r from-transparent via-[#34A853]/20 to-transparent transform -rotate-45" />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge animé */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center px-4 py-1.5 mb-8 rounded-full text-sm font-medium bg-[#67B142]/10 text-[#67B142] border border-[#67B142]/20"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#67B142] mr-2 animate-pulse" />
              Solutions Innovantes
            </motion.div>

            {/* Titre principal avec animation de texte */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#67B142] to-[#34A853]">
                Nos Solutions SMS
              </span>
            </motion.h1>

            {/* Description avec animation */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-gray-600 text-xl md:text-2xl mb-12 leading-relaxed max-w-3xl mx-auto"
            >
              Découvrez notre gamme complète de solutions SMS pour répondre à
              tous vos besoins de communication et de marketing digital
            </motion.p>

            {/* Ligne décorative */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="h-px w-24 bg-gradient-to-r from-[#67B142]/50 via-[#34A853]/50 to-[#67B142]/50 mx-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-12 px-4">
        <motion.div
          className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {solutions.map((solution, index) => (
            <motion.div key={index} variants={itemVariants} className="group">
              <Link href={solution.href}>
                <div className="relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${solution.gradient}"></div>

                  {/* Content */}
                  <div className="relative">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${solution.gradient} text-white mb-6 transform group-hover:scale-110 transition-transform duration-300`}
                    >
                      {solution.icon}
                    </div>

                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      {solution.title}
                    </h3>

                    <p className="text-gray-600">{solution.description}</p>

                    <div className="mt-6 flex items-center text-[#67B142] font-medium">
                      En savoir plus
                      <svg
                        className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Prêt à commencer ?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Contactez-nous pour découvrir comment nos solutions peuvent
              répondre à vos besoins spécifiques
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-[6px] px-6 py-3 bg-[#67B142] text-white font-medium hover:bg-[#34A853] transition-colors duration-300"
            >
              Nous contacter
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Search Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogTitle className="sr-only">Recherche de solutions</DialogTitle>
        <CommandInput placeholder="Rechercher une solution..." />
        <CommandList>
          <CommandEmpty>Aucune solution trouvée.</CommandEmpty>
          <CommandGroup heading="Solutions">
            {solutions.map((solution) => (
              <CommandItem
                key={solution.title}
                onSelect={() => {
                  router.push(solution.href);
                  setSearchOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  {solution.icon}
                  <div>
                    <div className="font-medium">{solution.title}</div>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {solution.description}
                    </p>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
