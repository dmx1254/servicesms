"use client";

import { BarChart3, PieChart, LineChart, Settings, Shield, Users, Zap } from "lucide-react";
import SolutionLayout from "../components/SolutionLayout";

export default function SondagesSms() {
  return (
    <SolutionLayout
      title="SONDAGES SMS"
      description="Créez et gérez facilement des sondages par SMS pour collecter des retours clients de manière simple et efficace."
      icon={<BarChart3 className="h-12 w-12 text-[#67B142]" />}
      mainImage="/images/sms-pro-dashboard.png"
      features={[
        "Création simple de sondages",
        "Questions personnalisables",
        "Réponses en temps réel",
        "Analyses statistiques",
        "Export des résultats",
        "Templates prédéfinis",
        "Segmentation des audiences",
        "Rapports automatiques",
        "Interface intuitive",
      ]}
      benefits={[
        {
          title: "Analyses détaillées",
          description: "Visualisez les résultats de vos sondages avec des graphiques clairs et détaillés.",
          icon: <PieChart className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Suivi en temps réel",
          description: "Suivez l'évolution de vos sondages et les réponses en direct.",
          icon: <LineChart className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Personnalisation complète",
          description: "Adaptez vos sondages selon vos besoins spécifiques.",
          icon: <Settings className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Sécurité des données",
          description: "Protection complète des données collectées et conformité RGPD.",
          icon: <Shield className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Large audience",
          description: "Atteignez un maximum de participants grâce à la simplicité du SMS.",
          icon: <Users className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Réponses rapides",
          description: "Obtenez des réponses instantanées grâce à la facilité du SMS.",
          icon: <Zap className="h-6 w-6 text-[#67B142]" />,
        },
      ]}
      useCases={[
        {
          title: "Satisfaction client",
          description: "Mesurez la satisfaction de vos clients après un achat ou une interaction.",
        },
        {
          title: "Études de marché",
          description: "Réalisez des études de marché rapides pour valider vos décisions commerciales.",
        },
        {
          title: "Feedback événementiel",
          description: "Collectez les retours des participants après vos événements.",
        },
        {
          title: "Enquêtes internes",
          description: "Réalisez des sondages auprès de vos employés de manière simple et efficace.",
        },
      ]}
    />
  );
} 