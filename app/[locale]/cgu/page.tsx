"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const Section = ({ number, title, children }: { number: string; title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 hover:border-[#67B142]/20 transition-colors duration-300">
    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-baseline gap-3">
      <span className="text-[#67B142] font-mono">{number}.</span>
      <span>{title}</span>
    </h2>
    <div className="space-y-4 text-gray-700">{children}</div>
  </div>
);

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 sm:py-24">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"
      >
        <motion.h1
          variants={fadeIn}
          className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 text-center mb-8"
        >
          CONDITIONS GÉNÉRALES D&apos;UTILISATION (CGU)
        </motion.h1>

        <motion.div variants={fadeIn} className="text-gray-700 mb-12 text-center text-lg md:text-xl">
          <Link href="https://www.axiomtext.com" className="text-[#67B142] hover:text-[#4e8a2f] transition-colors duration-200">
            www.axiomtext.com
          </Link>
        </motion.div>

        <motion.div variants={fadeIn} className="space-y-6">
          <Section number="1" title="À qui sont destinées ces CGU ?">
            <p>
              Lorsque nous utilisons les termes &quot;AxiomText&quot;, «nous», «notre» ou «nos», nous faisons référence à axiomtext.com.
            </p>
            <p>
              Lorsque nous utilisons le terme «utilisateur», nous nous adressons à vous, et nous utiliserons également les mots «vous» et «votre» pour vous désigner. Toutefois, si vous utilisez nos solutions au nom d&apos;une entreprise, d&apos;une organisation ou d&apos;une autre entité, l&apos;identité de &quot;vous&quot; peut devenir plus complexe.
            </p>
            <p>
              Dans ce cas, vous déclarez que vous avez l&apos;autorité nécessaire pour engager votre entreprise, organisation ou entité à respecter ces conditions générales d&apos;utilisation (CGU) et vous acceptez d&apos;être lié légalement par ces CGU au nom de ladite entité. Dans ce contexte, les termes «utilisateur», «vous» et «votre» font référence à cette entité.
            </p>
            <p>
              Si vous avez des doutes sur la signification de cela ou sur votre autorité à engager votre entreprise, organisation ou entité à ces conditions, nous vous recommandons de consulter d&apos;autres membres de votre organisation pour obtenir des clarifications sur les pouvoirs d&apos;engagement.
            </p>
          </Section>

          <Section number="2" title="Qu'est-ce que les CGU ?">
            <p>
              Les présentes CGU établissent un contrat juridiquement contraignant entre vous et AxiomText, et englobent toutes les offres, plateformes, solutions, fonctionnalités, contenus, applications et autres éléments que nous proposons aux utilisateurs tels que vous.
            </p>
          </Section>

          <Section number="3" title="Dans quelles circonstances ces CGU me concernent-elles ?">
            <p>
              Maintenant que nous partageons un langage commun, il est important que vous compreniez quand et comment les CGU s&apos;appliquent.
            </p>
            <p>
              Tout d&apos;abord, veuillez noter qu&apos;il s&apos;agit d&apos;un contrat juridique contraignant qui est requis pour utiliser notre plateforme et nos solutions. Par conséquent, vous ne pouvez accéder à notre plateforme et utiliser nos solutions que si vous acceptez d&apos;avoir lu, compris et accepté d&apos;être lié par les présentes CGU.
            </p>
            <p>
              Si vous vous inscrivez aux Solutions ou créez un compte via notre plateforme Web, les CGU entrent en vigueur lorsque vous cliquez sur «J&apos;accepte» ou sur toute autre fonctionnalité indiquant votre acceptation de ces conditions. Si vous achetez des Solutions via un contrat écrit distinct, les CGU font partie intégrante de ce contrat, quel que soit son nom. Indépendamment de ces autres méthodes, lorsque vous accédez ou utilisez notre plateforme et nos solutions, les CGU s&apos;appliquent et sont juridiquement contraignantes pour vous et votre utilisation.
            </p>
          </Section>

          <Section number="4" title="Comment sont traités les litiges relatifs à ces CGU ?">
            <p>
              Une exigence de nos CGU est que vous devez accepter de résoudre les litiges découlant de ces CGU par le biais d&apos;un arbitrage exécutoire directement entre vous et AxiomText. Dans l&apos;arbitrage, un arbitre neutre ou un groupe d&apos;arbitres entendra les arguments des deux parties et tranchera les différends de manière rapide et rentable. Vous pourrez toujours intenter des poursuites devant les tribunaux lorsqu&apos;il s&apos;agit de petites créances, mais toutes les autres réclamations seront soumises à l&apos;arbitrage.
            </p>
            <p>
              Vous devez comprendre que cela signifie que ni vous ni AxiomText n&apos;aurez la possibilité de résoudre certains litiges devant un juge ou un jury. Vous ne pourrez pas intenter de poursuites dans le cadre d&apos;un procès conventionnel et vous ne pourrez pas participer à un recours collectif en justice ou à une procédure similaire.
            </p>
          </Section>

          <Section number="5" title="Responsabilités d'AxiomText">
            <p>AxiomText s&apos;engage à :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Respecter les obligations légales, conformément à l&apos;article 7 de la loi n° 2011-01 du 24 février 2011 portant code des télécommunications, qui stipule que les exploitants de réseaux de télécommunications ouverts au public et leur personnel sont tenus au secret des correspondances et à assurer la continuité de la prestation, sous peine de poursuites judiciaires selon l&apos;article 167 du code pénal.
              </li>
              <li>
                Garantir la sécurité, la confidentialité et l&apos;intégrité des SMS transmis par l&apos;utilisateur, y compris les données personnelles.
              </li>
              <li>
                Fournir le service et assurer l&apos;accès à la plateforme axiomtext.com 24h/24 et 7j/7, sauf en cas d&apos;interruption programmée ou non pour des besoins de maintenance ou en cas de force majeure.
              </li>
            </ul>
          </Section>

          <Section number="6" title="Responsabilité de l'utilisateur">
            <p>
              L&apos;utilisateur est entièrement responsable de l&apos;utilisation qu&apos;il fait de la plateforme axiomtext.com et l&apos;utilise sous sa seule responsabilité. Il reconnaît également que sa responsabilité peut être engagée en cas d&apos;usurpation d&apos;identité ou de non-respect des dispositions.
            </p>
            <p>
              L&apos;utilisateur est seul responsable des données qu&apos;il communique lors de l&apos;utilisation du site axiomtext.com et déclare que les informations fournies sont complètes et exactes.
            </p>
          </Section>

          <Section number="7" title="Responsabilité du Fournisseur">
            <p>
              En raison des caractéristiques et des limites de l&apos;Internet, que l&apos;utilisateur déclare connaître, axiomtext.com ne peut en aucun cas être tenu responsable de la vitesse d&apos;envoi des messages SMS, des ralentissements ou des difficultés d&apos;accès à l&apos;espace client. AxiomText ne peut pas non plus être tenu responsable de la non-distribution des messages en raison des mêmes limitations et caractéristiques de l&apos;Internet. AxiomText se réserve le droit d&apos;interrompre temporairement l&apos;accès à ses services pour des raisons de maintenance et/ou d&apos;amélioration, sans obligation d&apos;indemnisation. Cependant, axiomtext.com s&apos;engage à mettre en œuvre tous les moyens nécessaires. Il ne peut cependant être tenu responsable de la perte de revenus due à une interruption de service.
            </p>
          </Section>

          <Section number="8" title="Cas de force majeure">
            <p>
              La responsabilité d&apos;AxiomText ou de l&apos;utilisateur ne pourra être engagée en cas de non-exécution ou de retard dans l&apos;exécution de l&apos;une de leurs obligations décrites dans les présentes Conditions Générales d&apos;Utilisation en raison d&apos;un cas de force majeure.
            </p>
            <p>
              Le terme &quot;force majeure&quot; désigne tout événement extérieur, irrésistible et imprévisible, tel qu&apos;interprété par la jurisprudence des juridictions sénégalaises, qui empêche l&apos;une des parties d&apos;exécuter ses obligations ou rend l&apos;exécution de celles-ci excessivement onéreuse.
            </p>
            <p>
              Seront expressément considérés comme des cas de force majeure, en plus de ceux généralement reconnus par la jurisprudence des juridictions sénégalaises, et sans que cette liste soit limitative : une défaillance des réseaux de télécommunication, une panne du réseau électrique, une défaillance des équipements de communication utilisés par AxiomText, ainsi que toute évolution réglementaire dans le domaine des télécommunications ou toute décision modifiant les conditions d&apos;envoi des messages.
            </p>
            <p>
              Chaque partie notifiera à l&apos;autre partie par lettre recommandée avec accusé de réception la survenance de tout cas de force majeure.
            </p>
          </Section>

          <Section number="9" title="Conditions Financières">
            <p>
              Les tarifs des envois de messages sont ceux indiqués sur le bon de commande, et cela implique que l&apos;utilisateur s&apos;engage à payer le prix correspondant aux services sélectionnés.
            </p>
            <p>
              Les services souscrits sont facturés en FCFA et le paiement est effectué lors de la souscription.
            </p>
            <p>
              AxiomText se réserve le droit de modifier ses prix à tout moment, sans préavis. Toutefois, le prix des services payés à l&apos;avance est garanti pour la période concernée.
            </p>
            <p>
              En cas de défaut de paiement ou de retard de paiement de la part du client, cela entraînera automatiquement la résiliation du contrat.
            </p>
          </Section>

          <Section number="10" title="Traitement des données">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">10.1 Accès aux Données – Propriété des Données</h3>
                <p>
                  À partir de la date de début de l&apos;opération, le client aura un accès personnalisé et sécurisé aux statistiques liées à l&apos;opération, telles que les statistiques de trafic, pendant toute la durée du contrat.
                </p>
                <p>
                  Cet accès se fera via Internet grâce à une connexion sécurisée (HTTPS) avec un code d&apos;utilisateur et un mot de passe personnalisés pour le client. Étant donné que les données appartiennent exclusivement au client, AxiomText s&apos;engage à ne les utiliser que dans le cadre de l&apos;exécution des obligations prévues dans le contrat et à en assurer la confidentialité. À la fin du contrat et sur demande du client, AxiomText détruira immédiatement les données.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">10.2 Conformité à la réglementation et à l&apos;exploitation des données</h3>
                <p>
                  Les parties s&apos;engagent à respecter leurs obligations respectives en vertu de la législation applicable sur la protection des données personnelles (conformément à la loi n° 2008-12 du 25 janvier 2008 sur la protection des données personnelles).
                </p>
                <p>AxiomText s&apos;engage à :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Les données seront traitées uniquement dans le cadre des finalités convenues pour la sous-traitance. En particulier, AxiomText s&apos;engage, pendant toute la durée du contrat et au-delà, à ne pas utiliser, céder ou louer les données à des tiers à des fins personnelles.
                  </li>
                  <li>
                    Les données seront traitées conformément aux instructions du client. Si AxiomText estime qu&apos;une instruction du client constitue une violation de la réglementation sur la protection des données personnelles, il en informera immédiatement le client et le conseillera, au besoin, sur les mesures correctives ou préventives à prendre, en tenant compte notamment de l&apos;état de l&apos;art.
                  </li>
                  <li>
                    Nous nous engageons à assurer la confidentialité des données traitées dans le cadre du contrat.
                  </li>
                  <li>
                    Nous nous assurerons que les personnes autorisées à traiter les données personnelles en vertu du contrat s&apos;engagent à respecter la confidentialité ou sont soumises à une obligation légale appropriée de confidentialité. De plus, nous veillerons à ce qu&apos;elles reçoivent la formation nécessaire en matière de protection des données.
                  </li>
                  <li>
                    Nous vous aiderons à remplir votre obligation de répondre aux demandes des personnes concernées en matière d&apos;accès, de rectification, de suppression, de limitation, d&apos;opposition et de portabilité de leurs données personnelles.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">10.3 Messages non sollicités</h3>
                <p>
                  Le client s&apos;engage à ne pas envoyer de messages non sollicités par un utilisateur pour lesquels des données ont été collectées dans le cadre de l&apos;opération, à l&apos;exception des cas expressément autorisés par les présentes conditions.
                </p>
                <p>
                  Dans tous les cas, le client s&apos;engage à garantir AxiomText et à le dédommager de toute réclamation résultant de l&apos;envoi de messages non sollicités à un utilisateur.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">10.4 Sécurité des données</h3>
                <p>
                  Chaque partie s&apos;engage à mettre en place les mesures techniques appropriées pour assurer la sécurité des données.
                </p>
                <p>
                  AxiomText s&apos;engage à préserver l&apos;intégrité et la confidentialité des données en utilisant les moyens techniques couramment utilisés pour les données de cette nature. À cet égard, AxiomText mettra en place des mesures techniques et organisationnelles visant à prévenir l&apos;accès ou l&apos;utilisation frauduleuse des données, ainsi qu&apos;à prévenir toute perte, altération ou destruction des données.
                </p>
                <p>AxiomText s&apos;engage spécifiquement à mettre en place :</p>
                <div className="bg-gray-50 rounded-lg p-6 mt-4">
                  <h4 className="font-semibold mb-4">Mesures de sécurité techniques :</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Mise à jour régulière du logiciel antivirus et du pare-feu sur l&apos;ensemble des appareils informatiques.</li>
                    <li>Réalisation de tests d&apos;intrusion périodiques par un prestataire spécialisé en sécurité de l&apos;information pour vérifier les systèmes informatiques.</li>
                    <li>Surveillance continue du système d&apos;information pour détecter les failles de sécurité et les violations éventuelles des données.</li>
                    <li>Planification de sauvegardes quotidiennes et hebdomadaires des données.</li>
                    <li>Sécurisation des processus de transfert des données grâce à un protocole FTPS ou à un autre dispositif sécurisé utilisant des techniques de chiffrement des données.</li>
                    <li>Mise en place d&apos;une politique de mots de passe solides pour accéder aux données, conformément aux meilleures pratiques.</li>
                    <li>Pseudonymisation et chiffrement des données à caractère personnel.</li>
                    <li>Adoption d&apos;une charte informatique pour assurer le respect des principes de protection des données par les employés.</li>
                    <li>Engagement de confidentialité afin que les personnes autorisées à traiter les données personnelles soient tenues à une obligation de confidentialité renforcée.</li>
                    <li>Mise en place de mesures appropriées pour empêcher le transfert de données personnelles à des personnes ou entités non autorisées.</li>
                    <li>Journalisation des connexions pour suivre l&apos;accès aux données personnelles.</li>
                  </ul>
                  <p className="mt-4">
                    Tous les employés d&apos;AxiomText sont contractuellement tenus à des engagements de confidentialité.
                  </p>
                </div>
              </div>
            </div>
          </Section>
        </motion.div>
      </motion.div>
    </div>
  );
}
