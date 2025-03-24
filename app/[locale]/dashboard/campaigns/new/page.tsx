"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Users,
  Upload,
  Calendar,
  Tag,
  Check,
  Info,
  Sparkles,
  Send,
  ChevronRight,
  GraduationCap,
  Book,
  Trophy,
  Star,
  LucideIcon,
  PartyPopper,
  AlertCircle,
  FileText,
  Clock,
  CalendarDays,
  Download,
  Plus,
  CalendarIcon,
  Zap,
  Heart,
  Trash,
} from "lucide-react";
import { motion } from "framer-motion";
import { format, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  SMSError,
  SMSErrorCode,
  formatSMSErrorMessage,
  getSMSErrorDetails,
} from "@/app/lib/utils/smsErrorCodes";
import { useDropzone } from "react-dropzone";
import LoadingDialog from "@/components/LoadingImport";
import { rewriteMessage } from "@/app/lib/utils/parseMessage";
import { v4 as uuidv4 } from "uuid";
import useStore from "@/app/lib/manage";
import { MyContact } from "@/components/contacts/MyContact";
import { LocationContact } from "@/components/contacts/LocationContact";
import { ContactMy } from "@/app/lib/utils/utils";

type TemplateId =
  // Academic templates
  | "trimester_grades"
  | "exam_results"
  | "absence_alert"
  | "homework_reminder"
  | "parent_meeting"
  | "behavior_report"
  | "school_event"
  | "late_arrival"
  | "success_congrats"
  // Marketing templates
  | "promotional"
  | "new_product"
  | "special_offer"
  | "event_invitation"
  // Transactional templates
  | "order_confirmation"
  | "delivery_status"
  | "payment_receipt"
  | "appointment_reminder"
  | "flash_sale"
  | "thank_you";

interface Template {
  id: TemplateId;
  title: string;
  icon: LucideIcon;
  desc: string;
  category: "academic" | "marketing" | "transactional";
  requiredFields: string[]; // Nouveaux champs requis pour l'importation
  optionalFields?: string[]; // Champs optionnels (? pour rendre la propriété facultative)
  variables: string[]; // Variables utilisées dans ce template
}

const TEMPLATES: Template[] = [
  // Marketing Templates (4)
  {
    id: "promotional",
    title: "Promotion",
    icon: Tag,
    desc: "Profitez de notre promotion exceptionnelle ! {discount}% de réduction sur {product_name}. Offre valable jusqu'au {expiry_date}. {company}",
    category: "marketing",
    requiredFields: ["nom", "prenom", "telephone"],
    optionalFields: ["email", "segment"],
    variables: [
      "{first_name}",
      "{last_name}",
      "{discount}",
      "{product_name}",
      "{expiry_date}",
      "{company}",
    ],
  },
  {
    id: "new_product",
    title: "Nouveau Produit",
    icon: Sparkles,
    desc: "Découvrez notre nouveauté ! {product_name} est maintenant disponible chez {company}. Venez vite l'essayer !",
    category: "marketing",
    requiredFields: ["nom", "prenom", "telephone"],
    optionalFields: ["email", "derniere_visite"],
    variables: ["{first_name}", "{last_name}", "{product_name}", "{company}"],
  },
  {
    id: "special_offer",
    title: "Offre Spéciale",
    icon: Star,
    desc: "Offre exclusive pour {first_name} ! Utilisez le code {offer_code} et bénéficiez de {discount}% sur votre prochain achat chez {company}.",
    category: "marketing",
    requiredFields: ["nom", "prenom", "telephone"],
    optionalFields: ["email", "code_promo", "pourcentage"],
    variables: [
      "{first_name}",
      "{last_name}",
      "{offer_code}",
      "{discount}",
      "{company}",
    ],
  },
  {
    id: "event_invitation",
    title: "Invitation",
    icon: Calendar,
    desc: "Cher(e) {first_name}, nous vous invitons à notre événement le {event_date}. {company} vous réserve des surprises !",
    category: "marketing",
    requiredFields: ["nom", "prenom", "telephone"],
    optionalFields: ["email", "date_evenement"],
    variables: ["{first_name}", "{last_name}", "{event_date}", "{company}"],
  },
  {
    id: "thank_you",
    title: "Remerciement",
    icon: Heart,
    desc: "Merci {first_name} pour votre achat chez {company}. Utilisez le code {offer_code} pour bénéficier de {discount}% sur votre prochaine visite.",
    category: "marketing",
    requiredFields: ["nom", "prenom", "telephone", "code_promo"],
    optionalFields: ["email", "pourcentage"],
    variables: [
      "{first_name}",
      "{last_name}",
      "{offer_code}",
      "{discount}",
      "{company}",
    ],
  },

  // Transactional Templates (4)
  {
    id: "order_confirmation",
    title: "Confirmation",
    icon: Check,
    desc: "Bonjour {first_name}, votre commande #{order_number} est confirmée. Montant: {payment_amount} FCFA. Merci de votre confiance !",
    category: "transactional",
    requiredFields: [
      "nom",
      "prenom",
      "telephone",
      "numero_commande",
      "montant",
    ],
    optionalFields: ["email", "date_commande"],
    variables: [
      "{first_name}",
      "{order_number}",
      "{payment_amount}",
      "{company}",
    ],
  },
  {
    id: "delivery_status",
    title: "Livraison",
    icon: Send,
    desc: "Votre colis #{tracking_code} sera livré le {delivery_date}. Suivez votre livraison sur notre site. {company}",
    category: "transactional",
    requiredFields: ["nom", "prenom", "telephone", "numero_suivi"],
    optionalFields: ["email", "date_livraison"],
    variables: [
      "{first_name}",
      "{tracking_code}",
      "{delivery_date}",
      "{company}",
    ],
  },
  {
    id: "payment_receipt",
    title: "Paiement",
    icon: FileText,
    desc: "Reçu de paiement - {payment_amount} FCFA pour {service_name}. Référence: {reference}. Merci de votre confiance, {company}",
    category: "transactional",
    requiredFields: [
      "nom",
      "prenom",
      "telephone",
      "montant",
      "service",
      "reference",
    ],
    optionalFields: ["email"],
    variables: [
      "{first_name}",
      "{payment_amount}",
      "{service_name}",
      "{reference}",
      "{company}",
    ],
  },
  {
    id: "appointment_reminder",
    title: "Rendez-vous",
    icon: Clock,
    desc: "Rappel: Votre RDV est prévu le {appointment_time} pour {service_name}. En cas d'empêchement, merci de nous contacter.",
    category: "transactional",
    requiredFields: ["nom", "prenom", "telephone", "heure_rdv", "service"],
    optionalFields: ["email", "lieu"],
    variables: ["{first_name}", "{appointment_time}", "{service_name}"],
  },
  {
    id: "flash_sale",
    title: "Vente Flash",
    icon: Zap,
    desc: "VENTE FLASH ! {first_name}, profitez de {discount}% sur tous nos produits chez {company} aujourd'hui seulement !",
    category: "marketing",
    requiredFields: ["nom", "prenom", "telephone", "discount"],
    optionalFields: ["email", "pourcentage"],
    variables: ["{first_name}", "{last_name}", "{discount}", "{company}"],
  },

  // Academic Templates (9)
  {
    id: "trimester_grades",
    title: "Moyenne Trimestrielle",
    icon: Star,
    desc: "Bonjour, la moyenne trimestrielle de {student_name} en classe de {class_name} est de {average_grade}/20. Cordialement, {school_name}",
    category: "academic",
    requiredFields: ["nom", "prenom", "telephone", "classe", "moyenne"],
    optionalFields: ["trimestre", "etablissement"],
    variables: [
      "{student_name}",
      "{class_name}",
      "{average_grade}",
      "{school_name}",
    ],
  },
  {
    id: "exam_results",
    title: "Résultats d'Examens",
    icon: Trophy,
    desc: "Les résultats de {student_name} ({class_name}): {exam_results}. Moyenne générale: {overall_average}/20. {school_name}",
    category: "academic",
    requiredFields: [
      "nom",
      "prenom",
      "telephone",
      "classe",
      "resultats",
      "moyenne_generale",
    ],
    optionalFields: ["etablissement"],
    variables: [
      "{student_name}",
      "{class_name}",
      "{exam_results}",
      "{overall_average}",
      "{school_name}",
    ],
  },
  {
    id: "success_congrats",
    title: "Félicitations",
    icon: PartyPopper,
    desc: "Félicitations à {student_name} pour son excellente moyenne de {average_grade}/20 en {class_name} ! Continuez ainsi ! {school_name}",
    category: "academic",
    requiredFields: ["nom", "prenom", "telephone", "classe", "moyenne"],
    optionalFields: ["Établissement", "Matière"],
    variables: [
      "{student_name}",
      "{class_name}",
      "{average_grade}",
      "{school_name}",
    ],
  },
  {
    id: "absence_alert",
    title: "Absence",
    icon: Calendar,
    desc: "Nous vous informons de l'absence de {student_name} le {absence_date} en classe de {class_name}. Merci de justifier cette absence.",
    category: "academic",
    requiredFields: ["nom", "prenom", "telephone", "classe", "date_absence"],
    optionalFields: ["Motif_absence"],
    variables: ["{student_name}", "{class_name}", "{absence_date}"],
  },
  {
    id: "late_arrival",
    title: "Retard",
    icon: Clock,
    desc: "Notification de retard",
    category: "academic",
    requiredFields: ["nom", "prenom", "telephone", "classe", "heure_arrivee"],
    optionalFields: ["date", "motif"],
    variables: [
      "{student_name}",
      "{class_name}",
      "{arrival_time}",
      "{date}",
      "{school_name}",
    ],
  },
  {
    id: "parent_meeting",
    title: "Réunion Parents",
    icon: Users,
    desc: "Invitation réunion parents-profs",
    category: "academic",
    requiredFields: ["nom", "prenom", "telephone", "classe"],
    optionalFields: ["date_reunion", "heure_reunion", "salle"],
    variables: [
      "{student_name}",
      "{class_name}",
      "{meeting_date}",
      "{meeting_time}",
      "{room}",
      "{school_name}",
    ],
  },
  {
    id: "school_event",
    title: "Événement",
    icon: CalendarDays,
    desc: "Événements scolaires",
    category: "academic",
    requiredFields: ["nom", "prenom", "telephone", "classe"],
    optionalFields: ["nom_evenement", "date_evenement", "lieu"],
    variables: [
      "{student_name}",
      "{class_name}",
      "{event_name}",
      "{event_date}",
      "{location}",
      "{school_name}",
    ],
  },
  {
    id: "behavior_report",
    title: "Comportement",
    icon: AlertCircle,
    desc: "Rapport de comportement",
    category: "academic",
    requiredFields: ["nom", "prenom", "telephone", "classe", "incident"],
    optionalFields: ["date_incident", "mesure_prise"],
    variables: [
      "{student_name}",
      "{class_name}",
      "{incident}",
      "{date}",
      "{measure}",
      "{school_name}",
    ],
  },
  {
    id: "homework_reminder",
    title: "Devoirs",
    icon: FileText,
    desc: "Rappel des devoirs",
    category: "academic",
    requiredFields: [
      "nom",
      "prenom",
      "telephone",
      "classe",
      "matiere",
      "devoir",
    ],
    optionalFields: ["date_limite"],
    variables: [
      "{student_name}",
      "{class_name}",
      "{subject}",
      "{homework}",
      "{due_date}",
      "{school_name}",
    ],
  },
];

