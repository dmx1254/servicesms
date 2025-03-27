"use client";

import SolutionLayout from "@/components/SolutionLayout";
import { Mail, Repeat, Zap, Clock, Settings2, ShieldCheck, Workflow } from "lucide-react";

export default function MailToSms() {
  return (
    <SolutionLayout
      title="MAIL TO SMS"
      description="Convertissez automatiquement vos emails en SMS pour une communication multicanale efficace et instantanée."
      icon={<Mail className="h-12 w-12 text-[#67B142]" />}
      mainImage="/images/mail-to-sms.webp"
      features={[
        "Conversion automatique",
        "Personnalisation des règles",
        "Filtres intelligents",
        "Réponses automatiques",
        "Historique complet",
        "Notifications en temps réel",
        "Interface intuitive",
        "API disponible",
        "Support multilingue",
      ]}
      benefits={[
        {
          title: "Conversion instantanée",
          description: "Transformez automatiquement vos emails en SMS dès leur réception.",
          icon: <Repeat className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Traitement rapide",
          description: "Profitez d'un traitement instantané pour une communication sans délai.",
          icon: <Zap className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Programmation flexible",
          description: "Définissez des règles de conversion selon vos besoins spécifiques.",
          icon: <Clock className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Configuration avancée",
          description: "Personnalisez les paramètres de conversion selon vos préférences.",
          icon: <Settings2 className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Sécurité garantie",
          description: "Vos données sont protégées tout au long du processus de conversion.",
          icon: <ShieldCheck className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Automatisation complète",
          description: "Automatisez l'ensemble de votre flux de communication email vers SMS.",
          icon: <Workflow className="h-6 w-6 text-[#67B142]" />,
        },
      ]}
      useCases={[
        {
          title: "Alertes critiques",
          description: "Convertissez les emails urgents en SMS pour une notification immédiate de vos équipes.",
        },
        {
          title: "Support client",
          description: "Transformez les demandes clients par email en SMS pour une réponse plus rapide.",
        },
        {
          title: "Communication interne",
          description: "Assurez une communication efficace en convertissant les emails importants en SMS.",
        },
        {
          title: "Notifications système",
          description: "Recevez les alertes système par SMS pour une réactivité maximale.",
        },
      ]}
    />
  );
} 