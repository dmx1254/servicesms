import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight } from "lucide-react";

interface SolutionLayoutProps {
  title: string;
  description: string;
  mainImage: string;
  features: string[];
  benefits: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
  useCases: {
    title: string;
    description: string;
  }[];
}

export default function SolutionLayout({
  title,
  description,
  mainImage,
  features,
  benefits,
  useCases,
}: SolutionLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-24 pb-32 bg-gradient-to-br from-[#67B142]/5 via-white to-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <div className="mx-auto max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-tight"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-8 text-xl lg:text-2xl leading-relaxed text-gray-600 max-w-3xl"
            >
              {description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12 flex flex-wrap items-center gap-6"
            >
              <Button
                size="lg"
                className="bg-[#67B142] hover:bg-[#67B142]/90 shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6 h-auto rounded-full"
              >
                Prendre rendez-vous
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-[#67B142] text-[#67B142] hover:bg-[#67B142]/5 transition-all duration-300 text-lg px-8 py-6 h-auto rounded-full"
              >
                Voir la démo
              </Button>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-20"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={mainImage}
                alt={title}
                className="w-full object-cover transform hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-16">
              Pourquoi choisir notre solution ?
            </h2>
          </div>
          <div className="mx-auto mt-16">
            <dl className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-start"
                >
                  <div className="rounded-full bg-[#67B142]/10 p-3 mb-6">
                    <CheckCircle2 className="h-8 w-8 text-[#67B142]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature}
                  </h3>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Nos avantages
            </h2>
          </div>
          <div className="mx-auto">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="rounded-2xl bg-[#67B142]/10 p-4 inline-block mb-6">
                    {benefit.icon}
                  </div>
                  <dt className="text-2xl font-semibold text-gray-900 mb-4">
                    {benefit.title}
                  </dt>
                  <dd className="text-lg text-gray-600 leading-relaxed">
                    {benefit.description}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Cas d&apos;utilisation
            </h2>
          </div>
          <div className="mx-auto">
            <dl className="grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-2">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative pl-12 border-l-4 border-[#67B142]"
                >
                  <dt className="text-2xl font-semibold text-gray-900 mb-4">
                    {useCase.title}
                  </dt>
                  <dd className="text-lg text-gray-600 leading-relaxed">
                    {useCase.description}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-32 bg-[#67B142]/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              Prêt à commencer ?
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 mb-12">
              Découvrez comment notre solution peut transformer votre communication
              par SMS.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Button
                size="lg"
                className="bg-[#67B142] hover:bg-[#67B142]/90 shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6 h-auto rounded-full"
              >
                Commencer gratuitement
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-[#67B142] text-[#67B142] hover:bg-[#67B142]/5 transition-all duration-300 text-lg px-8 py-6 h-auto rounded-full"
              >
                Nous contacter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 