interface Contact {
  prenom: string;
  nom: string;
  telephone: string;
  moyenne?: number;
  classe?: string;
  additionalFields?: Record<string, string>; // Pour stocker des champs dynamiques
}

// Add interface for SMS response
interface SMSResponse {
  statusCode: SMSErrorCode;
  statusText: string;
  messageId: string;
  messageDetailId: string;
  recipient: string;
}

// Add interface for message tracking
interface MessageStatus {
  messageId: string;
  messageDetailId: string;
  recipient: string;
  contact: Contact;
  status: "sent" | "delivered" | "failed";
  timestamp: Date;
  errorMessage?: string;
  errorDetails?: SMSError;
}

interface CampaignData {
  id: string;
  name: string;
  template?: TemplateId;
  contacts: Contact[];
  message: string;
  signature: string;
  responseType: "no-response" | "with-response";
  scheduledDate?: Date;
}

// Modèles de noms prédéfinis par type
const CAMPAIGN_NAME_TEMPLATES = {
  academic: [
    "Bulletin Trimestre {term} {year}",
    "Résultats Examens {month} {year}",
    "Réunion Parents {date}",
    "Événement Scolaire: {event_name}",
  ],
  marketing: [
    "Promo {product} {discount}%",
    "Lancement {product_name}",
    "Soldes {season} {year}",
    "Événement: {event_name}",
  ],
  transactional: [
    "Confirmation Commande #{order_id}",
    "Livraison Commande #{order_id}",
    "Rappel RDV {date}",
    "Reçu Paiement #{payment_id}",
  ],
};

interface FileUploadState {
  loading: boolean;
  error: string | null;
  success: boolean;
  fileName: string | null;
}

