interface ContactTemplateProps {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  isConfirmation?: boolean;
}

export const ContactTemplate = ({
  firstName,
  lastName,
  email,
  phone,
  subject,
  message,
  isConfirmation = false,
}: ContactTemplateProps) => {
  if (isConfirmation) {
    return (
      <div>
        <h1>Confirmation de réception de votre message</h1>
        <p>Bonjour {firstName} {lastName},</p>
        <p>
          Nous avons bien reçu votre message et nous vous en remercions.
          Notre équipe va l&apos;étudier et vous répondra dans les plus brefs délais.
        </p>
        <p>
          En attendant, n&apos;hésitez pas à consulter notre site web pour plus d&apos;informations
          sur nos services.
        </p>
        <p>
          Cordialement,<br />
          L&apos;équipe AxiomText
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>Nouveau message de contact</h1>
      <div>
        <h2>Informations du contact :</h2>
        <ul>
          <li><strong>Nom :</strong> {firstName} {lastName}</li>
          <li><strong>Email :</strong> {email}</li>
          <li><strong>Téléphone :</strong> {phone}</li>
        </ul>
      </div>
      <div>
        <h2>Message :</h2>
        <p><strong>Sujet :</strong> {subject}</p>
        <p style={{ whiteSpace: "pre-wrap" }}>{message}</p>
      </div>
    </div>
  );
}; 