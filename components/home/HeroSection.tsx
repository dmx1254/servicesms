"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  MessageSquare,
  BarChart,
  Send,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
};

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => (
  <motion.div
    className="bg-card border rounded-lg p-6 shadow-sm"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="flex items-center mb-4">
      <div className="bg-primary/10 p-3 rounded-full mr-4 text-primary">
        {icon}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
    </div>
    <p className="text-muted-foreground text-sm">{description}</p>
  </motion.div>
);

export default function HeroSection() {
  const tScope = useScopedI18n("hero");
  const tScope2 = useScopedI18n("features");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const subtitleVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, delay: 0.2 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.4 } },
  };

  // Features
  const features = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "SMS Marketing",
      description:
        "Envoyez des campagnes SMS ciblées pour atteindre efficacement votre audience.",
    },
    {
      icon: <Send className="h-6 w-6" />,
      title: "SMS Transactionnels",
      description:
        "Automatisez vos confirmations et notifications importantes par SMS.",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Programmation",
      description:
        "Planifiez vos envois SMS à l'avance pour une diffusion au moment optimal.",
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: "Analyses & Rapports",
      description:
        "Suivez vos performances avec des statistiques détaillées en temps réel.",
    },
  ];

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10" />

      {/* Animated circles in background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {mounted && (
          <>
            <motion.div
              className="absolute w-72 h-72 rounded-full bg-primary/5 -top-20 -left-20"
              animate={{
                x: [0, 30, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute w-96 h-96 rounded-full bg-primary/5 -bottom-32 -right-32"
              animate={{
                x: [0, -40, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </>
        )}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero content */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            initial="hidden"
            animate={mounted ? "visible" : "hidden"}
            variants={titleVariants}
          >
            {tScope("title")}
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground mb-8"
            initial="hidden"
            animate={mounted ? "visible" : "hidden"}
            variants={subtitleVariants}
          >
            {tScope("subtitle")}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial="hidden"
            animate={mounted ? "visible" : "hidden"}
            variants={buttonVariants}
          >
            <Button size="lg" className="gap-2">
              {tScope("cta")}
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              {tScope("secondaryCta")}
            </Button>
          </motion.div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={0.6 + index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
