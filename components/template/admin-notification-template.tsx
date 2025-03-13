import React from "react";

interface AdminNotificationTemplateProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName?: string;
  accountType: "personal" | "business";
}

export const AdminNotificationTemplate: React.FC<AdminNotificationTemplateProps> = ({
  firstName,
  lastName,
  email,
  phone,
  companyName,
  accountType,
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
          Nouvelle inscription
        </h1>
      </div>

      <div style={{ 
        padding: "40px 20px", 
        backgroundColor: "#ffffff",
        borderRadius: "0 0 8px 8px",
        border: "1px solid #e5e7eb",
        borderTop: "none"
      }}>
        <div style={{ 
          backgroundColor: "#f3f4f6", 
          padding: "20px", 
          borderRadius: "8px",
          marginBottom: "24px" 
        }}>
          <h2 style={{ 
            color: "#111827", 
            fontSize: "18px", 
            margin: "0 0 16px 0" 
          }}>
            Informations du nouvel utilisateur
          </h2>
          
          <div style={{ 
            display: "grid", 
            gap: "12px" 
          }}>
            <div>
              <strong style={{ color: "#374151" }}>Nom complet :</strong>
              <p style={{ 
                color: "#374151", 
                margin: "4px 0 0 0",
                fontSize: "16px" 
              }}>
                {firstName} {lastName}
              </p>
            </div>

            <div>
              <strong style={{ color: "#374151" }}>Email :</strong>
              <p style={{ 
                color: "#374151", 
                margin: "4px 0 0 0",
                fontSize: "16px" 
              }}>
                {email}
              </p>
            </div>

            <div>
              <strong style={{ color: "#374151" }}>Téléphone :</strong>
              <p style={{ 
                color: "#374151", 
                margin: "4px 0 0 0",
                fontSize: "16px" 
              }}>
                {phone}
              </p>
            </div>

            <div>
              <strong style={{ color: "#374151" }}>Type de compte :</strong>
              <p style={{ 
                color: "#374151", 
                margin: "4px 0 0 0",
                fontSize: "16px" 
              }}>
                {accountType === "business" ? "Professionnel" : "Personnel"}
              </p>
            </div>

            {companyName && (
              <div>
                <strong style={{ color: "#374151" }}>Entreprise :</strong>
                <p style={{ 
                  color: "#374151", 
                  margin: "4px 0 0 0",
                  fontSize: "16px" 
                }}>
                  {companyName}
                </p>
              </div>
            )}
          </div>
        </div>

        <div style={{ 
          backgroundColor: "#fef3c7", 
          padding: "20px", 
          borderRadius: "8px",
          marginBottom: "24px" 
        }}>
          <p style={{ 
            color: "#92400e", 
            fontSize: "16px", 
            margin: 0,
            fontWeight: "500" 
          }}>
            Action requise : Veuillez valider la signature de cet utilisateur pour qu&apos;il puisse commencer à envoyer des SMS.
          </p>
        </div>

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
            Cet email a été envoyé automatiquement par le système de notification AxiomTEXT.
          </p>
        </div>
      </div>
    </div>
  );
}; 