export type SMSErrorCode =
  | "100"
  | "101"
  | "102"
  | "104"
  | "105"
  | "106"
  | "107"
  | "110"
  | "113"
  | "115"
  | "116"
  | "121"
  | "200"
  | "401";

export interface SMSError {
  code: SMSErrorCode;
  message: string;
  solution?: string;
}

export const SMS_ERROR_CODES: Record<SMSErrorCode, SMSError> = {
  "401": {
    code: "401",
    message: "Échec d'authentification auprès du serveur",
    solution: "S'assurer que vous utilisez le bon token comme mot de passe",
  },
  "100": {
    code: "100",
    message: "Indicatif inconnu",
    solution: "Le numéro n'existe pas",
  },
  "101": {
    code: "101",
    message: "Message vide",
    solution: "Le contenu du message est vide",
  },
  "102": {
    code: "102",
    message: "Signature invalide",
    solution:
      "Signature en attente de validation ou bloquée. Contactez le support kiwi pour la valider ou créez une nouvelle signature dans votre compte OrangeSMSPro",
  },
  "104": {
    code: "104",
    message: "Erreur interne",
    solution: "Contactez le support kiwi",
  },
  "105": {
    code: "105",
    message: "Numéro vide",
    solution: "Ajouter un numéro destinataire valide",
  },
  "106": {
    code: "106",
    message: "Numéro incorrect",
    solution: "Ajouter un numéro destinataire valide",
  },
  "110": {
    code: "110",
    message: "Numéro trop court ou trop long",
    solution: "Mettre le format du numéro comme suit: <indicatif>+<numéro> sans +",
  },
  "107": {
    code: "107",
    message: "Paramètres URL invalides",
    solution: "La liste des paramètres est incomplète. Vérifier tous les paramètres",
  },
  "113": {
    code: "113",
    message: "Erreur inconnue",
    solution: "Contactez le support kiwi",
  },
  "115": {
    code: "115",
    message: "Requête expirée",
    solution: "Clé publique déjà utilisée. Générer une nouvelle valeur",
  },
  "116": {
    code: "116",
    message: "Token invalide",
    solution: "Mettez à jour votre code en copiant le token depuis votre compte OrangeSMSPro",
  },
  "121": {
    code: "121",
    message: "Paramètre KEY généré est invalide",
    solution:
      "Le résultat de votre clé publique et celui du serveur ne correspondent pas. Vérifiez la section Calcul de la clé publique et si vous utilisez une clé secrète valide",
  },
  "200": {
    code: "200",
    message: "Message envoyé",
  },
};

export function getSMSErrorDetails(code: SMSErrorCode): SMSError {
  return SMS_ERROR_CODES[code] || {
    code: "113",
    message: "Erreur inconnue",
    solution: "Contactez le support kiwi",
  };
}

export function formatSMSErrorMessage(error: SMSError): string {
  return `${error.message}${error.solution ? ` (${error.solution})` : ""}`;
} 