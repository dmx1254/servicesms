"use client";

import SolutionLayout from "@/components/SolutionLayout";
import {
  Ticket,
  QrCode,
  Shield,
  Smartphone,
  Zap,
  BarChart2,
  Settings,
} from "lucide-react";

export default function MobileTicketing() {
  return (
    <SolutionLayout
      title="MOBILE TICKETING"
      description="Solution complète de billetterie mobile par SMS pour gérer efficacement vos événements et contrôler les accès."
      icon={<Ticket className="h-12 w-12 text-[#67B142]" />}
      mainImage="/images/sms-ticketing.webp"
      features={[
        "Billets par SMS",
        "QR Codes sécurisés",
        "Validation en temps réel",
        "Gestion des accès",
        "Statistiques détaillées",
        "Anti-fraude intégré",
        "Interface de contrôle",
        "API disponible",
        "Support multilingue",
      ]}
      benefits={[
        {
          title: "Validation instantanée",
          description:
            "Système de validation des billets rapide et efficace par QR Code.",
          icon: <QrCode className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Sécurité maximale",
          description:
            "Protection contre la fraude et les duplications de billets.",
          icon: <Shield className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Compatible mobile",
          description:
            "Billets accessibles sur tous les smartphones sans application.",
          icon: <Smartphone className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Rapidité d'accès",
          description:
            "Fluidifiez les entrées grâce à la validation instantanée.",
          icon: <Zap className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Analyses en temps réel",
          description:
            "Suivez les entrées et analysez la fréquentation en direct.",
          icon: <BarChart2 className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Personnalisation complète",
          description: "Adaptez le système à vos besoins spécifiques.",
          icon: <Settings className="h-6 w-6 text-[#67B142]" />,
        },
      ]}
      useCases={[
        {
          title: "Événements culturels",
          description:
            "Gérez la billetterie de vos concerts, spectacles et expositions.",
        },
        {
          title: "Événements sportifs",
          description:
            "Contrôlez l'accès aux matchs et compétitions sportives.",
        },
        {
          title: "Conférences",
          description:
            "Simplifiez l'accès aux séminaires et conférences professionnelles.",
        },
        {
          title: "Festivals",
          description:
            "Gérez efficacement les entrées de grands événements multi-jours.",
        },
      ]}
    />
  );
}
