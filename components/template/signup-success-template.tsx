import React from "react";

interface SignupSuccessTemplateProps {
  firstName: string;
  lastName: string;
  companyName?: string;
}

export const SignupSuccessTemplate: React.FC<SignupSuccessTemplateProps> = ({
  firstName,
  lastName,
  companyName,
}) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ 
        background: "linear-gradient(135deg, #67B142 0%, #34A853 100%)", 
        padding: "40px 20px",
        textAlign: "center",
        borderRadius: "8px 8px 0 0"
      }}>
        <h1 style={{ 
          color: "#ffffff", 
          margin: 0, 
          fontSize: "24px", 
          fontWeight: "bold" 
        }}>
          Inscription réussie !
        </h1>
      </div>

      <div style={{ 
        padding: "40px 20px", 
        backgroundColor: "#ffffff",
        borderRadius: "0 0 8px 8px",
        border: "1px solid #e5e7eb",
        borderTop: "none"
      }}>
        <p style={{ 
          color: "#374151", 
          fontSize: "16px", 
          lineHeight: "1.6",
          marginBottom: "24px" 
        }}>
          Bonjour {firstName} {lastName},
        </p>

        <p style={{ 
          color: "#374151", 
          fontSize: "16px", 
          lineHeight: "1.6",
          marginBottom: "24px" 
        }}>
          Nous sommes ravis de vous accueillir sur AxiomTEXT. Votre compte a été créé avec succès.
        </p>

        {companyName && (
          <p style={{ 
            color: "#374151", 
            fontSize: "16px", 
            lineHeight: "1.6",
            marginBottom: "24px" 
          }}>
            Votre entreprise : <strong>{companyName}</strong>
          </p>
        )}

        <div style={{ 
          backgroundColor: "#f3f4f6", 
          padding: "20px", 
          borderRadius: "8px",
          marginBottom: "24px" 
        }}>
          <p style={{ 
            color: "#374151", 
            fontSize: "16px", 
            lineHeight: "1.6",
            margin: 0 
          }}>
            <strong>Prochaines étapes :</strong>
          </p>
          <ul style={{ 
            color: "#374151", 
            fontSize: "16px", 
            lineHeight: "1.6",
            margin: "12px 0 0 0",
            paddingLeft: "20px" 
          }}>
            <li>Notre équipe va examiner votre signature</li>
            <li>Vous recevrez une notification une fois votre signature validée</li>
            <li>Vous pourrez alors commencer à envoyer des SMS</li>
          </ul>
        </div>

        <p style={{ 
          color: "#374151", 
          fontSize: "16px", 
          lineHeight: "1.6",
          marginBottom: "24px" 
        }}>
          En attendant, vous pouvez :
        </p>

        <ul style={{ 
          color: "#374151", 
          fontSize: "16px", 
          lineHeight: "1.6",
          marginBottom: "24px",
          paddingLeft: "20px" 
        }}>
          <li>Compléter votre profil</li>
          <li>Explorer notre documentation</li>
          <li>Préparer vos campagnes SMS</li>
        </ul>

        <p style={{ 
          color: "#374151", 
          fontSize: "16px", 
          lineHeight: "1.6",
          marginBottom: "24px" 
        }}>
          Si vous avez des questions, n&apos;hésitez pas à nous contacter.
        </p>

        <div style={{ 
          borderTop: "1px solid #e5e7eb", 
          paddingTop: "24px", 
          marginTop: "24px" 
        }}>
          <p style={{ 
            color: "#6b7280", 
            fontSize: "14px", 
            margin: 0 
          }}>
            Cet email a été envoyé automatiquement, merci de ne pas y répondre.
          </p>
        </div>
      </div>
    </div>
  );
}; 