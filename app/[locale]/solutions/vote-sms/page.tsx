"use client";

import SolutionLayout from "@/components/SolutionLayout";
import {
  Shield,
  BarChart2,
  Clock,
  Users,
  Settings,
  CheckCircle,
} from "lucide-react";

export default function VoteSms() {
  return (
    <SolutionLayout
      title="VOTE SMS"
      description="Système de vote par SMS sécurisé et fiable pour vos événements, concours et consultations."
      mainImage="/images/sms-vote.webp"
      features={[
        "Vote sécurisé",
        "Résultats en temps réel",
        "Anti-fraude intégré",
        "Statistiques détaillées",
        "Interface de gestion",
        "Export des résultats",
        "Personnalisation complète",
        "Support multilingue",
        "API disponible",
      ]}
      benefits={[
        {
          title: "Sécurité maximale",
          description:
            "Système anti-fraude avancé et vérification des votes en temps réel.",
          icon: <Shield className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Analyses en direct",
          description:
            "Suivez l'évolution des votes et analysez les tendances en temps réel.",
          icon: <BarChart2 className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Disponibilité 24/7",
          description:
            "Système disponible en permanence pour des votes à toute heure.",
          icon: <Clock className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Large participation",
          description:
            "Permettez à tous de participer facilement grâce au SMS.",
          icon: <Users className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Personnalisation",
          description: "Adaptez le système de vote à vos besoins spécifiques.",
          icon: <Settings className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Fiabilité garantie",
          description: "Système robuste garantissant l'intégrité des votes.",
          icon: <CheckCircle className="h-6 w-6 text-[#67B142]" />,
        },
      ]}
      useCases={[
        {
          title: "Événements et spectacles",
          description:
            "Organisez des votes en direct lors de vos événements et spectacles.",
        },
        {
          title: "Élections internes",
          description:
            "Gérez les élections de votre organisation de manière simple et sécurisée.",
        },
        {
          title: "Concours et compétitions",
          description:
            "Permettez au public de voter pour leurs candidats préférés.",
        },
        {
          title: "Consultations publiques",
          description:
            "Recueillez l'avis du public sur des projets ou des décisions importantes.",
        },
      ]}
    />
  );
}
