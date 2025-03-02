"use client";

import { Database, Filter, Target, Users, Shield, RefreshCcw, Search, FileSpreadsheet } from "lucide-react";
import SolutionLayout from "../components/SolutionLayout";

export default function LocationBdd() {
  return (
    <SolutionLayout
      title="LOCATION BDD"
      description="Accédez à une base de données qualifiée et segmentée pour cibler précisément votre audience et optimiser vos campagnes SMS."
      icon={<Database className="h-12 w-12 text-[#67B142]" />}
      mainImage="/images/sms-pro-dashboard.png"
      features={[
        "Base de données qualifiée",
        "Segmentation avancée",
        "Mise à jour régulière",
        "Données conformes RGPD",
        "Filtres multicritères",
        "Export personnalisé",
        "Statistiques détaillées",
        "Interface intuitive",
        "Support dédié",
      ]}
      benefits={[
        {
          title: "Ciblage précis",
          description: "Filtrez votre audience selon de nombreux critères démographiques et comportementaux.",
          icon: <Filter className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Données qualifiées",
          description: "Accédez à des contacts vérifiés et régulièrement mis à jour pour des campagnes efficaces.",
          icon: <Target className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Base enrichie",
          description: "Profitez d'une base de données riche en informations pertinentes sur vos cibles.",
          icon: <Users className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Conformité RGPD",
          description: "Utilisez des données conformes aux réglementations en vigueur sur la protection des données.",
          icon: <Shield className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Mises à jour régulières",
          description: "Bénéficiez de mises à jour fréquentes pour maintenir la qualité de la base de données.",
          icon: <RefreshCcw className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Recherche avancée",
          description: "Utilisez des outils de recherche puissants pour trouver exactement les contacts dont vous avez besoin.",
          icon: <Search className="h-6 w-6 text-[#67B142]" />,
        },
      ]}
      useCases={[
        {
          title: "Marketing ciblé",
          description: "Lancez des campagnes SMS ciblées vers des segments spécifiques de votre marché.",
        },
        {
          title: "Études de marché",
          description: "Analysez votre marché potentiel et identifiez de nouvelles opportunités commerciales.",
        },
        {
          title: "Prospection commerciale",
          description: "Développez votre activité en touchant une audience qualifiée et pertinente.",
        },
        {
          title: "Événementiel local",
          description: "Ciblez une audience locale pour vos événements et manifestations.",
        },
      ]}
    />
  );
} 