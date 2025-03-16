"use client";

import { motion } from "framer-motion";
import { Heart, Rocket, Brain, Users, Coffee, Star, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

interface Job {
  id: number;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
}

const jobs: Job[] = []; // Aucun poste pour le moment

const values = [
  {
    icon: Heart,
    title: "Passion",
    description: "Nous sommes passionnés par l&apos;innovation et l&apos;excellence dans tout ce que nous faisons."
  },
  {
    icon: Brain,
    title: "Innovation",
    description: "Nous repoussons constamment les limites pour créer des solutions SMS avant-gardistes."
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Le travail d&apos;équipe est au cœur de notre succès et de notre culture d&apos;entreprise."
  },
  {
    icon: Coffee,
    title: "Équilibre",
    description: "Nous valorisons l&apos;équilibre entre vie professionnelle et personnelle."
  },
  {
    icon: Rocket,
    title: "Croissance",
    description: "Nous offrons des opportunités de développement personnel et professionnel."
  },
  {
    icon: Star,
    title: "Excellence",
    description: "Nous visons l&apos;excellence dans chaque aspect de notre travail."
  }
];

const JobCard = ({ job }: { job: typeof jobs[0] }) => (
  <motion.div
    variants={fadeIn}
    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
        <p className="text-[#67B142] font-medium">{job.department}</p>
      </div>
      <div className="flex gap-2">
        <span className="px-3 py-1 bg-[#67B142]/10 text-[#67B142] rounded-full text-sm">
          {job.type}
        </span>
      </div>
    </div>
    <p className="text-gray-600 mb-4">{job.description}</p>
    <div className="flex justify-between items-center">
      <span className="text-gray-500 text-sm">{job.location}</span>
      <Link
        href={`/careers/${job.id}`}
        className="inline-flex items-center gap-1 text-[#67B142] hover:text-[#4e8a2f] font-medium"
      >
        Voir l&apos;offre
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  </motion.div>
);

const ValueCard = ({ icon: Icon, title, description }: typeof values[0]) => (
  <motion.div
    variants={fadeIn}
    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
  >
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#67B142]/20 to-[#67B142]/10 flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-[#67B142]" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Hero Section */}
        <motion.div variants={fadeIn} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Rejoignez l&apos;aventure AxiomText
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Ensemble, innovons dans le domaine de la communication SMS professionnelle
            et créons des solutions qui transforment la façon dont les entreprises communiquent.
          </p>
          <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-8">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070"
              alt="L&apos;équipe AxiomText"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <p className="text-2xl font-bold">Une équipe passionnée</p>
              <p className="text-lg">Prête à relever de nouveaux défis</p>
            </div>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div variants={fadeIn} className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Nos valeurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <ValueCard key={index} {...value} />
            ))}
          </div>
        </motion.div>

        {/* Open Positions Section */}
        {jobs.length > 0 ? (
          <motion.div variants={fadeIn}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Postes ouverts
              </h2>
              <span className="px-4 py-2 bg-[#67B142]/10 text-[#67B142] rounded-full font-medium">
                {jobs.length} offres disponibles
              </span>
            </div>
            <div className="grid gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            variants={fadeIn}
            className="text-center py-12 bg-gray-50 rounded-2xl mb-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Aucun poste ouvert actuellement
            </h2>
            <p className="text-gray-600">
              Nous n&apos;avons pas de postes ouverts pour le moment, mais n&apos;hésitez pas à nous envoyer une candidature spontanée !
            </p>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          variants={fadeIn}
          className="mt-16 text-center bg-gradient-to-br from-[#67B142]/10 to-[#67B142]/5 rounded-2xl p-8 md:p-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Vous ne trouvez pas le poste idéal ?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Envoyez-nous une candidature spontanée et découvrons ensemble comment
            vous pouvez contribuer à notre mission.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#67B142] text-white rounded-[6px] hover:bg-[#4e8a2f] transition-colors border-2 border-[#67B142] hover:border-[#4e8a2f]"
          >
            Contactez-nous
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
