import { NextResponse } from "next/server";
import { Resend } from "resend";
import UserModel from "@/app/lib/models/user.model";
import VerificationModel from "@/app/lib/models/verification.model";
import { ResetPasswordTemplate } from "@/components/template/reset-password-template";
import { connectDB } from "@/app/lib/db";

const resend = new Resend(process.env.RESEND_SERVICESMS_API_KEY);

// Fonction pour générer un code aléatoire
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email } = await request.json();

    // Vérifier si l'utilisateur existe
    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Aucun compte trouvé avec cette adresse email" },
        { status: 404 }
      );
    }

    // Générer un code de vérification
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 1800000); // 30 minutes

    // Supprimer tout code existant pour cet email
    await VerificationModel.deleteMany({ email });

    // Sauvegarder le nouveau code
    await VerificationModel.create({
      email,
      code: verificationCode,
      expiresAt,
    });

    // Envoyer l'email avec le code
    await resend.emails.send({
      from: "axiomtext <noreply@axiomtext.com>",
      to: email,
      subject: "Réinitialisation de votre mot de passe - AxiomTEXT",
      react: ResetPasswordTemplate({ verificationCode }) as React.ReactElement,
    });

    return NextResponse.json(
      { message: "Code de vérification envoyé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot-password route:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'envoi du code" },
      { status: 500 }
    );
  }
} 