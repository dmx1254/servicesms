"use client";

import { Mic, Volume2, Languages, Sparkles, Headphones, Cpu, Settings } from "lucide-react";
import SolutionLayout from "../components/SolutionLayout";

export default function SmsVocal() {
  return (
    <SolutionLayout
      title="SMS VOCAL"
      description="Transformez vos messages texte en messages vocaux naturels et engageants pour une communication plus personnelle et accessible."
      icon={<Mic className="h-12 w-12 text-[#67B142]" />}
      mainImage="/images/sms-pro-dashboard.png"
      features={[
        "Conversion texte-voix naturelle",
        "Voix multilingues de qualité",
        "Personnalisation de la voix",
        "Programmation des appels",
        "Rapports détaillés",
        "Interface simple d'utilisation",
        "API disponible",
        "Support technique dédié",
        "Tarification transparente",
      ]}
      benefits={[
        {
          title: "Qualité sonore exceptionnelle",
          description: "Des voix naturelles et claires grâce à notre technologie de synthèse vocale avancée.",
          icon: <Volume2 className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Support multilingue",
          description: "Large choix de langues et d'accents pour une communication internationale efficace.",
          icon: <Languages className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "IA avancée",
          description: "Intelligence artificielle pour une meilleure compréhension et prononciation du texte.",
          icon: <Sparkles className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Accessibilité maximale",
          description: "Atteignez tous vos contacts, y compris ceux qui préfèrent ou nécessitent la communication vocale.",
          icon: <Headphones className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Traitement automatisé",
          description: "Conversion automatique et rapide de vos messages texte en messages vocaux.",
          icon: <Cpu className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Personnalisation avancée",
          description: "Ajustez le ton, le débit et l'intonation pour correspondre à votre image de marque.",
          icon: <Settings className="h-6 w-6 text-[#67B142]" />,
        },
      ]}
      useCases={[
        {
          title: "Communication d'urgence",
          description: "Envoyez rapidement des messages vocaux urgents à grande échelle pour des situations critiques.",
        },
        {
          title: "Marketing personnalisé",
          description: "Créez des campagnes marketing vocales personnalisées pour un impact plus fort auprès de vos clients.",
        },
        {
          title: "Support client",
          description: "Offrez un service client plus personnel avec des messages vocaux automatisés mais naturels.",
        },
        {
          title: "Accessibilité",
          description: "Rendez votre communication accessible aux personnes malvoyantes ou ayant des difficultés de lecture.",
        },
      ]}
    />
  );
} 