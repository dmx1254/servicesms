// app/api/user/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import VerificationModel from "@/app/lib/models/verification.model";
import UserModel from "@/app/lib/models/user.model";

import { Resend } from "resend";
import { connectDB } from "@/app/lib/db";

const resend = new Resend(process.env.RESEND_SERVICESMS_API_KEY);

connectDB();

// Fonction pour générer un code aléatoire
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { password, ...rest } = data;

    const isUserAlreadyEmailExist = await UserModel.findOne({
      email: data.email,
    });
    if (isUserAlreadyEmailExist) {
      return NextResponse.json(
        { error: "Cette adresse email est déjà utilisée" },
        { status: 400 }
      );
    }

    const isUserAlreadyPhoneExist = await UserModel.findOne({
      phone: data.phone,
    });
    if (isUserAlreadyPhoneExist) {
      return NextResponse.json(
        { error: "Ce numéro de téléphone est déjà utilisé" },
        { status: 400 }
      );
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      ...rest,
      password: hashedPassword,
    };

    // Générer le code de vérification
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 1800000); // Expire dans 1 heure

    // Sauvegarder le code et les données utilisateur temporairement
    await VerificationModel.create({
      email: data.email,
      code: verificationCode,
      userData,
      expiresAt,
    });

    // Envoyer l'email avec Resend
    await resend.emails.send({
      from: "servicesms <noreply@ibendouma.com>",
      to: data.email,
      subject: "Vérifiez votre adresse email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #67B142;">Bienvenue sur servicesms</h2>
          <p>Merci de vous être inscrit ! Pour finaliser votre inscription, veuillez utiliser le code suivant :</p>
          <div style="background-color: #F3F4F6; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="font-size: 32px; letter-spacing: 5px; margin: 0; color: #1F2937;">${verificationCode}</h1>
          </div>
          <p>Ce code expirera dans une 30 minutes.</p>
          <p>Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email.</p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "Code de vérification envoyé", email: data.email },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur d'inscription:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'inscription" },
      { status: 500 }
    );
  }
}

// Route pour vérifier le code
export async function PUT(req: Request) {
  try {
    const { email, code } = await req.json();

    const verification = await VerificationModel.findOne({
      email,
      code,
      expiresAt: { $gt: new Date() },
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Code invalide ou expiré" },
        { status: 400 }
      );
    }

    // Créer l'utilisateur avec les données stockées
    await UserModel.create(verification.userData);

    // Supprimer le code de vérification
    await VerificationModel.deleteOne({ _id: verification._id });

    return NextResponse.json(
      { message: "Inscription validée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur de vérification:", error);
    return NextResponse.json(
      { error: "Erreur lors de la vérification" },
      { status: 500 }
    );
  }
}
