"use client";

import SolutionLayout from "@/components/SolutionLayout";
import { MessageSquare, Gauge, BarChart2, Shield, Clock, Globe2, Coins } from "lucide-react";

export default function SmsPro() {
  return (
    <SolutionLayout
      title="SMS PRO"
      description="Une solution professionnelle complète pour l'envoi de SMS en masse avec des fonctionnalités avancées de suivi et d'analyse en temps réel."
      icon={<MessageSquare className="h-12 w-12 text-[#67B142]" />}
      mainImage="/images/sms-pro-dashboard.png"
      features={[
        "Envoi de SMS en masse personnalisés",
        "Suivi en temps réel des livraisons",
        "Rapports détaillés et analyses",
        "API REST complète",
        "Interface intuitive",
        "Support multilingue",
        "Programmation des envois",
        "Gestion des listes de contacts",
        "Templates de messages",
      ]}
      benefits={[
        {
          title: "Performance optimale",
          description: "Profitez d'une infrastructure robuste garantissant une livraison rapide et fiable de vos messages.",
          icon: <Gauge className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Analyses détaillées",
          description: "Accédez à des rapports complets et des statistiques en temps réel pour optimiser vos campagnes.",
          icon: <BarChart2 className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Sécurité maximale",
          description: "Vos données sont protégées par des protocoles de sécurité avancés et conformes au RGPD.",
          icon: <Shield className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Disponibilité 24/7",
          description: "Notre plateforme est disponible en permanence avec un support technique réactif.",
          icon: <Clock className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Couverture mondiale",
          description: "Envoyez des SMS dans le monde entier grâce à nos partenariats avec les opérateurs majeurs.",
          icon: <Globe2 className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Prix compétitifs",
          description: "Bénéficiez de tarifs avantageux et transparents, adaptés à votre volume d'envoi.",
          icon: <Coins className="h-6 w-6 text-[#67B142]" />,
        },
      ]}
      useCases={[
        {
          title: "Marketing et Promotion",
          description: "Envoyez des offres promotionnelles, des codes de réduction et des notifications d'événements à vos clients.",
        },
        {
          title: "Service Client",
          description: "Gérez efficacement la communication avec vos clients : confirmations, rappels, suivis de commande.",
        },
        {
          title: "Authentification",
          description: "Sécurisez l'accès à vos services avec l'authentification à deux facteurs par SMS.",
        },
        {
          title: "Communication interne",
          description: "Informez rapidement vos employés des actualités importantes et des urgences.",
        },
      ]}
    />
  );
} 