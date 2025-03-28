

export const rewriteMessage = (
  contact: any,
  message: string,
  signature: string
): string => {
  const fullname = `${contact.prenom} ${contact.nom}` || "";
  let newMessage = message;

  // Remplacements pour les variables communes à tous les types de templates
  newMessage = newMessage
    .replace(/{first_name}/g, contact.prenom || "")
    .replace(/{last_name}/g, contact.nom || "")
    .replace(/{student_name}/g, fullname)
    .replace(/{company}/g, contact.company || signature);

  // Remplacements pour les variables marketing
  newMessage = newMessage
    .replace(/{discount}/g, contact.discount || "")
    .replace(/{product_name}/g, contact.product_name || "")
    .replace(/{expiry_date}/g, contact.expiry_date || "")
    .replace(/{offer_code}/g, contact.offer_code || contact.code_promo || "")
    .replace(
      /{event_date}/g,
      contact.event_date || contact.date_evenement || ""
    );

  // Remplacements pour les variables transactionnelles
  newMessage = newMessage
    .replace(
      /{order_number}/g,
      contact.order_number || contact.numero_commande || ""
    )
    .replace(
      /{payment_amount}/g,
      contact.payment_amount || contact.montant || ""
    )
    .replace(
      /{tracking_code}/g,
      contact.tracking_code || contact.numero_suivi || ""
    )
    .replace(
      /{delivery_date}/g,
      contact.delivery_date || contact.date_livraison || ""
    )
    .replace(/{service_name}/g, contact.service_name || contact.service || "")
    .replace(/{reference}/g, contact.reference || "")
    .replace(
      /{appointment_time}/g,
      contact.appointment_time || contact.heure_rdv || ""
    );

  // Remplacements pour les variables académiques
  newMessage = newMessage
    .replace(/{class_name}/g, contact.classe || "")
    .replace(/{average_grade}/g, contact.average_grade || contact.moyenne || "")
    .replace(
      /{school_name}/g,
      contact.school_name || contact.etablissement || ""
    )
    .replace(/{exam_results}/g, contact.exam_results || contact.resultats || "")
    .replace(
      /{overall_average}/g,
      contact.overall_average || contact.moyenne_generale || ""
    )
    .replace(
      /{absence_date}/g,
      contact.absence_date || contact.date_absence || ""
    )
    .replace(
      /{arrival_time}/g,
      contact.arrival_time || contact.heure_arrivee || ""
    )
    .replace(/{date}/g, contact.date || "")
    .replace(
      /{meeting_date}/g,
      contact.meeting_date || contact.date_reunion || ""
    )
    .replace(
      /{meeting_time}/g,
      contact.meeting_time || contact.heure_reunion || ""
    )
    .replace(/{room}/g, contact.room || contact.salle || "")
    .replace(/{event_name}/g, contact.event_name || contact.nom_evenement || "")
    .replace(/{location}/g, contact.location || contact.lieu || "")
    .replace(/{incident}/g, contact.incident || "")
    .replace(/{measure}/g, contact.measure || contact.mesure_prise || "")
    .replace(/{subject}/g, contact.subject || contact.matiere || "")
    .replace(/{homework}/g, contact.homework || contact.devoir || "")
    .replace(/{due_date}/g, contact.due_date || contact.date_limite || "");

  return newMessage;
};
