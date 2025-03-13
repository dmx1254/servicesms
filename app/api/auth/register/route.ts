// app/api/user/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import VerificationModel from "@/app/lib/models/verification.model";
import UserModel from "@/app/lib/models/user.model";

import { Resend } from "resend";
import { connectDB } from "@/app/lib/db";
import { RegisterTemplate } from "@/components/template/register-template";
import { SignupSuccessTemplate } from "@/components/template/signup-success-template";
import { AdminNotificationTemplate } from "@/components/template/admin-notification-template";

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

    const newUser = {
      ...rest,
      pendingCompanyName: rest.companyName,
      companyNameStatus: "pending",
      smsCredits: 5,
    };

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      ...newUser,
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
      from: "axiomtext <noreply@axiomtext.com>",
      to: data.email,
      subject: "Code de verification AxiomTEXT",
      react: RegisterTemplate({ verificationCode }),
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
    const user = await UserModel.create(verification.userData);

    // Supprimer le code de vérification
    await VerificationModel.deleteOne({ _id: verification._id });

    // Envoyer l'email de succès à l'utilisateur
    await resend.emails.send({
      from: "axiomtext <noreply@axiomtext.com>",
      to: email,
      subject: "Inscription réussie - AxiomTEXT",
      react: SignupSuccessTemplate({
        firstName: verification.userData.firstName,
        lastName: verification.userData.lastName,
        companyName: verification.userData.companyName,
      }),
    });

    // Envoyer la notification à l'admin
    await resend.emails.send({
      from: "axiomtext <noreply@axiomtext.com>",
      to: process.env.ADMIN_EMAIL || "mamadousy1254@gmail.com",
      subject: "Nouvelle inscription - AxiomTEXT",
      react: AdminNotificationTemplate({
        firstName: verification.userData.firstName,
        lastName: verification.userData.lastName,
        email: verification.userData.email,
        phone: verification.userData.phone,
        companyName: verification.userData.companyName,
        accountType: verification.userData.accountType,
      }),
    });

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
