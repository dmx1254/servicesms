import React from 'react';

interface ResetPasswordTemplateProps {
  verificationCode: string;
}

export const ResetPasswordTemplate: React.FC<ResetPasswordTemplateProps> = ({ verificationCode }) => {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      padding: '40px',
      color: '#333333'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{
          color: '#67B142',
          fontSize: '28px',
          margin: '0',
          fontWeight: '600'
        }}>
          Réinitialisation du mot de passe
        </h1>
      </div>

      {/* Main Content */}
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
        padding: '30px',
        marginBottom: '30px'
      }}>
        <p style={{
          fontSize: '16px',
          lineHeight: '1.6',
          margin: '0 0 20px 0'
        }}>
          Vous avez demandé la réinitialisation de votre mot de passe. Utilisez le code de vérification ci-dessous pour continuer le processus :
        </p>

        {/* Verification Code Box */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid #67B142',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          margin: '20px 0'
        }}>
          <div style={{
            fontSize: '32px',
            letterSpacing: '8px',
            color: '#67B142',
            fontWeight: 'bold',
            fontFamily: 'monospace'
          }}>
            {verificationCode}
          </div>
        </div>

        <p style={{
          fontSize: '14px',
          color: '#666666',
          margin: '0'
        }}>
          Ce code expirera dans 30 minutes.
        </p>
      </div>

      {/* Security Notice */}
      <div style={{
        borderTop: '1px solid #e0e0e0',
        paddingTop: '20px',
        marginTop: '20px'
      }}>
        <p style={{
          fontSize: '14px',
          color: '#666666',
          margin: '0 0 10px 0'
        }}>
          Pour des raisons de sécurité :
        </p>
        <ul style={{
          fontSize: '14px',
          color: '#666666',
          margin: '0',
          paddingLeft: '20px'
        }}>
          <li style={{ marginBottom: '5px' }}>Ne partagez jamais ce code avec qui que ce soit</li>
          <li style={{ marginBottom: '5px' }}>L&apos;équipe AxiomTEXT ne vous demandera jamais ce code</li>
          <li>Assurez-vous d&apos;utiliser un mot de passe fort et unique</li>
        </ul>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #e0e0e0'
      }}>
        <p style={{
          fontSize: '12px',
          color: '#999999',
          margin: '0'
        }}>
          Si vous n&apos;avez pas demandé la réinitialisation de votre mot de passe, veuillez ignorer cet email et sécuriser votre compte.
        </p>
      </div>
    </div>
  );
}; 