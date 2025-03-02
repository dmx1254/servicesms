"use client";

import { ImagePlus, Image, Link2, Palette, Smartphone, BarChart2, Share2 } from "lucide-react";
import SolutionLayout from "../components/SolutionLayout";

export default function SmsEnrichi() {
  return (
    <SolutionLayout
      title="SMS ENRICHI"
      description="Enrichissez vos SMS avec des contenus multimédias et des liens interactifs pour créer des expériences de communication plus engageantes."
      icon={<ImagePlus className="h-12 w-12 text-[#67B142]" />}
      mainImage="/images/sms-pro-dashboard.png"
      features={[
        "Images et GIFs intégrés",
        "Liens cliquables",
        "Boutons d'action",
        "Cartes de visite digitales",
        "Tracking des interactions",
        "Templates personnalisables",
        "Preview en temps réel",
        "Compatibilité multiplateforme",
        "Analytics avancés",
      ]}
      benefits={[
        {
          title: "Contenu visuel attractif",
          description: "Intégrez des images et des visuels pour capter l'attention de vos destinataires.",
          icon: <Image size={24} className=" text-[#67B142]" />,
        },
        {
          title: "Liens interactifs",
          description: "Ajoutez des liens cliquables et des boutons d'action pour augmenter l'engagement.",
          icon: <Link2 className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Design personnalisé",
          description: "Créez des messages qui reflètent votre identité visuelle et votre marque.",
          icon: <Palette className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Optimisé mobile",
          description: "Messages parfaitement adaptés à tous les appareils mobiles.",
          icon: <Smartphone className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Analyses détaillées",
          description: "Suivez les performances de vos messages enrichis avec des métriques précises.",
          icon: <BarChart2 className="h-6 w-6 text-[#67B142]" />,
        },
        {
          title: "Partage facilité",
          description: "Permettez à vos destinataires de partager facilement votre contenu.",
          icon: <Share2 className="h-6 w-6 text-[#67B142]" />,
        },
      ]}
      useCases={[
        {
          title: "Promotions visuelles",
          description: "Présentez vos produits et offres avec des images attrayantes et des boutons d'action directs.",
        },
        {
          title: "Cartes de vœux digitales",
          description: "Envoyez des cartes de vœux personnalisées avec des animations et des contenus interactifs.",
        },
        {
          title: "Invitations événementielles",
          description: "Créez des invitations attractives avec RSVP intégré et localisation interactive.",
        },
        {
          title: "Catalogues produits",
          description: "Partagez vos catalogues produits avec des images et des liens directs vers votre boutique.",
        },
      ]}
    />
  );
} 