export default function NewCampaign() {
  const { data: session } = useSession();
  const { addSolde } = useStore();
  const [message, setMessage] = useState<string>("");
  const [optimize, setOptimize] = useState(false);
  const [campaignType, setCampaignType] =
    useState<Template["category"]>("academic");
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [scheduledTime, setScheduledTime] = useState("now");
  const [selectedHour, setSelectedHour] = useState<string>("");
  const [responseType, setResponseType] = useState("no-response");
  const [selectedTemplate, setSelectedTemplate] = useState<
    TemplateId | undefined
  >();
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [studentGrade, setStudentGrade] = useState<number>(0);
  const [studentName, setStudentName] = useState<string>("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [fileError, setFileError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState<string>("");
  const [messageStatuses, setMessageStatuses] = useState<MessageStatus[]>([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [uploadState, setUploadState] = useState<FileUploadState>({
    loading: false,
    error: null,
    success: false,
    fileName: null,
  });
  const [timest, setTimest] = useState<number>(0);
  const [isContactActive, setIsContactActive] =
    useState<string>("contacts-unique");

  const [isActiveIndex, setIsActiveIndex] = useState<number | null>(null);

  // console.log("scheduledDate: " + scheduledDate);
  // console.log("selectedHour: " + selectedHour);

  // console.log(timest);

  // New state for single contact form
  const [singleContact, setSingleContact] = useState<Contact>({
    prenom: "",
    nom: "",
    telephone: "",
    moyenne: undefined,
    classe: undefined,
  });

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadState({
      loading: true,
      error: null,
      success: false,
      fileName: file.name,
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const fileType = file.name.endsWith(".csv") ? "csv" : "excel";
      const response = await fetch(`/api/campaigns/${fileType}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      // console.log(data);
      setContacts(data.res);

      if (!response.ok) {
        throw new Error(data.error || "Échec du téléchargement du fichier");
      }

      setUploadState((prev) => ({
        ...prev,
        loading: false,
        success: true,
        error: null,
      }));

      toast.success(`${data.count} contacts importés avec succès !`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue";
      setUploadState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
        success: false,
      }));
      toast.error(errorMessage);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  });

  // Add new state for file input reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add new state for campaign data
  const [campaignData, setCampaignData] = useState<CampaignData>({
    id: uuidv4(),
    name: "",
    contacts: [],
    message: "",
    signature,
    responseType: "no-response",
  });

  // Ajout de l'état pour la sauvegarde automatique
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout>();
  const [lastSaved, setLastSaved] = useState<Date>();
  const [isSaving, setIsSaving] = useState(false);

  // Get variables based on campaign type
  const getVariables = () => {
    switch (campaignType) {
      case "academic":
        return [
          "{student_name}",
          "{average_grade}",
          "{subject}",
          "{school_name}",
          "{exam_results}",
          "{overall_average}",
          "{absence_date}",
          "{class_name}",
        ];
      case "marketing":
        return [
          "{first_name}",
          "{last_name}",
          "{company}",
          "{offer_code}",
          "{expiry_date}",
          "{discount}",
          "{product_name}",
          "{event_date}",
        ];
      case "transactional":
        return [
          "{order_number}",
          "{tracking_code}",
          "{delivery_date}",
          "{payment_amount}",
          "{appointment_time}",
          "{service_name}",
          "{customer_name}",
          "{reference}",
        ];
      default:
        return [];
    }
  };

  // Mock data for dropdowns
  const classes = [
    "6ème A",
    "6ème B",
    "5ème A",
    "5ème B",
    "4ème A",
    "4ème B",
    "3ème A",
    "3ème B",
  ];

  // Calculate SMS details
  const charCount = message.length;
  const smsCount = Math.ceil(charCount / 160);

  // Handle template selection
  const handleTemplateChange = (templateId: TemplateId) => {
    setSelectedTemplate(templateId);
    const template = TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      const messageText = template.desc;

      // console.log(messageText);
      setMessage(messageText);
    }
  };

  // Fonction pour générer les en-têtes de modèle en fonction du template
  const getTemplateHeadersForTemplate = (templateId: TemplateId): string => {
    const template = TEMPLATES.find((t) => t.id === templateId);
    if (!template) {
      // Retour par défaut basé sur la catégorie
      return getTemplateHeaders();
    }

    // Combiner les champs requis et optionnels
    const allFields = [
      ...template.requiredFields,
      ...(template.optionalFields || []),
    ];
    const header = allFields.join(",");

    // Créer des données d'exemple basées sur le type de champ
    const sampleData = allFields
      .map((field) => {
        const normalizedField = field
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

        switch (normalizedField) {
          case "nom":
            return "Dupont";
          case "prenom":
            return "Jean";
          case "telephone":
            return "+33612345678";
          case "classe":
            return "6ème A";
          case "moyenne":
            return "15.5";
          case "numerocommande":
            return "CMD12345";
          case "montant":
            return "15000";
          case "email":
            return "jean.dupont@email.com";
          case "datecommande":
            return "01/03/2025";
          case "trimestre":
            return "T1";
          case "matiere":
            return "Mathématiques";
          case "numerosuivi":
            return "TRK12345";
          case "datelivraison":
            return "05/03/2025";
          case "service":
            return "Consultation";
          case "reference":
            return "REF98765";
          case "heurerdv":
            return "14:30";
          case "dateabsence":
            return "28/02/2025";
          case "etablissement":
            return "Collège Saint-Exupéry";
          case "resultats":
            return "Math:16,Français:14,Histoire:15";
          case "moyennegenerale":
            return "15.2";
          case "incident":
            return "Comportement perturbateur";
          case "mesure_prise":
            return "Convocation des parents";
          default:
            return "Exemple";
        }
      })
      .join(",");

    return `${header}\n${sampleData}`;
  };

  // Campaign options based on type
  const campaignOptions = {
    marketing: [
      {
        value: "promotional",
        label: "Promotionnel",
        description: "Promotions & Annonces",
      },
      {
        value: "product",
        label: "Produit",
        description: "Lancement & Nouveautés",
      },
    ],
    transactional: [
      {
        value: "notification",
        label: "Notification",
        description: "Messages de service",
      },
      {
        value: "confirmation",
        label: "Confirmation",
        description: "Confirmations & Reçus",
      },
    ],
    academic: [
      { value: "grades", label: "Notes", description: "Moyennes & Résultats" },
      {
        value: "info",
        label: "Information",
        description: "Messages aux parents",
      },
    ],
  };

  // Fix campaign type handling
  const handleCampaignTypeChange = (type: Template["category"]) => {
    setCampaignType(type);
    setSelectedTemplate(undefined);
    setContacts([]);
    setSingleContact({
      prenom: "",
      nom: "",
      telephone: "",
      moyenne: undefined,
      classe: undefined,
    });
    if (type === "academic") {
      setStudentGrade(0);
      setStudentName("");
    }
  };

  // Handle option selection
  const handleOptionSelect = (value: string) => {
    setResponseType(value as "no-response" | "with-response");
  };

  // Sample templates for file download
  const getTemplateHeaders = () => {
    switch (campaignType) {
      case "academic":
        return "Nom,Prénom,Téléphone,Classe,Moyenne\nDupont,Jean,+33612345678,6ème A,15.5";
      default:
        return "Nom,Prénom,Téléphone\nDupont,Jean,+33612345678";
    }
  };

  // Handle file download
  const handleDownloadTemplate = () => {
    let headers;
    if (selectedTemplate) {
      headers = getTemplateHeadersForTemplate(selectedTemplate);
    } else {
      headers = getTemplateHeaders();
    }

    const blob = new Blob([headers], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = selectedTemplate
      ? `template_${selectedTemplate}.csv`
      : `template_${campaignType}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Composant pour afficher les informations sur les champs requis
  const RequiredFieldsInfo = () => {
    // Obtenir le template actuellement sélectionné
    const template = selectedTemplate
      ? TEMPLATES.find((t) => t.id === selectedTemplate)
      : null;

    // Si aucun template n'est sélectionné, montrer les informations par défaut
    if (!template) {
      return (
        <div className="p-4 bg-gray-50 rounded-xl text-sm space-y-2">
          <div className="font-medium text-gray-700">
            Format de fichier requis :
          </div>
          <div className="space-y-1 text-gray-600">
            <p>• Fichier CSV (séparateur: virgule)</p>
            <p>• Fichier Excel (séparateur: virgule)</p>
            <p>• Encodage UTF-8</p>
            <p>• Colonnes requises :</p>
            <div className="pl-4">
              {campaignType === "academic" ? (
                <code className="text-[#67B142]">
                  nom,prenom,telephone,classe,moyenne
                </code>
              ) : (
                <code className="text-[#67B142]">nom,prenom,telephone</code>
              )}
            </div>
            {campaignType === "academic" && (
              <p>• Format moyenne : nombre décimal (ex: 15.5)</p>
            )}
          </div>
        </div>
      );
    }

    // Si un template est sélectionné, montrer les informations spécifiques
    return (
      <div className="p-4 bg-gray-50 rounded-xl text-sm space-y-2">
        <div className="font-medium text-gray-700">
          Format de fichier requis pour "{template.title}" :
        </div>
        <div className="space-y-1 text-gray-600">
          <p>• Fichier CSV (séparateur: virgule)</p>
          <p>• Encodage UTF-8</p>
          <p>• Colonnes requises :</p>
          <div className="pl-4">
            <code className="text-[#67B142]">
              {template.requiredFields.join(",")}
            </code>
          </div>
          {template.optionalFields && template.optionalFields.length > 0 && (
            <>
              <p>• Colonnes optionnelles :</p>
              <div className="pl-4">
                <code className="text-blue-500">
                  {template.optionalFields.join(",")}
                </code>
              </div>
            </>
          )}
          {template.category === "academic" && (
            <p>• Format moyenne : nombre décimal (ex: 15.5)</p>
          )}

          {/* Ajout d'exemples de variables */}
          <p className="mt-2">• Variables disponibles dans ce template :</p>
          <div className="pl-4 mt-1 flex flex-wrap gap-2">
            {template.variables &&
              template.variables.map((variable) => (
                <span
                  key={variable}
                  className="px-2 py-1 bg-[#67B142]/10 text-[#67B142] rounded-md text-xs"
                >
                  {variable}
                </span>
              ))}
          </div>
        </div>
      </div>
    );
  };

  // Handle single contact form changes
  const handleSingleContactChange = (
    field: keyof Contact,
    value: string | number
  ) => {
    setSingleContact((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "classe" ? { class: value as string } : {}),
    }));
  };

  // Handle add single contact
  const handleAddContact = () => {
    // Validate required fields
    if (
      !singleContact.prenom ||
      !singleContact.nom ||
      !singleContact.telephone
    ) {
      setFileError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Validate phone number format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(singleContact.telephone)) {
      setFileError("Format de numéro de téléphone invalide (ex: 778413584)");
      return;
    }

    // Validate average for academic campaigns
    if (
      campaignType === "academic" &&
      (singleContact.moyenne === undefined ||
        Number(singleContact.moyenne) < 0 ||
        Number(singleContact.moyenne) > 20)
    ) {
      setFileError("La moyenne doit être comprise entre 0 et 20");
      return;
    }

    // Add the contact
    setContacts([singleContact]);
    setFileError("");

    // Reset form
    setSingleContact({
      prenom: "",
      nom: "",
      telephone: "",
      moyenne: undefined,
      classe: undefined,
    });
  };

  // console.log(message);

  // Handle schedule change
  const handleScheduleChange = (date: Date | undefined) => {
    setScheduledDate(date);
  };

  // Parse HTML response from SMS API
  const parseHTMLResponse = (html: string): SMSResponse | null => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const smallTags = doc.getElementsByTagName("small");

      const response: Partial<SMSResponse> = {};

      for (const tag of smallTags) {
        const text = tag.textContent?.trim() || "";
        if (text.startsWith("STATUS_CODE:"))
          response.statusCode = text.split(":")[1].trim() as SMSErrorCode;
        if (text.startsWith("STATUS_TEXT:"))
          response.statusText = text.split(":")[1].trim();
        if (text.startsWith("MESSAGE_ID:"))
          response.messageId = text.split(":")[1].trim();
        if (text.startsWith("MESSAGEDETAIL_ID:"))
          response.messageDetailId = text.split(":")[1].trim();
        if (text.startsWith("RECIPIENT:"))
          response.recipient = text.split(":")[1].trim();
      }

      return response as SMSResponse;
    } catch (error) {
      console.error("Error parsing SMS response:", error);
      return null;
    }
  };

  // Fonction auxiliaire pour obtenir les champs requis pour le formulaire
  const getDynamicFields = () => {
    if (!selectedTemplate) return [];

    const template = TEMPLATES.find((t) => t.id === selectedTemplate);
    if (!template) return [];

    // Filtrer pour exclure les champs déjà présents dans le formulaire de base
    const standardFields = ["nom", "prenom", "telephone", "classe", "moyenne"];
    const additionalFields = [
      ...template.requiredFields,
      ...(template.optionalFields || []),
    ].filter((field) => !standardFields.includes(field));

    return additionalFields;
  };

  const handleCampaignNameChange = (name: string) => {
    setCampaignData((prev) => ({ ...prev, name }));
  };

  // console.log(campaignData);

  const handleSendCampaign = async () => {
    // for (const contact of contacts) {
    //   const newMessage = rewriteMessage(contact, message, signature);
    //   console.log(contact);

    //   console.log(newMessage);
    // }

    const campagneID = uuidv4();

    if (!campaignData.name.trim()) {
      toast.error("Veuillez donner un nom à votre campagne", {
        style: { backgroundColor: "#EF4444", color: "white" },
      });
      return;
    }

    if (contacts.length < 1) {
      toast.error("Veuillez ajouter au moins un contact", {
        style: { backgroundColor: "#EF4444", color: "white" },
      });
      return;
    }

    setLoading(true);
    const failedMessages: MessageStatus[] = [];
    const successMessages: MessageStatus[] = [];
    let errorResp: any;

    // 1. Créer la campagne d'abord
    const campaignResponse = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: campagneID,
        name: campaignData.name,
        type: campaignType,
        message: message,
        contacts: contacts.map((contact) => ({
          prenom: contact.prenom,
          nom: contact.nom,
          telephone: contact.telephone,
        })),
        status: "scheduled",
      }),
    });

    if (!campaignResponse.ok) {
      const errorData = await campaignResponse.json();
      throw new Error(
        errorData.error || "Erreur lors de la création de la campagne"
      );
    }

    try {
      for (const contact of contacts) {
        try {
          const newMessage = rewriteMessage(contact, message, signature);
          const response = await fetch("/api/sms/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              recipient: contact.telephone,
              message: newMessage,
              campaignId: campagneID,
              campaignName: campaignData.name,
              signature,
              timest: timest,
            }),
          });

          const responseClone = response.clone();
          const responseJson = await response.json();
          errorResp = responseJson;

          const responseText = await responseClone.text();

          const parsedResponse = parseHTMLResponse(responseText);

          if (!parsedResponse) {
            throw new Error(
              `Failed to parse response for ${contact.telephone}`
            );
          }

          const errorDetails = getSMSErrorDetails(parsedResponse.statusCode);

          if (parsedResponse.statusCode !== "200") {
            throw new Error(formatSMSErrorMessage(errorDetails));
          }

          // Add to message statuses
          const messageStatus: MessageStatus = {
            messageId: parsedResponse.messageId,
            messageDetailId: parsedResponse.messageDetailId,
            recipient: parsedResponse.recipient,
            contact,
            status: "sent",
            timestamp: new Date(),
            errorDetails:
              parsedResponse.statusCode === "200" ? undefined : errorDetails,
          };

          // setMessageStatuses((prev) => [...prev, messageStatus]);
          successMessages.push(messageStatus);
        } catch (error) {
          console.log(error);
          // toast.error(error.response.data.error, {
          //   style: { color: "#EF4444" },
          //   position: "top-right",
          // });
          const errorMessage =
            error instanceof Error ? error.message : "Erreur inconnue";
          // console.log(errorMessage);
          failedMessages.push({
            messageId: "",
            messageDetailId: "",
            recipient: contact.telephone,
            contact,
            status: "failed",
            timestamp: new Date(),
            errorMessage,
          });
        }
      }

      // Count successes and failures
      // console.log(failedMessages);

      if (errorResp) {
        toast.error(errorResp.error, {
          style: { color: "#EF4444" },
          position: "top-right",
        });
      }
      console.log(errorResp);
      const successful = successMessages.length;
      const failed = failedMessages.length;

      if (successful) {
        const failureCount = contacts.length - successful;
        setSuccess(`${successful} message(s) envoyé(s) avec succès`);
        toast.success(`${successful} message(s) envoyé(s) avec succès`, {
          style: { color: "#67B142" },
        });
        setShowStatusModal(true);
        await fetch(`/api/campaigns/${campagneID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "sent",
            successCount: successful,
            failureCount: failureCount,
          }),
        });
      } else {
        const failureCount = contacts.length - successful;
        // console.log(failedMessages);
        // const failureDetails = failedMessages
        //   .map((msg) => `${msg.contact.telephone}: ${msg.errorMessage}`)
        //   .join("\n");
        // toast.error(`${successful} message(s) envoyé(s), ${failed} échec(s)`, {
        //   style: { color: "#EF4444" },
        // });
        setError(`${successful} message(s) envoyé(s), ${failed} échec(s)`);
        await fetch(`/api/campaigns/${campagneID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "failed",
            successCount: successful,
            failureCount: failureCount,
          }),
        });
      }
    } catch (error) {
      setError("Une erreur est survenue lors de l'envoi de la campagne");
      console.error("Campaign error:", error);
    } finally {
      setLoading(false);

      const response = await fetch(
        `/api/user/${session?.user?.id}/getSmsCredit`
      );
      const data = await response.json();
      if (data) {
        addSolde(data.smsCredits);
      }
    }
  };

  // Add status modal component
  const StatusModal = () => {
    if (!showStatusModal || messageStatuses.length === 0) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Statut des messages</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStatusModal(false)}
              className="hover:bg-gray-100 rounded-full p-2"
            >
              ✕
            </Button>
          </div>

          <div className="space-y-2">
            {messageStatuses.map((status) => (
              <div
                key={status.messageId}
                className="p-4 bg-gray-50 rounded-xl flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">
                    {status.contact.prenom} {status.contact.nom}
                  </div>
                  <div className="text-sm text-gray-500">
                    {status.recipient}
                  </div>
                  <div className="text-xs text-gray-400">
                    ID: {status.messageId}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`px-2 py-1 rounded-full text-sm ${
                      status.status === "sent"
                        ? "bg-green-100 text-green-700"
                        : status.status === "delivered"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {status.status === "sent"
                      ? "Envoyé"
                      : status.status === "delivered"
                      ? "Délivré"
                      : "Échec"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {format(status.timestamp, "HH:mm:ss")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Fonction de sauvegarde automatique

  // Obtenir les variables en fonction du template sélectionné
  const getVariablesForTemplate = (templateId: TemplateId): string[] => {
    const template = TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      return template.variables;
    }
    return getVariables();
  };

  // Déclencher la sauvegarde automatique lors des modifications
  // useEffect(() => {
  //   if (saveTimeout) clearTimeout(saveTimeout);
  //   const timeout = setTimeout(autoSaveCampaign, 2000);
  //   setSaveTimeout(timeout);

  //   return () => {
  //     if (saveTimeout) clearTimeout(saveTimeout);
  //   };
  // }, [campaignData, message, contacts, autoSaveCampaign]);

  // Fonction pour suggérer des noms de campagne
  const suggestCampaignName = () => {
    const template =
      CAMPAIGN_NAME_TEMPLATES[campaignType][
        Math.floor(Math.random() * CAMPAIGN_NAME_TEMPLATES[campaignType].length)
      ];

    const now = new Date();
    return template
      .replace("{year}", now.getFullYear().toString())
      .replace("{month}", now.toLocaleString("fr", { month: "long" }))
      .replace("{date}", format(now, "dd/MM/yyyy"))
      .replace("{term}", () => (Math.floor(now.getMonth() / 4) + 1).toString())
      .replace(
        "{season}",
        ["Hiver", "Printemps", "Été", "Automne"][Math.floor(now.getMonth() / 3)]
      );
  };

  useEffect(() => {
    // Extraction des heures et minutes de selectedHour
    if (!scheduledDate) return;
    const [hours, minutes] = selectedHour.split(":").map(Number);

    // Création d'une nouvelle date en combinant scheduledDate et selectedHour
    const combinedDateTime = new Date(scheduledDate);
    combinedDateTime.setHours(hours, minutes, 0, 0);
    const timestamp = combinedDateTime.getTime();
    // console.log(scheduledDate);
    // console.log(selectedHour);
    // console.log(timestamp);
    setTimest(timestamp);
  }, [scheduledDate, selectedHour]);

  // console.log(file);

  // useEffect(() => {
  //   console.log("scheduledDate: " + scheduledDate);
  //   console.log("selectedHour: " + selectedHour);
  // }, [scheduledDate, selectedHour]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Hidden file input for bulk import */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={() => console.log("Yes")}
        />

        {/* Header with dynamic gradient and floating elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#67B142] via-[#4CAF50] to-[#67B142] p-12"
        >
          <div className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-white mb-3"
            >
              Nouvelle Campagne SMS
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-white/90"
            >
              Créez et envoyez des campagnes SMS personnalisées
            </motion.p>
          </div>
          <div className="absolute right-0 top-0 w-96 h-full opacity-10 transform rotate-6">
            <MessageSquare className="w-full h-full" />
          </div>
          {/* Floating elements */}
          <div className="absolute top-8 right-8 flex items-center gap-4">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center"
            >
              <Book className="w-6 h-6 text-white" />
            </motion.div>
            <motion.div
              animate={{ y: [-10, 0, -10] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center"
            >
              <Trophy className="w-6 h-6 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Type de Campagne */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Type de Campagne</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                type: "academic" as const,
                label: "Académique",
                icon: GraduationCap,
                description: "Communications scolaires",
              },
              {
                type: "marketing" as const,
                label: "Marketing",
                icon: Tag,
                description: "Promotions et offres",
              },
              {
                type: "transactional" as const,
                label: "Transactionnel",
                icon: FileText,
                description: "Confirmations et notifications",
              },
            ].map((option) => (
              <motion.div
                key={option.type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={campaignType === option.type ? "default" : "outline"}
                  className={`w-full h-auto py-6 rounded-xl ${
                    campaignType === option.type
                      ? "bg-[#67B142] hover:bg-[#67B142]/90"
                      : "hover:border-[#67B142] hover:text-[#67B142]"
                  }`}
                  onClick={() => handleCampaignTypeChange(option.type)}
                >
                  <div className="flex flex-col items-center gap-2">
                    <option.icon className="w-6 h-6" />
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs opacity-70">
                      {option.description}
                    </span>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Nom de la Campagne */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Nom de la Campagne
            </h2>
            <Button
              variant="outline"
              onClick={() => handleCampaignNameChange(suggestCampaignName())}
              className="text-[#67B142] hover:text-white hover:bg-[#67B142] rounded-[6px]"
            >
              Suggérer un nom
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="campaignName">Nom de la campagne</Label>
            <Input
              id="campaignName"
              placeholder="Ex: Promotion Juillet 2024"
              value={campaignData.name}
              onChange={(e) => handleCampaignNameChange(e.target.value)}
              className="max-w-md"
            />
            {isSaving && (
              <p className="text-sm text-muted-foreground">
                Sauvegarde en cours...
              </p>
            )}
            {lastSaved && (
              <p className="text-sm text-muted-foreground">
                Dernière sauvegarde: {format(lastSaved, "HH:mm:ss")}
              </p>
            )}
          </div>
        </div>

        {/* Campaign Type Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 overflow-x-auto pb-2"
        >
          {[
            { id: "marketing" as const, label: "Marketing", icon: Tag },
            {
              id: "transactional" as const,
              label: "Transactionnel",
              icon: FileText,
            },
            {
              id: "academic" as const,
              label: "Notes & Résultats",
              icon: GraduationCap,
            },
          ].map((type) => (
            <motion.button
              key={type.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCampaignTypeChange(type.id)}
              style={{
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
              }}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                campaignType === type.id
                  ? "bg-[#67B142] text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-[#67B142]/10"
              }`}
            >
              <type.icon className="w-4 h-4" />
              {type.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Quick Templates Section - Filtered by campaign type */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {TEMPLATES.filter(
            (template) => template.category === campaignType
          ).map((template) => (
            <motion.div
              key={template.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTemplateChange(template.id)}
              style={{
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
              }}
              className={`cursor-pointer p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ${
                selectedTemplate === template.id
                  ? "border-2 border-[#67B142]"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#67B142]/10 rounded-xl">
                  <template.icon className="w-5 h-5 text-[#67B142]" />
                </div>
                <span className="font-medium text-gray-800">
                  {template.title}
                </span>
              </div>
              <p className="text-sm text-gray-600">{template.desc}</p>
              {selectedTemplate === template.id && (
                <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                  <div className="text-xs text-gray-500">Variables:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {template.variables.map((variable) => (
                      <span
                        key={variable}
                        className="px-1.5 py-0.5 bg-[#67B142]/10 text-[#67B142] rounded text-xs"
                      >
                        {variable}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Message */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#67B142]/10 rounded-2xl">
                <MessageSquare className="w-6 h-6 text-[#67B142]" />
              </div>
              <span className="text-lg font-semibold text-gray-800">
                Composez votre message
              </span>
            </div>

            <div className="relative group">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="h-48 font-mono text-base border-2 focus:border-[#67B142] transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md"
                placeholder="Tapez votre message..."
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="absolute top-3 right-3"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 hover:text-[#67B142] hover:bg-[#67B142]/10 rounded-xl"
                  onClick={() => setOptimize(!optimize)}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Optimiser
                </Button>
              </motion.div>
            </div>

            <div className="flex items-center justify-between px-6 py-3 bg-white rounded-2xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <span
                    className={`text-sm ${
                      charCount > 160 ? "text-amber-500" : "text-gray-600"
                    }`}
                  >
                    {charCount}/160 car.
                  </span>
                </div>
                <div className="w-px h-4 bg-gray-200" />
                <div className="flex items-center gap-2">
                  <span
                    className={`font-medium ${
                      smsCount > 1 ? "text-amber-500" : "text-[#67B142]"
                    }`}
                  >
                    {smsCount} {smsCount > 1 ? "SMS" : "SMS"}
                  </span>
                  {smsCount > 1 && (
                    <div className="text-xs px-2 py-1 bg-amber-50 text-amber-500 rounded-lg">
                      {Math.ceil((160 - (charCount % 160)) % 160)} car. avant
                      prochain SMS
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">
                  {smsCount > 1
                    ? `${Math.floor(charCount / 160)} SMS complet${
                        smsCount > 2 ? "s" : ""
                      } + ${charCount % 160} car.`
                    : "Standard GSM"}
                </span>
              </div>
            </div>

            {/* Variables Section - Dynamic based on template/campaign type */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#67B142]" />
                <span className="text-sm font-medium text-gray-700">
                  Variables disponibles
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate
                  ? getVariablesForTemplate(selectedTemplate).map(
                      (variable) => (
                        <motion.div
                          key={variable}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-[#67B142]/10 hover:bg-[#67B142]/20 text-[#67B142] border-none rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                            onClick={() => setMessage(message + variable)}
                          >
                            {variable}
                          </Button>
                        </motion.div>
                      )
                    )
                  : getVariables().map((variable) => (
                      <motion.div
                        key={variable}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="secondary"
                          size="sm"
                          className="bg-[#67B142]/10 hover:bg-[#67B142]/20 text-[#67B142] border-none rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                          onClick={() => setMessage(message + variable)}
                        >
                          {variable}
                        </Button>
                      </motion.div>
                    ))}
              </div>
            </div>

            {/* Save Template */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-6 bg-white rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#67B142]/10 rounded-xl">
                  <Tag className="w-5 h-5 text-[#67B142]" />
                </div>
                <span className="font-medium text-gray-800">
                  Sauvegarde du template
                </span>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 border-2 hover:border-[#67B142] hover:text-[#67B142] rounded-xl transition-all duration-300"
                >
                  Sauver mon texte
                </Button>
                <Select defaultValue="default">
                  <SelectTrigger className="flex-1 border-2 rounded-xl">
                    <SelectValue placeholder="Choisir un template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Template par défaut</SelectItem>
                    <SelectItem value="promo">Template promotionnel</SelectItem>
                    <SelectItem value="alert">
                      Template d&apos;alerte
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            {/* Sender Name */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-6 bg-white rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#67B142]/10 rounded-xl">
                    <Users className="w-5 h-5 text-[#67B142]" />
                  </div>
                  <span className="font-medium text-gray-800">Émetteur</span>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Maximum 11 caractères
                  </span>
                </div>
              </div>
              <div className="relative">
                <Input
                  placeholder={session?.user?.companyName || "?"}
                  maxLength={11}
                  className="max-w-[200px] border-2 focus:border-[#67B142] rounded-xl"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[#67B142]">
                  {session?.user?.companyName.length ?? 8}/11
                </div>
              </div>
            </motion.div>

            {/* Schedule */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-6 bg-white rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#67B142]/10 rounded-xl">
                  <Calendar className="w-5 h-5 text-[#67B142]" />
                </div>
                <span className="font-medium text-gray-800">Planification</span>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={scheduledTime === "now" ? "default" : "outline"}
                    className={`h-12 rounded-xl transition-all duration-300 ${
                      scheduledTime === "now"
                        ? "bg-[#67B142] hover:bg-[#67B142]/90 shadow-lg"
                        : "border-2 hover:border-[#67B142] hover:text-[#67B142]"
                    }`}
                    onClick={() => {
                      setScheduledTime("now");
                      setScheduledDate(undefined);
                    }}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Maintenant
                    {scheduledTime === "now" && (
                      <Check className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant={
                      scheduledTime === "scheduled" ? "default" : "outline"
                    }
                    className={`h-12 rounded-xl transition-all duration-300 ${
                      scheduledTime === "scheduled"
                        ? "bg-[#67B142] hover:bg-[#67B142]/90 shadow-lg"
                        : "border-2 hover:border-[#67B142] hover:text-[#67B142]"
                    }`}
                    onClick={() => setScheduledTime("scheduled")}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Programmer
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {scheduledTime === "scheduled" && (
                  <div className="space-y-4 animate-in fade-in-50">
                    <div className="grid grid-cols-2 gap-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal border-2 rounded-xl ${
                              !scheduledDate && "text-muted-foreground"
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {scheduledDate ? (
                              format(scheduledDate, "PPP", { locale: fr })
                            ) : (
                              <span>Choisir une date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={scheduledDate}
                            onSelect={handleScheduleChange}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>

                      <Select onValueChange={setSelectedHour}>
                        <SelectTrigger className="border-2 rounded-xl">
                          <SelectValue placeholder="Heure d'envoi" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={`${i}:00`}>
                              {`${i.toString().padStart(2, "0")}:00`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {scheduledDate && (
                      <div className="flex items-center gap-2 text-sm text-[#67B142]">
                        <Info className="w-4 h-4" />
                        <span>
                          Votre campagne sera envoyée le{" "}
                          {format(scheduledDate, "PPPP", { locale: fr })}
                          {selectedHour && <span> à {selectedHour}</span>}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Recipients Section */}
            <div className="p-6 bg-white rounded-2xl shadow-sm space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#67B142]/10 rounded-xl">
                    <Users className="w-5 h-5 text-[#67B142]" />
                  </div>
                  <span className="font-medium text-gray-800">
                    Destinataires
                  </span>
                </div>
                <div className="grid grid-cols-2  gap-2">
                  {/* <Button
                    variant="outline"
                    size="sm"
                    className={`rounded-xl transition-all duration-300 ${
                      isContactActive === "mes-contacts"
                        ? "bg-[#67B142] text-white"
                        : ""
                    }`}
                    onClick={() => setIsContactActive("mes-contacts")}
                    id="mes-contacts"
                  >
                    Mes contacts
                  </Button> */}
                  <MyContact
                    handleAddContactMyOwn={(contacts: ContactMy[]) =>
                      setContacts(contacts)
                    }
                  />
                  {/* <Button
                    variant="outline"
                    size="sm"
                    className={`rounded-xl transition-all duration-300 ${
                      isContactActive === "contacts-loues"
                        ? "bg-[#67B142] text-white"
                        : ""
                    }`}
                    onClick={() => setIsContactActive("contacts-loues")}
                    id="contacts-loues"
                  >
                    Contacts loués
                  </Button> */}
                  <LocationContact
                    handleAddContactMyOwn={(contacts: ContactMy[]) =>
                      setContacts(contacts)
                    }
                  />

                  <Button
                    variant="outline"
                    size="sm"
                    className={`rounded-xl transition-all duration-300 ${
                      isContactActive === "contacts-unique"
                        ? "bg-[#67B142] text-white"
                        : ""
                    }`}
                    // onClick={() => {
                    //   setContacts([]);
                    //   setFileError("");
                    // }}
                    onClick={() => setIsContactActive("contacts-unique")}
                    id="contacts-unique"
                  >
                    Contact unique
                  </Button>
                  <Button
                    {...getRootProps()}
                    variant="outline"
                    size="sm"
                    className={`rounded-xl transition-all duration-300 ${
                      isContactActive === "import-masse"
                        ? "bg-[#67B142] text-white"
                        : ""
                    }`}
                    // onClick={handleBulkImportClick}
                    // onClick={() => setIsContactActive("import-masse")}
                    id="import-masse"
                  >
                    Import en masse
                    <input {...getInputProps()} />
                  </Button>
                </div>
              </div>

              {/* File Format Information - Dynamic based on template */}
              <RequiredFieldsInfo />

              {contacts.length === 0 ? (
                // Single Contact Form
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Nom"
                      className="border-2 rounded-xl"
                      value={singleContact.nom}
                      onChange={(e) =>
                        handleSingleContactChange("nom", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Prénom"
                      className="border-2 rounded-xl"
                      value={singleContact.prenom}
                      onChange={(e) =>
                        handleSingleContactChange("prenom", e.target.value)
                      }
                    />
                  </div>
                  <Input
                    placeholder="Numéro de téléphone"
                    className="border-2 rounded-xl"
                    value={singleContact.telephone}
                    onChange={(e) =>
                      handleSingleContactChange("telephone", e.target.value)
                    }
                  />
                  {campaignType === "academic" && (
                    <div className="flex gap-4">
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        step="0.01"
                        placeholder="Moyenne /20"
                        className="border-2 rounded-xl"
                        value={singleContact.moyenne || ""}
                        onChange={(e) =>
                          handleSingleContactChange(
                            "moyenne",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                      <Select
                        value={selectedClass}
                        onValueChange={setSelectedClass}
                      >
                        <SelectTrigger className="border-2 rounded-xl">
                          <SelectValue placeholder="Classe" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {/* AJOUTEZ LA SECTION DYNAMIQUE ICI, JUSTE APRÈS LES CHAMPS ACADÉMIQUES */}
                  {selectedTemplate && getDynamicFields().length > 0 && (
                    <div className="space-y-4 pt-3 border-t border-dashed border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700">
                        Champs spécifiques au template
                      </h3>

                      <div className="grid grid-cols-1 gap-3">
                        {getDynamicFields().map((field) => (
                          <Input
                            key={field}
                            placeholder={field}
                            className="border-2 rounded-xl"
                            onChange={(e) => {
                              // Ici, vous auriez besoin d'un système pour stocker ces valeurs
                              console.log(`${field}:`, e.target.value);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {fileError && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                      {fileError}
                    </div>
                  )}
                  <Button
                    className="w-full bg-[#67B142] hover:bg-[#67B142]/90 text-white rounded-xl h-12"
                    onClick={handleAddContact}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter le contact
                  </Button>
                </div>
              ) : (
                // Bulk Import Section
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full h-24 rounded-xl border-2 hover:border-[#67B142] hover:text-[#67B142] transition-all duration-300"
                        onClick={handleDownloadTemplate}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <Download className="w-6 h-6" />
                          <span>Télécharger le modèle</span>
                        </div>
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        {...getRootProps()}
                        variant="outline"
                        className="w-full h-24 rounded-xl border-2 hover:border-[#67B142] hover:text-[#67B142] transition-all duration-300"
                        // onClick={handleBulkImportClick}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <Upload className="w-6 h-6" />
                          <input {...getInputProps()} />
                          Importer un fichier
                        </div>
                      </Button>
                    </motion.div>
                  </div>

                  {fileError && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                      {fileError}
                    </div>
                  )}

                  {contacts.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Aperçu des contacts importés
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#67B142] font-medium">
                            {contacts.length} contacts
                          </span>
                          <button
                            className="bg-red-500 text-white rounded-[6px] text-xs outline-none p-1.5"
                            onClick={() => setContacts([])}
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-2 relative">
                        {contacts.slice(0, 5).map((contact, index) => (
                          <div
                            key={index}
                            className="p-3 bg-gray-50 rounded-xl flex items-center justify-between"
                            onMouseEnter={() => setIsActiveIndex(index)}
                            onMouseLeave={() => setIsActiveIndex(null)}
                          >
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">
                                {contact.prenom} {contact.nom}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-gray-500">
                                {contact.telephone}
                              </span>
                              {contact.moyenne !== undefined && (
                                <span className="font-medium text-[#67B142]">
                                  {Number(contact.moyenne).toFixed(2)}/20
                                </span>
                              )}
                            </div>
                            {typeof index !== null &&
                              index === isActiveIndex && (
                                <button
                                  onClick={() =>
                                    setContacts((prevCon) =>
                                      prevCon.filter(
                                        (c) => c.telephone !== contact.telephone
                                      )
                                    )
                                  }
                                  className="absolute left-[94%] z-[999] bg-red-100 p-1.5 text-red-500 rounded"
                                >
                                  <Trash className="h-4 w-4" />
                                </button>
                              )}
                          </div>
                        ))}
                        {contacts.length > 5 && (
                          <div className="text-center text-sm text-gray-500">
                            + {contacts.length - 5} autres contacts
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Campaign Options */}
            <div className="p-6 bg-white rounded-2xl shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#67B142]/10 rounded-xl">
                  <Tag className="w-5 h-5 text-[#67B142]" />
                </div>
                <span className="font-medium text-gray-800">
                  Options de campagne
                </span>
              </div>

              <div className="space-y-6">
                {/* Campaign Type Options */}
                <div className="space-y-3">
                  <span className="text-sm font-medium text-gray-700">
                    Type de message
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    {campaignOptions[campaignType].map((option) => (
                      <motion.div
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={
                            responseType === option.value
                              ? "default"
                              : "outline"
                          }
                          className={`w-full h-auto py-4 rounded-xl transition-all duration-300 ${
                            responseType === option.value
                              ? "bg-[#67B142] hover:bg-[#67B142]/90 shadow-lg"
                              : "border-2 hover:border-[#67B142] hover:text-[#67B142]"
                          }`}
                          onClick={() => handleOptionSelect(option.value)}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span>{option.label}</span>
                            <span className="text-xs opacity-70">
                              {option.description}
                            </span>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Response Management */}
                <div className="space-y-3">
                  <span className="text-sm font-medium text-gray-700">
                    Gestion des réponses
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        value: "no-response",
                        label: "Sans réponses",
                        description: "Communication à sens unique",
                      },
                      {
                        value: "with-response",
                        label: "Avec réponses",
                        description: "Dialogue bidirectionnel",
                      },
                    ].map((option) => (
                      <motion.div
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={
                            responseType === option.value
                              ? "default"
                              : "outline"
                          }
                          className={`w-full h-auto py-4 rounded-xl transition-all duration-300 ${
                            responseType === option.value
                              ? "bg-[#67B142] hover:bg-[#67B142]/90 shadow-lg"
                              : "border-2 hover:border-[#67B142] hover:text-[#67B142]"
                          }`}
                          onClick={() => handleOptionSelect(option.value)}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span>{option.label}</span>
                            <span className="text-xs opacity-70">
                              {option.description}
                            </span>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Add signature selection */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Signature
                </label>
                <Select value={signature} onValueChange={setSignature}>
                  <SelectTrigger className="max-w-sm">
                    <SelectValue placeholder="Sélectionnez une signature" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={session?.user.companyName || ""}>
                      {session?.user.companyName || ""}
                    </SelectItem>
                    <SelectItem value="SY-PRESSING">SY-PRESSING</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Launch Button */}
            <div className="flex justify-end gap-4 mt-8">
              <Button variant="outline" className="rounded-[6px]">
                Annuler
              </Button>
              <Button
                onClick={handleSendCampaign}
                disabled={
                  loading || !message || !signature || contacts.length === 0
                }
                className="bg-[#67B142] hover:bg-[#67B142]/90 rounded-[6px]"
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer la campagne
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Success/Error messages */}
        {success && (
          <div className="bg-green-50 text-green-800 p-4 rounded-md mt-4">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-md mt-4">
            {error}
          </div>
        )}
      </div>

      {/* Add StatusModal before closing div */}
      <StatusModal />
      <LoadingDialog open={uploadState.loading} />
    </div>
  );
}
