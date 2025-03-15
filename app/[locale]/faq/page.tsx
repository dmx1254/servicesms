"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "QU'EST-CE QUE SERVICES-SMS ?",
    answer: "AxiomTEXT, votre plateforme SMS 100% Sénégalaise ! est une société spécialisée dans l'envoi de SMS en masse pour les professionnels et particuliers. Services-sms propose un des outils les plus complets d'envoi de SMS en masse sur internet, avec des tarifs ultra compétitif et dégressif en fonction de vos besoins. Grâce à l'espace client sécurisé disponible en mode SAAS, aux différentes API (HTTPS, FTP), vous disposez de tous les outils nécessaires pour réaliser vos opérations de marketing SMS, vos envois en masse ou automatiser.",
  },
  {
    question: "COMMENT S'INSCRIRE SUR SERVICES-SMS",
    answer: "En cliquant sur les liens et boutons « Commencer gratuitement » ou « Inscription », vous aurez accès à un formulaire simplifié vous permettant de vous inscrire gratuitement et sans engagement à servicesms.sn. Une fois votre inscription validée, vous recevrez un email de confirmation pour activer votre compte et bénéficier de 5 SMS gratuits.",
  },
  {
    question: "MON COMPTE SERA-T-IL VALIDE AUTOMATIQUEMENT ?",
    answer: "De nombreuses tentatives de fraude nous obligent à soumettre vos informations d'inscription à des outils anti-fraude. Selon votre score, l'activation de votre compte pourra être automatique, ou nécessiter une action manuelle de vérification de notre équipe. N'hésitez pas à nous contacter si après un certain temps, votre compte n'est toujours pas validé.",
  },
  {
    question: "FAUT-IL S'ENGAGER POUR UTILISER AxiomTEXT ?",
    answer: "Non, vous êtes totalement libre d'essayer AxiomTEXT en créant un compte sans engagement, sans abonnement et sans aucun frais. Votre compte peut même être intégralement détruit sur demande au support par email.",
  },
  {
    question: "COMMENT TESTER LE SERVICE AxiomTEXT",
    answer: "Un module de test de notre service est disponible sur notre page d'accueil. Si vous souhaitez tester notre espace client, il suffit de vous inscrire, et d'attendre la validation de votre signature, une fois votre signature validee, 5 SMS vous sont offerts pour que vous puissiez tester l'intégralité des fonctionnalités proposées..",
  },
  {
    question: "COMMENT CONTACTER L'EQUIPE AxiomTEXT",
    answer: "En cas de remarque, de suggestions ou de problème, l'équipe AxiomTEXT se tient à votre disposition pour vous accompagner. Vous pouvez nous joindre à tout moment depuis la rubrique contact du site, où via la rubrique assistance de l'espace client. Vous pouvez également nous contacter par téléphone au +221 78 110 08 08.",
  },
  {
    question: "AxiomTEXT NECESSITE-T-IL UNE INSTALLATION SUR MON ORDINATEUR ?",
    answer: "Tous nos solutions SERVICES-SMS s'utilisent directement sur un navigateur internet, en mode SAAS, sans installation préalable de logiciel. Service-sms est compatible avec l'ensemble des navigateurs internet et l'ensemble des systèmes d'exploitation.",
  },
  {
    question: "AxiomTEXT PEUT-IL ETRE UTILISE SUR SMARTPHONE/TABLETTE ?",
    answer: "Oui, le site axiomtext.com est développé en Responsive Design. Cela signifie que le site et l'espace client s'afficheront correctement sur tout type d'écran, quel qu'en soit sa taille.",
  },
  {
    question: "EST-IL NECESSAIRE D'AVOIR DES COMPETENCES INFORMATIQUES POUR UTILISER AxiomTEXT ?",
    answer: "L'interface proposée par axiomtext.com est extrêmement simple et ne nécessite pas de compétences particulières. Sans aucun engagement, vous pouvez créer un compte et tester gratuitement notre service afin d'en vérifier la simplicité. 5 SMS vous seront offerts.",
  },
  {
    question: "UN PARTICULIER PEUT-IL UTILISER NOS SOLUTIONS SERVICES-SMS ?",
    answer: "Oui. nos solutions de services sms sont réservées aux professionnels et aux particuliers, institutionnels et associations…",
  },
  {
    question: "EST-CE QUE AxiomTEXT PROPOSE DE LOUER DES FICHIERS CLIENTS CIBLES DITS OPT-IN ?",
    answer: "Oui, nous vous proposons la location de base de données client dites Opt-In à partir de 85F HT le contact, location et routage du SMS inclus.",
  },
  {
    question: "VOS BASES DE DONNEES OPT-IN SONT-ELLES DISPONIBLES A L'ACHAT ?",
    answer: "Non, nous ne fournissons que des bases de données en location.",
  },
  {
    question: "OU TROUVER LES DOCUMENTATIONS D'INTEGRATION DES API ?",
    answer: "Toutes documentations et informations relatives à l'integration de l'api AxiomTEXT sont disponibles sur sur api.axiomtext.com.",
  },
  {
    question: "FAUT-IL UNE AUTORISATION SPECIALE POUR UTILISER LES API ?",
    answer: "Non, à partir du moment où vous disposez d'un compte valide sur axiomtext.com, vous êtes en mesure d'utiliser nos API et Web Services sans surcoût.",
  },
  {
    question: "QUE DIT LA LOI SENEGALAISE CONCERNANT L'ENVOI DE SMS DE PROSPECTION COMMERCIALE ?",
    answer: `La prospection directe par SMS est régie par plusieurs règles et textes de loi La Commission de protection des données personnelles du Sénégal (CDP)Vu la Constitution ; Vu la loi n° 2008-12 du 25 janvier 2008 sur la protection des données à caractère personnel.

FAITS ET PROCEDURE:
A l'instar des grandes démocraties, notre pays a institué un régime de protection des données à caractère personnel par la loi n° 2008-12 du 25 janvier 2008 afin de se prémunir contre les risques liés à l'utilisation frauduleuse ou abusive des données nominatives des sénégalais. A cet effet, la Commission de protection des données personnelles (CDP) a été mise en place pour veiller à l'application de la loi.

EN RESUME:
En résumé, la prospection directe par SMS est interdite si les coordonnées de la personne physique contactée n'a pas exprimé son consentement préalable (article 4- 11 de la loi de 2008). Dans tous les cas, l'envoi de SMS doit être accompagné d'une possibilité de désabonnement. Pour cela, sur servicesms.sn, il est toujours possible de répondre STOP pour se désabonner. L'annonceur doit également être clairement identifié.`,
  },
  {
    question: "QUELLE EST LA PLAGE HORAIRE AUTORISEE POUR L'ENVOI DE SMS ?",
    answer: "L'envoi de SMS commerciaux est formellement interdit pendant les heures comprises entre 20h00 et 08h00 les jours calendaires, le dimanche toute la journée et les jours fériés. En cas de non-respect des dispositions légales, les sanctions pénales peuvent être lourdes. Soit par la CDP ou par les juridictions compétentes à l'égard de tout responsable de traitement n'ayant pas respecté ses obligations.",
  },
  {
    question: "PUIS-JE ENVOYER DES SMS A DES NUMEROS CHOISIS AU HASARD ?",
    answer: "Non, vous ne pouvez envoyer des SMS qu'à des contacts l'ayant expressément accepté.",
  },
  {
    question: "LA CONFIDENTIALITE DE MES LISTES DE CONTACTS EST-ELLE GARANTIE ?",
    answer: "axiomtext.com s'engage à ne jamais utiliser les données issues de vos listes de contacts, telle que défini dans notre charte de confidentialité. Un document d'engagement de confidentialité peut être fourni sur demande.",
  },
  {
    question: "QUEL EST L'ENGAGEMENT ANTI-SPAM AxiomTEXT ?",
    answer: "axiomtext.com s'engage à ce que le numéro fournit lors de votre inscription ne soit jamais transmis à aucun tiers.",
  },
  {
    question: "COMMENT SIGNALER UN ABUS DE SERVICE ?",
    answer: "Si vous avez détecter un abus de service, merci de nous contacter via le formulaire de contact.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl"
          >
            À propos de AxiomTEXT
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-4 text-lg leading-8 text-gray-600"
          >
            Trouvez toutes les réponses à vos questions concernant nos services.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto mt-16 max-w-4xl divide-y divide-gray-900/10"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <AccordionItem value={`item-${index}`} className="bg-white px-6 py-2 rounded-lg shadow-sm">
                  <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-[#67B142]">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
}